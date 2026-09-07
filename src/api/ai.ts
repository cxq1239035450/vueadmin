import { appConfig } from '@/config/app'
import { tokenStorage } from '@/utils/storage'
import { expireSession } from '@/utils/session'

export interface ChatMessage {
  role: 'human' | 'ai'
  content: string
  loading?: boolean
}

async function aiRequest(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers)
  const token = tokenStorage.get()
  if (token) headers.set('Authorization', `Bearer ${token}`)
  const response = await fetch(
    `${appConfig.baseURL.replace(/\/$/, '')}/langchain/${path}`,
    {
      ...init,
      headers,
    }
  )
  if (response.status === 401 && token === tokenStorage.get()) expireSession()
  if (!response.ok) throw new Error(`请求失败：${response.status}`)
  return response
}

export async function getChatHistory(
  signal?: AbortSignal
): Promise<ChatMessage[]> {
  const response = await aiRequest('memory', { signal })
  const result = await response.json()
  return (result.data?.chat_history ?? result.chat_history ?? []).map(
    (item: { role: string; content: string }) => ({
      role: item.role === 'human' ? 'human' : 'ai',
      content: item.content,
    })
  )
}

export function clearChatHistory(signal?: AbortSignal) {
  return aiRequest('memory', { method: 'DELETE', signal })
}

export async function chat(messages: ChatMessage[], signal: AbortSignal) {
  const response = await aiRequest('chat', {
    method: 'POST',
    signal,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
    },
    body: JSON.stringify({
      messages: messages.map(({ role, content }) => ({ role, content })),
    }),
  })
  if (!response.body) throw new Error('响应中没有消息流')
  return response.body
}
