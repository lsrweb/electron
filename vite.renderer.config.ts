import type { ConfigEnv, UserConfig } from 'vite';
import { defineConfig } from 'vite';
import { pluginExposeRenderer } from './vite.base.config';
import { resolve } from "path";


import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import AutoImport from "unplugin-auto-import"
 

const pathResolve = (dir: string) => {
  return resolve(__dirname, ".", dir);
};

// https://vitejs.dev/config
export default defineConfig((env) => {
  const forgeEnv = env as ConfigEnv<'renderer'>;
  const { root, mode, forgeConfigSelf } = forgeEnv;
  const name = forgeConfigSelf.name ?? '';

  return {
    root,
    mode,
    base: './',
    build: {
      outDir: `.vite/renderer/${name}`,
      emptyOutDir: true,

      cssCodeSplit: false,
      terserOptions: {
        compress: {
          keep_infinity: true,
          drop_console: true,
        },
      },

      minify: 'terser',

      sourcemap: true,
      brotliSize: false,
      chunkSizeWarningLimit: 1024,

      
      
      

    },
    plugins: [pluginExposeRenderer(name),
      vue(),
      vueJsx(),
      AutoImport.vite({
        imports: ["vue", "vue-router"],
        eslintrc: {
          enabled: true,
        },
      }),

    ],
    resolve: {
      preserveSymlinks: true,
      alias: {
        "@r": pathResolve("src/render"),
      },
    },
    clearScreen: false,
  } as UserConfig;
});
