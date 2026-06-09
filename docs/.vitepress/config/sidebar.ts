import { DefaultTheme } from 'vitepress'

export const sidebarConfig: DefaultTheme.Sidebar = {
  ['/pages/test/']: [
    {
      items: [
        {
          text: "测试",
          link: "/pages/test/1-测试"
        },
        {
          text: "我的",
          link: "/pages/test/2-我的"
        }
      ]
    }
  ]
}