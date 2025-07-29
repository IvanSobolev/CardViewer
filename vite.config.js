import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, 'src/Card.js'),
      name: 'MinecardsRenderer',
      fileName: (format) => `minecards-renderer.${format}.js`,
    },
    rollupOptions: {
      external: ['skin3d'],
      output: {
        globals: {
          skin3d: 'Skin3D',
        },
      },
    },
  },
});