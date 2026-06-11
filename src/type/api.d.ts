export interface LoginParams {
  username: string
  password: string
}

export interface LoginResult {
  access_token: string
  token_type?: string
  expires_in?: number
}

export interface UserInfo {
  id?: number
  username?: string
  nickname?: string
  avatar?: string
  email?: string
  roles?: string[]
  permissions?: string[]
  [key: string]: any
}

export interface TaskItem {
  id: number
  name: string
  status: 'pending' | 'running' | 'stopped' | 'completed'
  created_at?: string
  updated_at?: string
  [key: string]: any
}

export interface PageResult<T> {
  list: T[]
  total: number
  page: number
  page_size: number
}

export interface ApiResponse<T> {
  code: number
  msg?: string
  data: T
}

export interface PageParams {
  page?: number
  page_size?: number
  [key: string]: any
}
