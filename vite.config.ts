
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

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
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
      '@': path.join(__dirname, 'src'),
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
  },
  optimizeDeps: {
    entries: [path.join(__dirname, 'src/main.tsx')],
    // Include all CommonJS dependencies that need ESM conversion
    include: [
      'react',
      'react-dom',
      'react-dom/client',
      'react/jsx-runtime',
      'react/jsx-dev-runtime',
      '@mdx-js/react',
      '@mdx-js/mdx',
      'react-router-dom',
      'acorn-jsx',
      'acorn',
      'estree-util-to-js',
      'recma-jsx',
      'recma-parse',
      'recma-stringify',
      'micromark-extension-mdxjs',
      'style-to-js',
      'style-to-object',
      'debug',
      'unified',
      'extend',
      'bail',
      'trough',
      'vfile',
      'format',
      'fault',
    ],
  },
})
