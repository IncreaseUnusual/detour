import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * React Native Web build.
 *
 * The app source is unmodified React Native: it imports from 'react-native',
 * and the alias below points that at react-native-web. The `.web.*` extension
 * order matters too, because react-native-svg ships web variants beside its
 * native files.
 */
export default defineConfig(({ mode }) => ({
  plugins: [react()],

  resolve: {
    alias: {
      'react-native': 'react-native-web',
    },
    extensions: [
      '.web.tsx', '.web.ts', '.web.jsx', '.web.js',
      '.tsx', '.ts', '.jsx', '.js', '.mjs', '.cjs', '.json',
    ],
  },

  define: {
    // React Native code paths read both of these.
    __DEV__: JSON.stringify(mode !== 'production'),
    'process.env.NODE_ENV': JSON.stringify(mode),
    global: 'globalThis',
  },

  optimizeDeps: {
    include: ['react-native-web', 'react-native-svg'],
    esbuildOptions: {
      resolveExtensions: [
        '.web.tsx', '.web.ts', '.web.jsx', '.web.js',
        '.tsx', '.ts', '.jsx', '.js', '.mjs', '.cjs', '.json',
      ],
      loader: { '.js': 'jsx' },
    },
  },

  server: { port: 8081, host: true, allowedHosts: true },
  preview: { port: 8081, host: true, allowedHosts: true },
  build: { outDir: 'dist', sourcemap: false },
}));
