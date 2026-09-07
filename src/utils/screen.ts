import type { AxiosRequestConfig } from 'axios'

const serialize = (data: unknown): string | undefined => {
  if (typeof data === 'string') return data
  return JSON.stringify(data)
}

export const getPendingKey = (config: AxiosRequestConfig): string => {
  const { baseURL, url, method, data, params } = config
  return JSON.stringify([
    baseURL,
    url,
    (method || 'get').toLowerCase(),
    serialize(data),
    serialize(params),
  ])
}
