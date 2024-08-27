import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { resolve } from "path";

import AutoImport from "unplugin-auto-import/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import Components from "unplugin-vue-components/vite";
import type { ConfigEnv, UserConfig } from "vite";
import { defineConfig } from "vite";

const pathResolve = (dir: string) => {
  return resolve(__dirname, ".", dir);
};
// https://vitejs.dev/config
export default defineConfig(({ command }) => {
  return {
    base: "./",
    build: {
      outDir: "out/only/render_",
      chunkSizeWarningLimit: 1024,
      // 分包
      rollupOptions: {
        output: {
          manualChunks: {
            vue: ["vue"],
            "vue-router": ["vue-router"],
            "element-plus": ["element-plus"],
          },
        },
      },
    },
    plugins: [
      vue(),
      vueJsx(),
      AutoImport({
        imports: ["vue", "vue-router"],
        resolvers: [ElementPlusResolver()],
        // 生成eslint规则
        eslintrc: {
          enabled: true,
        },
      }),
      Components({
        resolvers: [ElementPlusResolver()],
        dirs: ["src/render_/components"],
      }),
    ],
    resolve: {
      preserveSymlinks: true,
      alias: {
        "@r": pathResolve("src/render_"),
      },
    },
    clearScreen: false,
  } as UserConfig;
});
