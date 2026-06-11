import request from '@/utils/request'

export function getChatMemory() {
  return request({
    url: '/langchain/memory',
    method: 'get',
    skipDedup: true,
  })
}

export function clearChatMemory() {
  return request({
    url: '/langchain/memory',
    method: 'delete',
    skipDedup: true,
  })
}
