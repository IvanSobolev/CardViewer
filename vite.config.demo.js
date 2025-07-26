import { defineConfig } from 'vite';

export default defineConfig({
  root: 'demo',

  base: '/my-skin-viewer/', 
  build: {
    outDir: '../dist-demo' 
  }
});