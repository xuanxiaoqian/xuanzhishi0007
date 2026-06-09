// generateNav.ts
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import config from './config.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PAGES_DIR = path.join(__dirname, `../docs/${config.pagesName}`)
const HEAD_PATH = `/${config.pagesName}`
const OUTPUT_FILE = path.join(__dirname, '../docs/.vitepress/config/nav.ts')

interface DirStructure {
  name?: string
  files: string[]
  dirs: DirStructure[]
}

function scanDirectory(dirPath: string): DirStructure {
  const entries = fs.readdirSync(dirPath)
  const result: DirStructure = {
    files: [],
    dirs: [],
  }

  entries.forEach(entry => {
    const fullPath = path.join(dirPath, entry)
    if (fs.statSync(fullPath).isDirectory()) {
      const subDir = scanDirectory(fullPath)
      // 只有当子目录有文件或有包含.md文件的子目录时才保留
      if (subDir.files.length > 0 || subDir.dirs.length > 0) {
        result.dirs.push({
          name: entry,
          ...subDir,
        })
      }
    } else if (entry.endsWith('.md')) {
      result.files.push(entry)
    }
  })

  return result
}

interface NavItem {
  text: string
  link?: string
  activeMatch?: string
  items?: NavItem[]
}

function generateNavItems(structure: DirStructure, basePath: string = ''): NavItem[] {
  const navItems: NavItem[] = []

  structure.dirs.forEach(dir => {
    const dirName = dir.name || ''  // 处理 undefined
    const currentPath = basePath ? `${basePath}/${dirName}` : dirName
    const has1PrefixFile = dir.files.some(f => f.startsWith('1-'))
    const defaultFile = has1PrefixFile
      ? dir.files.find(f => f.startsWith('1-'))
      : dir.files[0]

    if (dir.dirs.length > 0) {
      const items = generateNavItems(dir, currentPath)
      if (items.length > 0) {
        navItems.push({
          text: dirName,
          items,
        })
      }
    } else if (defaultFile) {
      navItems.push({
        text: dirName,
        link: `${HEAD_PATH}/${currentPath}/${defaultFile.replace('.md', '')}`,
        activeMatch: `${HEAD_PATH}/${currentPath}/`,
      })
    }
  })

  return navItems
}

function generateConfig(): void {
  const structure = scanDirectory(PAGES_DIR)
  const navConfig = generateNavItems(structure)

  const configContent = `import { DefaultTheme } from 'vitepress'

export const navConfig: DefaultTheme.NavItem[] = ${JSON.stringify(navConfig, null, 2).replace(/"([^"]+)":/g, '$1:')}`

  fs.writeFileSync(OUTPUT_FILE, configContent)
  console.log('导航配置已生成')
}

generateConfig()