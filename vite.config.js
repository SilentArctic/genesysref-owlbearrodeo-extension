import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
   build: {
      rollupOptions: {
         input: {
            main: resolve(__dirname, 'index.html'),
            'range-picker': resolve(__dirname, '/range-bands/range-picker.html'),
         },
      },
   },
});
