import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
import stylePlugin from 'esbuild-style-plugin'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

export default defineConfig(({ mode }) => {
  const is_prod = mode === 'production'

  return {
    main: {
      clean: true,
      plugins: [externalizeDepsPlugin()],
      format: 'esm',
      // The requested module 'electron-updater' is a CommonJS module, which may not support all module.exports as named exports.
      noExternal: is_prod ? [/(.*)/] : ['electron-updater'],
      minify: is_prod
    },
    preload: {
      clean: true,
      plugins: [externalizeDepsPlugin()],
      format: 'cjs',
      minify: is_prod
    },
    renderer: {
      resolve: {
        alias: {
          '@renderer': resolve('src/renderer/src')
        }
      },
      plugins: [vue()],
      build: {
        clean: true,
        minify: is_prod,
        esbuildPlugins: [
          stylePlugin({
            postcss: {
              plugins: [tailwindcss(), autoprefixer()]
            }
          })
        ]
      }
    }
  }
})
