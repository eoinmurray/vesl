import { useParams } from "react-router-dom";
import { findSlides, isSimulationRunning, useDirectory } from "../../plugin/src/client";
import Loading from "@/components/loading";
import { FileEntry } from "plugin/src/lib";
import { RunningBar } from "@/components/running-bar";
import { Header } from "@/components/header";
import { useMDXContent } from "@/hooks/use-mdx-content";
import { mdxComponents } from "@/components/mdx-components";
import { formatDate } from "@/lib/format-date";

export function Post() {
  const { "*": rawPath = "." } = useParams();

  // The path includes the .mdx extension from the route
  const mdxPath = rawPath;

  // Extract directory path for finding sibling files (slides, etc.)
  const dirPath = mdxPath.replace(/\/[^/]+\.mdx$/, '') || '.';

  const { directory, loading: dirLoading } = useDirectory(dirPath)
  const { Content, frontmatter, loading: mdxLoading, error } = useMDXContent(mdxPath);
  const isRunning = isSimulationRunning();

  let slides: FileEntry | null = null;
  if (directory) {
    slides = findSlides(directory);
  }

  const loading = dirLoading || mdxLoading;

  if (loading) return <Loading />

  if (error) {
    return (
      <main className="min-h-screen bg-background container mx-auto max-w-4xl py-12">
        <p className="text-center text-red-600">{error.message}</p>
      </main>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background noise-overlay">
      <title>{frontmatter?.title}</title>
      <RunningBar />
      <Header />
      <main className="flex-1 mx-auto w-full max-w-[var(--content-width)] px-[var(--page-padding)]">
        {isRunning && (
          <div className="sticky top-0 z-50 px-[var(--page-padding)] py-2 bg-red-500 text-primary-foreground font-mono text-xs text-center tracking-wide">
            <span className="inline-flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
              <span className="uppercase tracking-widest">simulation running</span>
              <span className="text-primary-foreground/60">Page will auto-refresh on completion</span>
            </span>
          </div>
        )}

        {Content && (
          <article className="my-24 prose dark:prose-invert prose-headings:tracking-tight prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline max-w-[var(--prose-width)] animate-fade-in">
            {/* Render frontmatter header */}
            {frontmatter?.title && (
              <header className="not-prose flex flex-col gap-2 mb-8 pt-4">
                <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground mb-3">
                  {frontmatter.title}
                </h1>
                {frontmatter?.date && (
                  <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
                    <time className="font-mono text-xs bg-muted px-2 py-0.5 rounded">
                      {formatDate(new Date(frontmatter.date as string))}
                    </time>
                  </div>
                )}
                {frontmatter?.description && (
                  <div className="flex flex-wrap text-sm items-center gap-3 text-muted-foreground">
                    {frontmatter.description}
                  </div>
                )}
              </header>
            )}
            <Content components={mdxComponents} />
          </article>
        )}
      </main>
    </div>
  )
}
