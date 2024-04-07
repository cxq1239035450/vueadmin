import { defineConfig } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import UnoCSS from 'unocss/vite'
// 可视化包大小
import { visualizer } from 'rollup-plugin-visualizer'
// import Inspect from 'vite-plugin-inspect'
//自动导入插件
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
export default ({ mode }) => {
  console.log(mode)

  const getPath = (relativePath: string): string => {
    return path.resolve(__dirname, relativePath)
  }
  const config = {
    base: '/',
    plugins: [
      vue(),
      vueJsx(),
      UnoCSS(),
      AutoImport({
        include: [
          /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
          /\.vue$/,
          /\.vue\?vue/, // .vue
        ],
        imports: [
          'vue',
          'vue-router',
          {
            axios: [
              ['default', 'axios'], // import { default as axios } from 'axios',
            ],
          },
          // example type import
          {
            from: 'vue-router',
            imports: ['RouteLocationRaw'],
            type: true,
          },
        ],
        dts: getPath('src/auto-import.d.ts'),
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
        dts: getPath('src/components.d.ts'),
      }),
      visualizer({
        open: true,
        gzipSize: true,
        brotliSize: true,
        filename: getPath('./visualizer/stats.html'),
      }),
    ],
    resolve: {
      alias: {
        '@': '/src',
      },
      extensions: ['.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    },
    define: {
      // 启用生产环境构建下激活不匹配的详细警告
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'true',
    },
    // server: {
    //   https: true   // 需要开启https服务
    //  },
  }
  return defineConfig(config)
}
