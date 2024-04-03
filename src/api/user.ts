import request from '@/util/request'

export function getUserInfo(data: any) {
  return request({
    url: '/user/info',
  })
}
