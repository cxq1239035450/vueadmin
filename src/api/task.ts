import request from '@/utils/request'
import type { TaskItem, PageResult, PageParams, ApiResponse } from '@/type/api'

export function getTasksList(params: PageParams): Promise<ApiResponse<PageResult<TaskItem>>> {
  return request({
    url: '/tasks/list',
    method: 'get',
    params,
  })
}

export function addTask(data: Partial<TaskItem>): Promise<any> {
  return request({
    url: '/tasks/add',
    method: 'post',
    data,
    skipDedup: true,
  })
}

export function stopTask(data: { id: number }): Promise<any> {
  return request({
    url: '/tasks/stop',
    method: 'post',
    data,
    skipDedup: true,
  })
}

export function startTask(data: { id: number }): Promise<any> {
  return request({
    url: '/tasks/start',
    method: 'post',
    data,
    skipDedup: true,
  })
}
