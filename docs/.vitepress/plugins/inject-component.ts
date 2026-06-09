import type MarkdownIt from 'markdown-it'

// 定义一个选项接口，方便配置
export interface InjectComponentOptions {
  /** 要注入的组件标签，如 '<MyComponent />' */
  component?: string
  /** 注入位置：'before'（开头）或 'after'（结尾） */
  position?: 'before' | 'after'
  /** 可选：根据文件路径决定是否注入 */
  shouldInject?: (filePath: string) => boolean
}

export const injectComponentPlugin = (md: MarkdownIt, options: InjectComponentOptions = {}) => {
  // 默认配置
  const {
    component = '<MyComponent />',
    position = 'before',
    shouldInject = () => true  // 默认全部注入
  } = options

  // 保存原始的 render 方法
  const originalRender = md.renderer.render

  // 重写 render 方法
  md.renderer.render = function (tokens, mdOptions, env) {
    // 获取原始的 HTML 内容
    const originalHtml = originalRender.call(this, tokens, mdOptions, env)

    // 获取当前文件的路径（VitePress 会传入 env.path）
    const filePath = (env as any).path || ''

    // 判断是否需要注入
    if (!shouldInject(filePath)) {
      return originalHtml
    }

    // 根据位置注入组件
    if (position === 'before') {
      return `${component}\n${originalHtml}`
    } else {
      return `${originalHtml}\n${component}`
    }
  }
}