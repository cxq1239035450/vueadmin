import {
  cp,
  mkdir,
  readdir,
  readFile,
  writeFile,
  access,
} from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const source = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const argument = process.argv[2]
if (!argument) {
  console.error('用法：pnpm create-project ../my-admin')
  process.exit(1)
}
const destination = path.resolve(argument)
try {
  await access(destination)
  console.error('目标目录已存在，请使用一个新目录。')
  process.exit(1)
} catch (error) {
  if (error.code !== 'ENOENT') throw error
}
if (destination === source || destination.startsWith(source + path.sep)) {
  console.error('请在模板目录之外创建项目。')
  process.exit(1)
}
const allowedDirectories = new Set([
  'src',
  'public',
  'tests',
  'e2e',
  'docs',
  'scripts',
  '.github',
  '.vscode',
])
const allowedFiles = new Set([
  'package.json',
  'pnpm-lock.yaml',
  'pnpm-workspace.yaml',
  'README.md',
  'index.html',
  'tsconfig.json',
  'vite.config.ts',
  'uno.config.ts',
  'playwright.config.ts',
  '.gitignore',
  '.editorconfig',
  '.prettierignore',
  '.prettierrc.cjs',
  '.eslintrc.cjs',
  '.eslintrc-auto-import.json',
  '.env.development',
  '.env.production',
  '.env.demo',
  '.env.example',
])
await mkdir(destination, { recursive: true })
for (const entry of await readdir(source, { withFileTypes: true })) {
  if (
    entry.isDirectory()
      ? allowedDirectories.has(entry.name)
      : allowedFiles.has(entry.name)
  ) {
    await cp(
      path.join(source, entry.name),
      path.join(destination, entry.name),
      {
        recursive: true,
        filter: input => !input.endsWith('.local'),
      }
    )
  }
}
const packagePath = path.join(destination, 'package.json')
const manifest = JSON.parse(await readFile(packagePath, 'utf8'))
manifest.name =
  path
    .basename(destination)
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-') || 'my-admin'
manifest.version = '0.1.0'
await writeFile(packagePath, JSON.stringify(manifest, null, 2) + '\n')
for (const filename of ['.env.development', '.env.production', '.env.demo']) {
  const envPath = path.join(destination, filename)
  const content = await readFile(envPath, 'utf8')
  await writeFile(
    envPath,
    content.replace(
      /^VITE_STORAGE_PREFIX=.*$/m,
      `VITE_STORAGE_PREFIX=${manifest.name}${
        filename === '.env.demo' ? '-demo' : ''
      }`
    )
  )
}
console.log(
  `项目已创建：${destination}\n下一步：进入该目录，运行 pnpm install 和 pnpm dev。\n接入配置见 README.md。`
)
