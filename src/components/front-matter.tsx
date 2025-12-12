import { useMDXContent, useMDXSlides } from "@/hooks/use-mdx-content";
import { formatDate } from "@/lib/format-date"
import { useParams } from "react-router-dom"

export function FrontMatter(){
  const { "path": path = "." } = useParams();
  const { frontmatter: readmeFm } = useMDXContent(path);
  const { frontmatter: slidesFm } = useMDXSlides(path);

  let frontmatter = readmeFm || slidesFm;

  return (
    <div>
      {frontmatter?.title && (
        <header className="not-prose flex flex-col gap-2 mb-8 pt-4">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground mb-3">
            {frontmatter?.title}
          </h1>

          {/* Meta line */}
          <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
            {frontmatter?.date && (
              <time className="font-mono text-xs bg-muted px-2 py-0.5 rounded">
                {formatDate(new Date(frontmatter.date as string))}
              </time>
            )}
          </div>

          {frontmatter?.description && (
            <div className="flex flex-wrap text-sm items-center gap-3 text-muted-foreground">
              {frontmatter?.description}
            </div>
          )}
        </header>
      )}
    </div>
  )
}