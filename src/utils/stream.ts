function parseContent(data: string): string {
  try {
    const parsed: unknown = JSON.parse(data)
    if (typeof parsed === 'string') return parsed
    if (parsed && typeof parsed === 'object' && 'data' in parsed) {
      return String(parsed.data ?? '')
    }
    return ''
  } catch {
    return data
  }
}

// 按行消费 NestJS SSE，保留跨网络分片的行和 UTF-8 字符。
export async function* readChatStream(body: ReadableStream<Uint8Array>) {
  const reader = body.getReader()
  const decoder = new TextDecoder()
  let pending = ''
  try {
    while (true) {
      const { value, done } = await reader.read()
      pending += done
        ? decoder.decode()
        : decoder.decode(value, { stream: true })
      const lines = pending.split('\n')
      pending = lines.pop() ?? ''
      if (done && pending) lines.push(pending)

      for (const line of lines) {
        if (!line.startsWith('data:')) continue
        const data = line.slice(5).trim()
        if (data === '[DONE]') return
        if (data) {
          const content = parseContent(data)
          if (content) yield content
        }
      }
      if (done) return
    }
  } finally {
    try {
      await reader.cancel()
    } finally {
      reader.releaseLock()
    }
  }
}
