// @ts-nocheck
import { execSync } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log('🚀 开始生成 VitePress 配置...\n')

try {
  console.log('📝 生成导航配置...')
  execSync('tsx generateNav.ts', {
    cwd: __dirname,
    stdio: 'inherit'
  })

  console.log('\n📝 生成侧边栏配置...')
  execSync('tsx generateSidebar.ts', {
    cwd: __dirname,
    stdio: 'inherit'
  })

  console.log('\n✅ 所有配置生成完成！')
} catch (error) {
  console.error('\n❌ 生成失败:', error)
  process.exit(1)
}