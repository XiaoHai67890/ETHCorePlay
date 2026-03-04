import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-router')) return 'router';
            if (id.includes('supabase')) return 'supabase';
            if (id.includes('html2canvas')) return 'sharing';
            return 'vendor';
          }
          if (id.includes('/src/data/curriculum/')) return 'curriculum-data';
          if (id.includes('/src/data/chapterAssessments')) return 'assessment-data';
        }
      }
    }
  }
});
