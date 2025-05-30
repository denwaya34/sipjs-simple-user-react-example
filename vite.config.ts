import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
// eslint-disable-next-line import/no-named-as-default
import checker from 'vite-plugin-checker';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  base: '/sipjs-simple-user-react-example/',
  build: {
    sourcemap: true,
  },
  server: {
    open: true,
  },
  plugins: [
    react(),
    tailwindcss(),
    tsconfigPaths(),
    checker({
      typescript: true,
      eslint: {
        useFlatConfig: true,
        lintCommand: 'eslint "./**/*.{ts,tsx}"',
      },
    }),
  ],
});
