import { defineConfig } from 'vite';

export default defineConfig({
  root: 'examples',

  base: '/my-skin-viewer/', 
  build: {
    outDir: '../dist-demo' 
  }
});