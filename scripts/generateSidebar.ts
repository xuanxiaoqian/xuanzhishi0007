// @ts-nocheck
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import config from './config.ts'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PAGES_DIR = path.join(__dirname, `../docs/${config.pagesName}`)
const HEAD_PATH = `/${config.pagesName}`
const OUTPUT_FILE = path.join(__dirname, '../docs/.vitepress/config/sidebar.ts')

interface DirStructure {
  name?: string
  files: string[]
  dirs: DirStructure[]
}

function scanDirectory(dirPath: string): DirStructure {
  const entries = fs.readdirSync(dirPath)
  const result: DirStructure = { files: [], dirs: [] }

  entries.forEach(entry => {
    const fullPath = path.join(dirPath, entry)
    if (fs.statSync(fullPath).isDirectory()) {
      result.dirs.push({ name: entry, ...scanDirectory(fullPath) })
    } else if (entry.endsWith('.md')) {
      result.files.push(entry)
    }
  })
  return result
}

interface SidebarItem {
  text: string
  link: string
}

interface SidebarGroup {
  items: SidebarItem[]
}

type SidebarConfig = Record<string, SidebarGroup[]>

function generateSidebarConfig(structure: DirStructure, currentPath: string = ''): SidebarConfig {
  const sidebarConfig: SidebarConfig = {}

  structure.dirs.forEach(dir => {
    const dirName = dir.name || ''  // 处理 undefined
    const dirPath = currentPath ? `${currentPath}/${dirName}` : dirName
    const configKey = `['${HEAD_PATH}/${dirPath}/']`


    const standardFiles: SidebarItem[] = dir.files
      .filter(file => /^\d+-/.test(file))
      .sort((a, b) => {
        const aNum = parseInt(a.split('-')[0] || '0')
        const bNum = parseInt(b.split('-')[0] || '0')
        return aNum - bNum
      })
      .map(file => ({
        text: file.replace(/^\d+-/, '').replace('.md', ''),
        link: `${HEAD_PATH}/${dirPath}/${file.replace('.md', '')}`,
      }))

    const nonStandardFiles: SidebarItem[] = dir.files
      .filter(file => !/^\d+-/.test(file) && file.endsWith('.md'))
      .map(file => ({
        text: file.replace('.md', ''),
        link: `${HEAD_PATH}/${dirPath}/${file.replace('.md', '')}`,
      }))

    const allFiles = [...standardFiles, ...nonStandardFiles]

    if (allFiles.length > 0) {
      sidebarConfig[configKey] = [
        {
          items: allFiles,
        },
      ]
    }

    Object.assign(sidebarConfig, generateSidebarConfig(dir, dirPath))
  })

  return sidebarConfig
}

function generateConfig(): void {
  const structure = scanDirectory(PAGES_DIR)
  const sidebarConfig = generateSidebarConfig(structure)

  const configContent = `import { DefaultTheme } from 'vitepress'

export const sidebarConfig: DefaultTheme.Sidebar = ${JSON.stringify(sidebarConfig, null, 2)
      .replace(/"([^"]+)":/g, '$1:')
      .replace(/'\[/g, '[')
      .replace(/\]'/g, ']')}`

  fs.writeFileSync(OUTPUT_FILE, configContent)
  console.log('侧边栏配置已生成')
}

generateConfig()