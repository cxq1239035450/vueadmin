import request from '@/utils/request'

export function getUserList(params: any) {
  return request({
    url: '/user/list',
    method: 'get',
    params,
  })
}