import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  root: 'demo',

  build: {
    outDir: '../dist',
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, 'src/Card.js'),
      name: 'Cool3DCardViewer',
      fileName: 'cool-3d-card-viewer',
    },
    rollupOptions: {
      external: ['skin3d'], 
      output: {
        globals: {
          skin3d: 'skin3d'
        }
      }
    }
  }
});