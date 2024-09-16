import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/index.js'),
      name: 'UnihelperCore',
      formats: ['es', 'cjs'],
      fileName: (format) => `unihelper-core.${format === 'es' ? 'esm' : 'cjs'}.js`
    },
    rollupOptions: {
      external: ['node-addon-api'],
      output: {
        globals: {
          'node-addon-api': 'nodeAddonApi'
        }
      }
    }
  }
});
