import request from '@/utils/request'

export function getTasksList(params: any) {
  return request({
    url: '/tasks/list',
    method: 'get',
    params,
  })
}
export function addTask(data: any) {
  return request({
    url: '/tasks/add',
    method: 'post',
    data,
  })
}

export function stopTask(data: any) {
  return request({
    url: '/tasks/stop',
    method: 'post',
    data,
  })
}
