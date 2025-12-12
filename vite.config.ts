import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import mdx from '@mdx-js/rollup'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const distClientPath = path.join(__dirname, 'dist/client')
const srcPath = path.join(__dirname, 'src')
const hasPrebuilt = fs.existsSync(path.join(distClientPath, 'main.js'))

export default defineConfig(({ command }) => {
  // Only use pre-built files for dev server, not production build
  // Pre-built files have externalized React which breaks production bundles
  const usePrebuilt = command === 'serve' && hasPrebuilt
  const clientPath = usePrebuilt ? distClientPath : srcPath

  return {
  clearScreen: false,
  cacheDir: path.join(__dirname, 'node_modules/.vite'),
  publicDir: path.join(__dirname, 'public'),
  plugins: [
    tailwindcss(),
    // MDX must run before Vite's default transforms
    {
      enforce: 'pre',
      ...mdx({
        remarkPlugins: [
          remarkGfm,
          remarkMath,
          remarkFrontmatter,
          [remarkMdxFrontmatter, { name: 'frontmatter' }],
        ],
        rehypePlugins: [rehypeKatex],
        providerImportSource: '@mdx-js/react',
      }),
    },
    react({ include: /\.(jsx|js|mdx|md|tsx|ts)$/ }),
  ],
  resolve: {
    alias: {
      '@': clientPath,
    },
  },
  server: {
    host: '0.0.0.0',
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
    strictPort: true,
    fs: {
      allow: ['..', '../..'],
    },
    allowedHosts: true,
  },
  preview: {
    host: '0.0.0.0',
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
    strictPort: true,
    allowedHosts: true,
  },
  build: {
    chunkSizeWarningLimit: 1500,
    reportCompressedSize: false,
  },
  optimizeDeps: {
    entries: [path.join(clientPath, usePrebuilt ? 'main.js' : 'main.tsx')],
    include: [
      'react',
      'react-dom',
      'react-dom/client',
      'react/jsx-runtime',
      'react/jsx-dev-runtime',
      '@mdx-js/react',
      'react-router-dom',
      // Pre-bundle heavy UI deps
      '@radix-ui/react-collapsible',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-scroll-area',
      '@radix-ui/react-select',
      '@radix-ui/react-tooltip',
      'lucide-react',
      'embla-carousel-react',
      'next-themes',
      'clsx',
      'tailwind-merge',
      'class-variance-authority',
    ],
  },
  }
})
