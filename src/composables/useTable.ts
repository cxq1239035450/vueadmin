import { onMounted, onScopeDispose, reactive, ref, shallowRef } from 'vue'
import { createLatestTask } from '@/utils/latest-task'
import type { PageResult, PageQuery } from '@/types/table'
export function useTable<T, Q extends PageQuery>(
  fetcher: (query: Q, signal: AbortSignal) => Promise<PageResult<T>>,
  initial: Q
) {
  const query = reactive({ ...initial }) as Q
  const rows = shallowRef<T[]>([])
  const total = ref(0)
  const loading = ref(false)
  const error = ref('')
  const latest = createLatestTask()
  async function load(): Promise<void> {
    const task = latest.start()
    loading.value = true
    error.value = ''
    try {
      const result = await fetcher({ ...query }, task.signal)
      if (!task.isCurrent()) return
      const lastPage = Math.max(1, Math.ceil(result.total / query.pageSize))
      if (query.page > lastPage) {
        query.page = lastPage
        return await load()
      }
      rows.value = result.list
      total.value = result.total
    } catch (cause) {
      if (!task.isCurrent() || task.signal.aborted) return
      rows.value = []
      total.value = 0
      error.value = cause instanceof Error ? cause.message : '加载失败，请重试'
    } finally {
      if (task.isCurrent()) loading.value = false
    }
  }
  function search() {
    query.page = 1
    return load()
  }
  function reset() {
    Object.assign(query, initial)
    return load()
  }
  function changePage(page: number) {
    query.page = page
    return load()
  }
  function changeSize(size: number) {
    query.pageSize = size
    return search()
  }
  onMounted(load)
  onScopeDispose(() => latest.cancel())
  return {
    query,
    rows,
    total,
    loading,
    error,
    load,
    search,
    reset,
    changePage,
    changeSize,
  }
}
