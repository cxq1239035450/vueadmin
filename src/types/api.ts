export interface ApiResponse<T> {
  data: T
}

export interface LoginParams {
  username: string
  password: string
}

export interface TaskQuery {
  jobName: string
  pageSize: number
}

export interface Task {
  id: number | string
  name: string
  description: string
  executionTime: string
  createTime: string
  status: 0 | 1
  preExecutionTime?: string
  executionResult?: string
}

export interface TaskForm {
  name: string
  description: string
  url: string
  headers: Record<string, string>
  data: string
  executionTime: string
}

export interface User {
  date?: string
  username: string
  address?: string
}
