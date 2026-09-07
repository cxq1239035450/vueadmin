export interface PageQuery {
  page: number
  pageSize: number
}
export interface PageResult<T> {
  list: T[]
  total: number
}
export interface AdminUser {
  id: string | number
  username: string
  email: string
  role: 'admin' | 'viewer'
  status: 'enabled' | 'disabled'
  createdAt: string
}
export type UserForm = Pick<AdminUser, 'username' | 'email' | 'role' | 'status'>
export interface UserQuery extends PageQuery {
  keyword: string
  status: string
}
