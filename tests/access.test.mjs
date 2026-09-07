import assert from 'node:assert/strict'
import test from 'node:test'
import { hasAccess, safeRedirect } from '../src/utils/access.ts'
import { normalizeUser } from '../src/types/auth.ts'
import { createLatestTask } from '../src/utils/latest-task.ts'

test('权限默认不授予，角色 OR、权限 AND，并共同生效', () => {
  const viewer = { roles: ['viewer'], permissions: ['user:read'] }
  assert.equal(hasAccess(viewer, {}), true)
  assert.equal(hasAccess(viewer, { permissions: ['user:read'] }), true)
  assert.equal(
    hasAccess(viewer, { permissions: ['user:read', 'user:update'] }),
    false
  )
  assert.equal(hasAccess(viewer, { roles: ['admin', 'viewer'] }), true)
  assert.equal(
    hasAccess(viewer, { roles: ['admin'], permissions: ['user:read'] }),
    false
  )
  assert.equal(
    hasAccess({ roles: [], permissions: ['*'] }, { permissions: ['any'] }),
    true
  )
  assert.equal(
    hasAccess({ roles: [], permissions: ['*'] }, { roles: ['admin'] }),
    false
  )
})
test('用户信息缺少权限字段时不隐式授予访问权限', () => {
  assert.deepEqual(normalizeUser({ username: 'member' }).permissions, [])
  assert.deepEqual(
    normalizeUser({ username: 'member', roles: ['viewer', 1] }).roles,
    ['viewer']
  )
  assert.throws(() => normalizeUser({}), /username/)
})
test('登录回跳仅接受站内路径，保留查询参数和锚点', () => {
  assert.equal(
    safeRedirect('/system/users?page=2#row'),
    '/system/users?page=2#row'
  )
  for (const path of [
    'https://example.com',
    '//example.com',
    '/login?redirect=/login',
    '/\\evil.com',
    '/a\nb',
    null,
    ['/home'],
  ]) {
    assert.equal(safeRedirect(path), '/home')
  }
})
test('新查询与页面销毁使旧响应失效', () => {
  const latest = createLatestTask()
  const first = latest.start()
  const second = latest.start()
  assert.equal(first.signal.aborted, true)
  assert.equal(first.isCurrent(), false)
  assert.equal(second.isCurrent(), true)
  latest.cancel()
  assert.equal(second.signal.aborted, true)
  assert.equal(second.isCurrent(), false)
})
