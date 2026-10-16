import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './', // relative, so the same build works on GitHub Pages (/clock/) and Cloudflare (/)
  plugins: [react()],
});
