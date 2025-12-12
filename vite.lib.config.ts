import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// Library build config - pre-compiles src/ components for distribution
// CSS is left to runtime processing (Tailwind needs to scan for classes)
export default defineConfig({
  plugins: [
    react(),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.tsx'),
      formats: ['es'],
      fileName: 'main'
    },
    rollupOptions: {
      // Externalize all deps - they're resolved at runtime
      external: (id) => {
        // Virtual modules
        if (id === 'virtual:content-modules') return true
        // CSS files (processed at runtime by Tailwind)
        if (id.endsWith('.css')) return true
        // All node_modules
        if (id.includes('node_modules')) return true
        // Bare imports (dependencies)
        if (!id.startsWith('.') && !id.startsWith('/') && !id.startsWith('@/')) return true
        return false
      },
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
      }
    },
    outDir: 'dist/client',
    emptyOutDir: true,
    // Don't minify for better debugging
    minify: false,
    sourcemap: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
})
