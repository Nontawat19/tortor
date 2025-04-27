import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // ต้องมี import path ตรงนี้

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // ตรงนี้ต้องเป็น 'src' ชัด ๆ
    },
  },
});
