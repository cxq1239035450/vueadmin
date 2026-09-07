import assert from 'node:assert/strict'
import test from 'node:test'
import { getPendingKey } from '../src/utils/screen.ts'

test('request identity normalizes default method and casing', () => {
  assert.equal(
    getPendingKey({ url: '/users' }),
    getPendingKey({ url: '/users', method: 'GET' })
  )
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
