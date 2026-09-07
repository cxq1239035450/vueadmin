import request from '@/utils/request'
import type { ApiResponse, Task, TaskForm, TaskQuery } from '@/types/api'

export function getTasksList(params: TaskQuery) {
  return request<ApiResponse<{ list: Task[]; total: number }>>({
    url: '/tasks/list',
    method: 'get',
    params,
  })
}

export function addTask(data: TaskForm) {
  return request({
    url: '/tasks/add',
    method: 'post',
    data,
    skipDedup: true,
  })
}

export function stopTask(data: Pick<Task, 'id'>) {
  return request({
    url: '/tasks/stop',
    method: 'post',
    data,
    skipDedup: true,
  })
}

export function startTask(data: Pick<Task, 'id'>) {
  return request({
    url: '/tasks/start',
    method: 'post',
    data,
    skipDedup: true,
  })
}
