import request from '@/utils/request'

export function login(data: any) {
  return request({
    url: '/auth/login',
    method: 'post',
    data,
  })
}
export function getUserInfo(data: any) {
  return request({
    url: '/auth/sign',
    method: 'post',
  })
}
