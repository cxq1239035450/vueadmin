import request from '@/utils/request'
import { demoEnabled } from '@/config/app'
import type { ApiResponse, LoginParams } from '@/types/api'
import { normalizeUser } from '@/types/auth'
export async function login(data: LoginParams): Promise<string> {
  if (demoEnabled) return (await import('@/mock')).demoLogin(data)
  const result = await request<ApiResponse<{ access_token: string }>>({
    url: '/auth/login',
    method: 'post',
    data,
    skipDedup: true,
    skipAuth: true,
    silent: true,
  })
  if (!result.data?.access_token) throw new Error('登录响应缺少 access_token')
  return result.data.access_token
}
export async function getUserInfo() {
  if (demoEnabled) return (await import('@/mock')).demoUserInfo()
  return normalizeUser(
    await request<unknown>({ url: '/user/info', method: 'get' })
  )
}
