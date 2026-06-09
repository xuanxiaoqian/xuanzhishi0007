import { MarkdownOptions } from 'vitepress'
import { injectComponentPlugin } from '../plugins/inject-component'


export const markdownConfig: MarkdownOptions = {
  externalLinks: { target: '_blank', rel: 'nofollow noopener noreferrer' },
  config(md) {
    // 注册插件，可以传入配置
    md.use(injectComponentPlugin, {
      component: '<CreateTime />',
      position: 'before',
      // 可选：只对特定目录注入
      shouldInject: (filePath) => {
        // 只对 docs/guide/ 下的文件注入
        return filePath.includes('/')
      }
    })
  }
}