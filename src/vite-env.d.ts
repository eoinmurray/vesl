/// <reference types="vite/client" />

declare module 'virtual:content-modules' {
  import type { ComponentType } from 'react'

  interface MDXModule {
    default: ComponentType<{ components?: Record<string, ComponentType> }>
    frontmatter?: {
      title?: string
      description?: string
      date?: string
      visibility?: string
    }
  }

  type ModuleLoader = () => Promise<MDXModule>

  export const modules: Record<string, ModuleLoader>
  export const slides: Record<string, ModuleLoader>
  export const index: Record<string, { default: unknown }>
}
