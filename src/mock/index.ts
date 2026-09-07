import { appConfig } from '@/config/app'
import { tokenStorage } from '@/utils/storage'
import type { LoginParams } from '@/types/api'
import type { UserInfo } from '@/types/auth'
import type { AdminUser, UserForm, UserQuery, PageResult } from '@/types/table'
import { hasAccess } from '@/utils/access'

const accounts: Record<string, UserInfo> = {
  guest: {
    id: 3,
    username: 'guest',
    nickname: '访客',
    roles: ['guest'],
    permissions: [],
  },
  admin: {
    id: 1,
    username: 'admin',
    nickname: '管理员',
    roles: ['admin'],
    permissions: ['*'],
  },
  viewer: {
    id: 2,
    username: 'viewer',
    nickname: '只读成员',
    roles: ['viewer'],
    permissions: ['user:read'],
  },
}
export async function demoLogin(data: LoginParams): Promise<string> {
  if (!Object.hasOwn(accounts, data.username) || data.password !== '123456')
    throw new Error('演示账号或密码不正确')
  return `demo:${data.username}`
}
export async function demoUserInfo(): Promise<UserInfo> {
  const name = tokenStorage.get()?.replace(/^demo:/, '') ?? ''
  if (!Object.hasOwn(accounts, name)) throw new Error('演示登录已失效')
  return structuredClone(accounts[name])
}
async function authorize(permission: string) {
  const info = await demoUserInfo()
  if (!hasAccess(info, { permissions: [permission] }))
    throw new Error('无操作权限')
}
const key = `${appConfig.storagePrefix}:demo-users`
function seed(): AdminUser[] {
  return Array.from({ length: 24 }, (_, index) => ({
    id: index + 1,
    username: `member_${String(index + 1).padStart(2, '0')}`,
    email: `member${index + 1}@example.com`,
    role: index === 0 ? 'admin' : 'viewer',
    status: index % 5 === 0 ? 'disabled' : 'enabled',
    createdAt: new Date(2026, 0, index + 1).toISOString(),
  }))
}
function read(): AdminUser[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(key) ?? 'null')
    if (
      Array.isArray(value) &&
      value.every(
        item =>
          item &&
          (typeof item.id === 'string' || typeof item.id === 'number') &&
          typeof item.username === 'string' &&
          typeof item.email === 'string' &&
          ['admin', 'viewer'].includes(item.role) &&
          ['enabled', 'disabled'].includes(item.status) &&
          typeof item.createdAt === 'string'
      )
    )
      return value
  } catch {
    /* 损坏的演示数据恢复为初始值。 */
  }
  return seed()
}
function save(rows: AdminUser[]) {
  localStorage.setItem(key, JSON.stringify(rows))
}
export async function listUsers(
  query: UserQuery,
  signal?: AbortSignal
): Promise<PageResult<AdminUser>> {
  await authorize('user:read')
  signal?.throwIfAborted()
  const keyword = query.keyword.trim().toLowerCase()
  const rows = read().filter(
    row =>
      (!keyword ||
        `${row.username} ${row.email}`.toLowerCase().includes(keyword)) &&
      (!query.status || row.status === query.status)
  )
  const start = (query.page - 1) * query.pageSize
  return { list: rows.slice(start, start + query.pageSize), total: rows.length }
}
export async function saveUser(form: UserForm, id?: AdminUser['id']) {
  await authorize(id === undefined ? 'user:create' : 'user:update')
  const rows = read()
  if (!form.username.trim() || !form.email.trim())
    throw new Error('用户名和邮箱不能为空')
  if (rows.some(row => row.id !== id && row.username === form.username.trim()))
    throw new Error('用户名已存在')
  if (id === undefined)
    rows.unshift({
      ...form,
      username: form.username.trim(),
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    })
  else {
    const index = rows.findIndex(row => row.id === id)
    if (index < 0) throw new Error('用户不存在，请刷新')
    rows[index] = { ...rows[index], ...form, username: form.username.trim() }
  }
  save(rows)
}
export async function deleteUser(id: AdminUser['id']) {
  await authorize('user:delete')
  save(read().filter(row => row.id !== id))
}
