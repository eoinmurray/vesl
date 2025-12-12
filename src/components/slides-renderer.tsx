import React, { Children, isValidElement, ReactNode, useMemo } from 'react'
import { mdxComponents } from '@/components/mdx-components'

interface SlidesRendererProps {
  Content: React.ComponentType<{ components?: Record<string, React.ComponentType> }> | null
  frontmatter?: {
    title?: string
    description?: string
    date?: string
  }
}

/**
 * Splits MDX content into slides by <hr> elements.
 * The MDX is compiled at build time, so imports work.
 * Slide boundaries are marked with --- in MDX (which becomes <hr>).
 */
export function useSlidesFromMDX({ Content, frontmatter }: SlidesRendererProps) {
  const slides = useMemo(() => {
    // Handle null Content (loading state)
    if (!Content) {
      return []
    }

    // Create a custom hr component that we can detect
    const SlideBreak = () => <hr data-slide-break="true" />

    // Render the MDX with our custom hr
    const componentsWithBreak = {
      ...mdxComponents,
      hr: SlideBreak,
    }

    // Render to get the element tree
    const rendered = <Content components={componentsWithBreak} />

    // Split children by hr elements
    return splitByHr(rendered)
  }, [Content])

  return { slides, frontmatter }
}

/**
 * Recursively traverses React element tree and splits by <hr> elements
 */
function splitByHr(element: ReactNode): ReactNode[][] {
  const slides: ReactNode[][] = [[]]

  function traverse(node: ReactNode) {
    if (!node) return

    if (Array.isArray(node)) {
      node.forEach(traverse)
      return
    }

    if (isValidElement(node)) {
      // Check if this is our slide break marker
      if (node.type === 'hr' || (node.props && node.props['data-slide-break'] === 'true')) {
        // Start a new slide
        slides.push([])
        return
      }

      // Check if it's an hr component from mdxComponents
      const nodeType = node.type as any
      if (typeof nodeType === 'function' && nodeType.name === 'SlideBreak') {
        slides.push([])
        return
      }

      // For fragments or elements with children, we need to check children
      if (node.props?.children) {
        const children = Children.toArray(node.props.children)

        // Check if any child is an hr - if so, we need to split this element
        const hasHrChild = children.some(child =>
          isValidElement(child) && (
            child.type === 'hr' ||
            (child.props && child.props['data-slide-break'] === 'true')
          )
        )

        if (hasHrChild) {
          // Split the children
          children.forEach(child => {
            if (isValidElement(child) && (
              child.type === 'hr' ||
              (child.props && child.props['data-slide-break'] === 'true')
            )) {
              slides.push([])
            } else {
              slides[slides.length - 1].push(child)
            }
          })
        } else {
          // No hr children, add the whole element
          slides[slides.length - 1].push(node)
        }
        return
      }
    }

    // Add to current slide
    slides[slides.length - 1].push(node)
  }

  // Get the children of the rendered element
  if (isValidElement(element) && element.props?.children) {
    const children = Children.toArray(element.props.children)
    children.forEach(traverse)
  } else {
    traverse(element)
  }

  // Filter out empty slides
  return slides.filter(slide => slide.length > 0)
}

/**
 * Renders a single slide's content
 */
export function SlideContent({ children }: { children: ReactNode[] }) {
  return (
    <div className="slide-content prose dark:prose-invert prose-headings:tracking-tight prose-p:leading-relaxed max-w-xl">
      {children}
    </div>
  )
}
