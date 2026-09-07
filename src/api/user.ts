import request from '@/utils/request'
import type { ApiResponse, User } from '@/types/api'

export function getUserList(params: Record<string, string> = {}) {
  return request<ApiResponse<User[]>>({
    url: '/user/list',
    method: 'get',
    params,
  })
}
