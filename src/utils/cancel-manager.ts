import type { InternalAxiosRequestConfig } from 'axios'

interface PendingRequest {
  controller: AbortController
  timestamp: number
}

const STALE_TIMEOUT = 60_000
const CLEANUP_INTERVAL = 10_000
const pendingMap = new Map<string, PendingRequest>()

let cleanupTimer: ReturnType<typeof setInterval> | null = null

function startCleanup() {
  if (cleanupTimer) return
  cleanupTimer = setInterval(() => {
    const now = Date.now()
    for (const [key, req] of pendingMap) {
      if (now - req.timestamp > STALE_TIMEOUT) {
        req.controller.abort()
        pendingMap.delete(key)
      }
    }
    if (pendingMap.size === 0 && cleanupTimer) {
      clearInterval(cleanupTimer)
      cleanupTimer = null
    }
  }, CLEANUP_INTERVAL)
}

function stringify(value: any): string {
  if (value === undefined || value === null) return ''
  if (typeof value === 'string') return value
  try {
    return JSON.stringify(value)
  } catch {
    return ''
  }
}

export function generateKey(config: InternalAxiosRequestConfig): string {
  const { url, method, data, params } = config
  return `${method}:${url}:${stringify(params)}:${stringify(data)}`
}

export function addPending(key: string, controller: AbortController): boolean {
  if (pendingMap.has(key)) return false
  pendingMap.set(key, { controller, timestamp: Date.now() })
  startCleanup()
  return true
}

export function removePending(key: string): void {
  pendingMap.delete(key)
}

export function cancelByUrl(url: string): void {
  for (const [key, req] of pendingMap) {
    if (key.includes(`:${url}:`)) {
      req.controller.abort()
      pendingMap.delete(key)
    }
  }
}

export function cancelAll(): void {
  for (const [, req] of pendingMap) {
    req.controller.abort()
  }
  pendingMap.clear()
  if (cleanupTimer) {
    clearInterval(cleanupTimer)
    cleanupTimer = null
  }
}

export function isPending(key: string): boolean {
  return pendingMap.has(key)
}
