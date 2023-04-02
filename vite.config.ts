import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svgr({
      exportAsDefault: false,
    }),
    react({
      babel: {
        parserOpts: {
          plugins: ['decorators-legacy'],
        },
        babelrc: false,
        configFile: false,
      },
    }),
  ],
  server: {
    port: 5010,
  },
  resolve: {
    alias: {
      '@kasif/': path.resolve(__dirname, './src'),
      '@kasif/pages': path.resolve(__dirname, './src/pages'),
      '@kasif/components': path.resolve(__dirname, './src/components'),
      '@kasif/managers': path.resolve(__dirname, './src/managers'),
      '@kasif/util': path.resolve(__dirname, './src/util'),
      '@kasif/assets': path.resolve(__dirname, './src/assets'),
      '@kasif/guards': path.resolve(__dirname, './src/guards'),
      '@kasif/layouts': path.resolve(__dirname, './src/layouts'),
      '@kasif/hooks': path.resolve(__dirname, './src/hooks'),
      '@kasif/config': path.resolve(__dirname, './src/config'),
    },
  },
});
