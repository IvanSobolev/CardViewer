import { resolve } from 'path';
import { defineConfig } from 'vite';
import { copy } from 'vite-plugin-copy';

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
  plugins: [
    copy([
      { src: 'src/card.css', dest: 'dist', rename: 'style.css' }
    ])
  ]
});