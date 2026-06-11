import request from '@/utils/request'
import type { LoginParams, LoginResult, UserInfo } from '@/type/api'

export function login(data: LoginParams): Promise<LoginResult> {
  return request({
    url: '/auth/login',
    method: 'post',
    data,
    skipDedup: true,
  })
}

export function getUserInfo(): Promise<UserInfo> {
  return request({
    url: '/user/info',
    method: 'get',
  })
}
