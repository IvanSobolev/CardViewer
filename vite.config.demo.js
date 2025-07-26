import { defineConfig } from 'vite';

export default defineConfig({
  root: 'demo',

  base: '/CardViewer/', 
  build: {
    outDir: '../dist-demo' 
  }
});