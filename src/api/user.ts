import request from '@/utils/request'
import type { UserInfo, ApiResponse } from '@/type/api'

export function getUserList(params: Record<string, unknown>): Promise<ApiResponse<UserInfo[]>> {
  return request({
    url: '/user/list',
    method: 'get',
    params,
  })
}
