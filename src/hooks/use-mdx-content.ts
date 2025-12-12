import { useState, useEffect } from 'react'
import type { ComponentType } from 'react'

interface MDXModule {
  default: ComponentType<{ components?: Record<string, ComponentType> }>
  frontmatter?: {
    title?: string
    description?: string
    date?: string
    visibility?: string
  }
  slideCount?: number // Exported by remark-slides plugin for SLIDES.mdx files
}

type ModuleLoader = () => Promise<MDXModule>
type ModuleMap = Record<string, ModuleLoader>

export function useMDXContent(path: string) {
  const [Content, setContent] = useState<MDXModule['default'] | null>(null)
  const [frontmatter, setFrontmatter] = useState<MDXModule['frontmatter']>(undefined)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    // Dynamic import to avoid pre-bundling issues
    import('virtual:content-modules')
      .then(({ modules }) => {
        const matchingKey = Object.keys(modules).find(key =>
          key.endsWith(`/${path}/README.mdx`)
        )
        const loader = matchingKey ? (modules as ModuleMap)[matchingKey] : null

        if (!loader) {
          throw new Error(`MDX module not found for path: ${path}`)
        }

        return loader()
      })
      .then((mod) => {
        if (!cancelled) {
          setContent(() => mod.default)
          setFrontmatter(mod.frontmatter)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err)
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [path])

  return { Content, frontmatter, loading, error }
}

export function useMDXSlides(path: string) {
  const [Content, setContent] = useState<MDXModule['default'] | null>(null)
  const [frontmatter, setFrontmatter] = useState<MDXModule['frontmatter']>(undefined)
  const [slideCount, setSlideCount] = useState<number | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    // Dynamic import to avoid pre-bundling issues
    import('virtual:content-modules')
      .then(({ slides }) => {
        const matchingKey = Object.keys(slides).find(key =>
          key.endsWith(`/${path}/SLIDES.mdx`)
        )
        const loader = matchingKey ? (slides as ModuleMap)[matchingKey] : null

        if (!loader) {
          throw new Error(`Slides module not found for path: ${path}`)
        }

        return loader()
      })
      .then((mod) => {
        if (!cancelled) {
          setContent(() => mod.default)
          setFrontmatter(mod.frontmatter)
          setSlideCount(mod.slideCount)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err)
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [path])

  return { Content, frontmatter, slideCount, loading, error }
}
