import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint';
import stylelint from 'vite-plugin-stylelint';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    eslint({
      fix: true,
    }),
    stylelint({
      fix: true,
    }),
  ],
});
