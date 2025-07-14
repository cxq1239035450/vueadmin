import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import UnoCSS from 'unocss/vite'
// 可视化包大小
import { visualizer } from 'rollup-plugin-visualizer'
// import Inspect from 'vite-plugin-inspect'
// 代码压缩
// import viteCompression from 'vite-plugin-compression'
//自动导入插件
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
export default ({ mode }) => {
  const root = process.cwd()

  const { VITE_DROP_CONSOLE } = loadEnv(mode, root)
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
        resolvers: [
          ElementPlusResolver(),
          IconsResolver({
            prefix: 'Icon',
          }),
        ],
      }),
      Components({
        include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/],
        resolvers: [
          ElementPlusResolver(),
          IconsResolver({
            prefix: false,
            enabledCollections: ['ep'],
          }),
        ],
        dts: getPath('src/components.d.ts'),
      }),
      Icons({
        autoInstall: true,
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
    build: {
      // target: 'modules',
      target: 'esnext',
      outDir: 'dist',
      assetsDir: './src/assets/',
      // TODO:可能需要去掉 minify否则图片路径无法加载成功
      minify: 'terser' as 'terser', // 混淆器
      rollupOptions: {
        output: {
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
          manualChunks: {
            // lodashES: ['lodash-es'],
            ElementPlus: ['element-plus'],
          },
        },
      },

      terserOptions: {
        compress: {
          // 根据官网: 防止chrome出现性能问题
          keep_infinity: true,
          drop_console: VITE_DROP_CONSOLE === 'true',
        },
      },
      sourcemap: true,
    },
    server: {
      host:'0.0.0.0',
      // https: true   // 需要开启https服务
      warmup: {
        clientFiles: ['./src/components/layout/**/*.vue'],
      },
    },
  }
  return defineConfig(config)
}
