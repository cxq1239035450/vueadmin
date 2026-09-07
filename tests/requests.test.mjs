import assert from 'node:assert/strict'
import test from 'node:test'
import {
  addPending,
  removePending,
  getPendingKey,
} from '../src/utils/screen.ts'

test('keeps the first request pending until it completes', () => {
  const key = getPendingKey({ method: 'get', url: '/users' })
  let firstCancelled = false
  let duplicateCount = 0
  addPending(key, () => {
    firstCancelled = true
  })
  addPending(key, () => {
    duplicateCount++
  })
  addPending(key, () => {
    duplicateCount++
  })
  assert.equal(firstCancelled, false)
  assert.equal(duplicateCount, 2)
  removePending(key)
  addPending(key, () => {
    assert.fail('completed request must be reusable')
  })
  removePending(key)
})

test('request identity survives axios JSON serialization', () => {
  const config = {
    method: 'post',
    url: '/tasks',
    data: { id: 1 },
    params: { page: 2 },
  }
  assert.equal(
    getPendingKey(config),
    getPendingKey({
      ...config,
      data: JSON.stringify(config.data),
    })
  )
})

test('request identity separates URLs, methods, bodies and parameters', () => {
  const configs = [
    { url: '/a', method: 'get', data: 'bc' },
    { url: '/a', method: 'getb', data: 'c' },
    { url: '/a', method: 'get', data: 'bc', params: { page: 1 } },
    { url: '/a', method: 'get', data: 'bc', baseURL: '/api' },
  ]
  assert.equal(new Set(configs.map(getPendingKey)).size, configs.length)
})
