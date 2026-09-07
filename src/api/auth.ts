import request from '@/utils/request'
import type { ApiResponse, LoginParams } from '@/types/api'

export function login(data: LoginParams) {
  return request<ApiResponse<{ access_token: string }>>({
    url: '/auth/login',
    method: 'post',
    data,
    skipDedup: true,
  })
}

export function getUserInfo() {
  return request<Record<string, unknown>>({
    url: '/user/info',
    method: 'get',
  })
}
