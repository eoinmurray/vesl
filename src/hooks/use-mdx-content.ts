import { useState, useEffect } from 'react'
import { modules, slides } from 'virtual:content-modules'
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

export function useMDXContent(path: string) {
  const [Content, setContent] = useState<MDXModule['default'] | null>(null)
  const [frontmatter, setFrontmatter] = useState<MDXModule['frontmatter']>(undefined)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    // Find the matching module - keys are like "/content-dir/path/README.mdx"
    // We need to match against the path segment
    const matchingKey = Object.keys(modules).find(key =>
      key.endsWith(`/${path}/README.mdx`)
    )
    const loader = matchingKey ? (modules as Record<string, ModuleLoader>)[matchingKey] : null

    if (!loader) {
      setError(new Error(`MDX module not found for path: ${path}`))
      setLoading(false)
      return
    }

    loader()
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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    // Find the matching module - keys are like "/content-dir/path/SLIDES.mdx"
    const matchingKey = Object.keys(slides).find(key =>
      key.endsWith(`/${path}/SLIDES.mdx`)
    )
    const loader = matchingKey ? (slides as Record<string, ModuleLoader>)[matchingKey] : null

    if (!loader) {
      setError(new Error(`Slides module not found for path: ${path}`))
      setLoading(false)
      return
    }

    loader()
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
