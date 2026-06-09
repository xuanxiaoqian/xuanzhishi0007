import 'viewerjs/dist/viewer.min.css'
import type { Theme } from 'vitepress' // ✅ 使用 type import
import { useRoute } from 'vitepress'
import imageViewer from 'vitepress-plugin-image-viewer'
import DefaultTheme from "vitepress/theme"
import CreateTime from '../components/create-time.vue'
import "./styles/style.css"

export default {
  ...DefaultTheme,
  enhanceApp({ app, router, siteData }) {
    app.component('CreateTime', CreateTime)
  },
  setup() {
    // 获取路由
    const route = useRoute()

    // 使用
    imageViewer(route)
    //   , '.vp-doc img', {
    //   toggleOnDblclick: false,
    //   zoomRatio: 0.25,
    // }
  }

} satisfies Theme