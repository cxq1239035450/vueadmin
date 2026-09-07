/** 不依赖 UI 的竞态控制；过期任务即使忽略 signal 也不会覆盖最新结果。 */
export function createLatestTask() {
  let version = 0
  let controller: AbortController | undefined
  return {
    start() {
      controller?.abort()
      controller = new AbortController()
      const current = ++version
      return { signal: controller.signal, isCurrent: () => current === version }
    },
    cancel() {
      version++
      controller?.abort()
    },
  }
}
