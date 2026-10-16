import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/clock/', // served from https://stansvoboda.github.io/clock/
  plugins: [react()],
});
