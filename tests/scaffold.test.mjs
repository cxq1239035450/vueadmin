import assert from 'node:assert/strict'
import test from 'node:test'
import { mkdtemp, readFile, access, rm } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

test('生成完整项目、隔离缓存、不复制本地环境且拒绝覆盖', async () => {
  const scratch = await mkdtemp(path.join(tmpdir(), 'vueadmin-template-test-'))
  const destination = path.join(scratch, 'new-admin')
  const source = fileURLToPath(
    new URL('../scripts/create-project.mjs', import.meta.url)
  )
  try {
    const result = spawnSync(process.execPath, [source, destination], {
      encoding: 'utf8',
    })
    assert.equal(result.status, 0, result.stderr)
    const manifest = JSON.parse(
      await readFile(path.join(destination, 'package.json'), 'utf8')
    )
    assert.equal(manifest.name, 'new-admin')
    assert.equal(manifest.scripts.dev, 'vite --mode development')
    assert.match(
      await readFile(path.join(destination, '.env.development'), 'utf8'),
      /VITE_STORAGE_PREFIX=new-admin/
    )
    for (const filename of [
      'src/main.ts',
      'pnpm-lock.yaml',
      '.env.example',
      'docs/architecture.md',
    ]) {
      await access(path.join(destination, filename))
    }
    for (const filename of [
      '.git',
      'node_modules',
      'dist',
      '.env.development.local',
    ]) {
      await assert.rejects(access(path.join(destination, filename)), {
        code: 'ENOENT',
      })
    }
    assert.equal(spawnSync(process.execPath, [source, destination]).status, 1)
    assert.equal(
      JSON.parse(await readFile(path.join(destination, 'package.json'), 'utf8'))
        .name,
      'new-admin'
    )
  } finally {
    // 只删除本测试 mkdtemp 创建的已核对绝对路径。
    assert.equal(path.dirname(path.resolve(scratch)), path.resolve(tmpdir()))
    assert.ok(path.basename(scratch).startsWith('vueadmin-template-test-'))
    await rm(scratch, { recursive: true, force: true })
  }
})
