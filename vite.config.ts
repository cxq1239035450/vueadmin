import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    base: env.VITE_PUBLIC_PATH || '/',
    plugins: [
      vue(),
      UnoCSS(),
      AutoImport({
        imports: [
          'vue',
          'vue-router',
          { axios: [['default', 'axios']] },
          { from: 'vue-router', imports: ['RouteLocationRaw'], type: true },
        ],
        resolvers: [ElementPlusResolver()],
        dts: 'src/auto-import.d.ts',
        eslintrc: {
          enabled: true,
          filepath: '.eslintrc-auto-import.json',
          globalsPropValue: 'readonly',
        },
      }),
      Components({
        resolvers: [ElementPlusResolver()],
        dts: 'src/components.d.ts',
      }),
      ...(process.env.npm_lifecycle_event === 'analyze'
        ? [
            visualizer({
              filename: 'visualizer/stats.html',
              gzipSize: true,
              brotliSize: true,
            }),
          ]
        : []),
    ],
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
    build: {
      target: 'esnext',
      rollupOptions: {
        output: {
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
        },
      },
    },
    server: {
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: env.API_PROXY_TARGET || 'http://localhost:443',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api(?=\/|$)/, ''),
        },
      },
    },
  }
})
