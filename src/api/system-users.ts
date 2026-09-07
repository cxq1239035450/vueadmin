import request from '@/utils/request'
import { demoEnabled } from '@/config/app'
import type { AdminUser, PageResult, UserForm, UserQuery } from '@/types/table'

// 这是模板默认的 REST 接口契约；更换后端只需在此映射 URL、参数和响应。
export async function listUsers(
  query: UserQuery,
  signal: AbortSignal
): Promise<PageResult<AdminUser>> {
  if (demoEnabled) return (await import('@/mock')).listUsers(query, signal)
  return request<PageResult<AdminUser>>({
    url: '/users',
    params: query,
    signal,
    silent: true,
  })
}
export async function saveUser(form: UserForm, id?: AdminUser['id']) {
  if (demoEnabled) return (await import('@/mock')).saveUser(form, id)
  return request({
    url: id === undefined ? '/users' : `/users/${encodeURIComponent(id)}`,
    method: id === undefined ? 'post' : 'patch',
    data: form,
    skipDedup: true,
    silent: true,
  })
}
export async function deleteUser(id: AdminUser['id']) {
  if (demoEnabled) return (await import('@/mock')).deleteUser(id)
  return request({
    url: `/users/${encodeURIComponent(id)}`,
    method: 'delete',
    skipDedup: true,
    silent: true,
  })
}
