import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      reportsDirectory: './coverage',
      exclude: ['node_modules/', 'test/', '**/*.d.ts', '**/*.config.*', '.next/'],
    },
    alias: {
      '@neurodaily/shared': resolve(__dirname, '../../packages/shared/src'),
      '@': resolve(__dirname, './src'),
    },
  },
});
