import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/sections-to-tabs-card.ts',
      formats: ['es'],
      fileName: () => 'sections-to-tabs-card.js'
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true
      }
    },
    outDir: '.', // Direkt ins Root für HACS
    emptyOutDir: false
  }
});
