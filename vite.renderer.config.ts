import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { resolve } from "path";

import AutoImport from "unplugin-auto-import/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import Components from "unplugin-vue-components/vite";
import type { ConfigEnv, UserConfig } from "vite";
import { defineConfig } from "vite";
import { pluginExposeRenderer } from "./vite.base.config";
import ElementPlus from "unplugin-element-plus/vite";

const pathResolve = (dir: string) => {
  return resolve(__dirname, ".", dir);
};
// https://vitejs.dev/config
export default defineConfig((env) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const forgeEnv = env as ConfigEnv<"render">;
  const { root, mode, forgeConfigSelf } = forgeEnv;
  const name = forgeConfigSelf.name ?? "";

  return {
    root,
    mode,
    base: "./",
    build: {
      outDir: `.vite/renderer/${name}`,
      chunkSizeWarningLimit: 1500,
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              return id.toString().split("node_modules/")[1].split("/")[0].toString();
            }
          },
        },
      },
    },
    plugins: [
      pluginExposeRenderer(name),
      vue(),
      vueJsx(),
      ElementPlus({}),
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
