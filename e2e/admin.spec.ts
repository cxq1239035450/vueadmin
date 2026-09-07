import { expect, test, type Page } from '@playwright/test'

let errors: string[] = []
test.beforeEach(({ page }) => {
  errors = []
  page.on('pageerror', error => errors.push(error.message))
})
test.afterEach(() => expect(errors).toEqual([]))

async function login(page: Page, username = 'admin') {
  await page.getByLabel('账号', { exact: true }).fill(username)
  await page.getByLabel('密码', { exact: true }).fill('123456')
  await page.getByRole('button', { name: '登录', exact: true }).click()
}
async function logout(page: Page) {
  await page.locator('.user-menu').hover()
  await page.getByRole('menuitem', { name: '退出登录' }).click()
  await expect(page).toHaveURL(/#\/login/)
}
test('登录回跳、刷新恢复、退出后只读账号无法修改', async ({ page }) => {
  await page.goto('/#/system/users?from=test')
  await expect(page).toHaveURL(/login\?redirect=/)
  await login(page)
  await expect(page).toHaveURL(/#\/system\/users\?from=test/)
  await expect(page.getByRole('button', { name: '新增用户' })).toBeVisible()
  await page.reload()
  await expect(page.getByText('member_01', { exact: true })).toBeVisible()
  await logout(page)
  await login(page, 'viewer')
  await page.getByRole('button', { name: '进入用户管理' }).click()
  await expect(page.getByText('member_01', { exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: '新增用户' })).toHaveCount(0)
  await expect(
    page.getByRole('button', { name: '编辑', exact: true })
  ).toHaveCount(0)
})
test('表单校验、创建、搜索、编辑、删除、分页与空状态', async ({ page }) => {
  await page.goto('/#/system/users')
  await login(page)
  await page.getByRole('button', { name: '新增用户' }).click()
  const dialog = page.getByRole('dialog')
  await dialog.getByRole('button', { name: '保存', exact: true }).click()
  await expect(dialog.getByText('请输入用户名', { exact: true })).toBeVisible()
  await dialog.getByLabel('用户名', { exact: true }).fill('test_member')
  await dialog.getByLabel('邮箱', { exact: true }).fill('test@example.com')
  await dialog.getByRole('button', { name: '保存', exact: true }).click()
  await expect(dialog).toHaveCount(0)
  await page.getByPlaceholder('用户名 / 邮箱').fill('test_member')
  await page.getByRole('button', { name: '查询', exact: true }).click()
  await expect(page.locator('.el-table__body-wrapper tbody tr')).toHaveCount(1)
  await page.getByRole('button', { name: '编辑', exact: true }).click()
  await dialog.getByLabel('邮箱', { exact: true }).fill('updated@example.com')
  await dialog.getByRole('button', { name: '保存', exact: true }).click()
  await expect(
    page.getByText('updated@example.com', { exact: true })
  ).toBeVisible()
  await page.reload()
  await expect(
    page.getByText('updated@example.com', { exact: true })
  ).toBeVisible()
  await page.getByPlaceholder('用户名 / 邮箱').fill('test_member')
  await page.getByRole('button', { name: '查询', exact: true }).click()
  await expect(page.locator('.el-table__body-wrapper tbody tr')).toHaveCount(1)
  await page.getByRole('button', { name: '删除', exact: true }).click()
  await page
    .getByRole('dialog')
    .getByRole('button', { name: '删除', exact: true })
    .click()
  await expect(page.getByText('暂无匹配的用户', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: '重置', exact: true }).click()
  await expect(page.locator('.el-table__body-wrapper tbody tr')).toHaveCount(10)
  await page.locator('.el-pager li').filter({ hasText: /^3$/ }).click()
  await expect(page.locator('.el-table__body-wrapper tbody tr')).toHaveCount(4)
})
test('访客菜单隐藏、直接访问 403、未知路径 404', async ({ page }) => {
  await page.goto('/#/home')
  await login(page, 'guest')
  await expect(page.locator('.sidebar').getByText('系统管理')).toHaveCount(0)
  await page.goto('/#/system/users')
  await expect(page).toHaveURL(/#\/403/)
  await expect(
    page.getByText('你没有访问此页面的权限，请联系管理员。')
  ).toBeVisible()
  await page.goto('/#/missing-page')
  await expect(page.getByText('404', { exact: true })).toBeVisible()
})
test('主题保存与移动端导航', async ({ page }) => {
  await page.goto('/')
  await login(page)
  await page.getByRole('button', { name: '切换深色主题' }).click()
  await page.reload()
  await expect(page.locator('html')).toHaveClass(/dark/)
  await page.setViewportSize({ width: 390, height: 844 })
  await page.getByRole('button', { name: '折叠导航' }).click()
  await expect(page.locator('.sidebar')).toHaveClass(/mobile-open/)
  await page.getByRole('menuitem', { name: '系统管理' }).click()
  await page.getByRole('menuitem', { name: '用户管理' }).click()
  await expect(page.locator('.sidebar')).not.toHaveClass(/mobile-open/)
  await expect(
    page.getByRole('heading', { name: '用户管理', exact: true })
  ).toBeVisible()
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth
    )
  ).toBe(true)
})
test('错误账号不进入后台', async ({ page }) => {
  await page.goto('/#/login')
  await login(page, 'unknown')
  await expect(page.getByText('演示账号或密码不正确')).toBeVisible()
  await expect(page).toHaveURL(/#\/login/)
})
test('真实模式 API 适配、Bearer 和 HTTP 401 登录失效', async ({ page }) => {
  let expired = false
  let authorization = ''
  await page.route('**/api/auth/login', route =>
    route.fulfill({ json: { data: { access_token: 'real-token' } } })
  )
  await page.route('**/api/user/info', route => {
    authorization = route.request().headers().authorization
    return route.fulfill({
      json: { id: 1, username: 'admin', roles: ['admin'], permissions: ['*'] },
    })
  })
  await page.route('**/api/users?**', route =>
    expired
      ? route.fulfill({ status: 401, json: { message: 'expired' } })
      : route.fulfill({ json: { list: [], total: 0 } })
  )
  await page.goto('http://127.0.0.1:4174/#/system/users')
  await expect(page.getByText('体验演示账号')).toHaveCount(0)
  await login(page)
  await expect(
    page.getByRole('heading', { name: '用户管理', exact: true })
  ).toBeVisible()
  expect(authorization).toBe('Bearer real-token')
  expired = true
  await page.getByRole('button', { name: '查询', exact: true }).click()
  await expect(page).toHaveURL(/#\/login\?redirect=/)
  expect(
    await page.evaluate(() => sessionStorage.getItem('vueadmin:token'))
  ).toBeNull()
})
test('请求去重、跳过去重、主动取消和取消后复用', async ({ page }) => {
  await page.goto('/')
  const result = await page.evaluate(async () => {
    const modulePath = '/src/utils/request.ts'
    const { default: request, cancelAllRequests } = await import(modulePath)
    const releases: (() => void)[] = []
    let calls = 0
    const adapter = async (config: unknown) => {
      calls++
      await new Promise<void>(resolve => releases.push(resolve))
      return {
        data: { ok: true },
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      }
    }
    const first = request({ url: '/test', adapter })
    const duplicate = await request({ url: '/test', adapter }).then(
      () => 'bad',
      (error: { code: string }) => error.code
    )
    const independent = request({ url: '/test', adapter, skipDedup: true })
    const callCount = calls
    releases.splice(0).forEach(release => release())
    await Promise.all([first, independent])
    const canceled = request({ url: '/test', adapter }).catch(
      (error: { code: string }) => error.code
    )
    cancelAllRequests()
    const reused = request({ url: '/test', adapter })
    releases.splice(0).forEach(release => release())
    const canceledCode = await canceled
    const reusedValue = await reused
    const controller = new AbortController()
    const abandoned = request({
      url: '/search',
      adapter,
      signal: controller.signal,
    }).catch((error: { code: string }) => error.code)
    controller.abort()
    const replacement = request({ url: '/search', adapter })
    releases.splice(0).forEach(release => release())
    const abandonedCode = await abandoned
    const replacementValue = await replacement
    return {
      duplicate,
      callCount,
      canceledCode,
      reusedValue,
      abandonedCode,
      replacementValue,
    }
  })
  expect(result).toEqual({
    duplicate: 'ERR_CANCELED',
    callCount: 2,
    canceledCode: 'ERR_CANCELED',
    reusedValue: { ok: true },
    abandonedCode: 'ERR_CANCELED',
    replacementValue: { ok: true },
  })
})
