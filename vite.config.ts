import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
// eslint-disable-next-line import/no-named-as-default
import checker from 'vite-plugin-checker';
import tsconfigPaths from 'vite-tsconfig-paths';

const __dirname = import.meta.dirname;
const outDir = resolve(__dirname, 'dist');
const root = resolve(__dirname, 'src');

export default defineConfig({
  root: root,
  base: '/sipjs-simple-user-react-example/',
  build: {
    outDir: outDir,
    sourcemap: true,
    rollupOptions: {
      input: {
        index: resolve(root, 'index.html'),
      },
    },
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
