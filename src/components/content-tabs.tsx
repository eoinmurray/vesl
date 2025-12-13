import { cn } from "@/lib/utils";
import type { ContentView } from "@/lib/content-classification";

interface ContentTabsProps {
  value: ContentView;
  onChange: (view: ContentView) => void;
  counts: { posts: number; docs: number; all: number };
}

const views: { key: ContentView; label: string }[] = [
  { key: "posts", label: "posts" },
  { key: "docs", label: "docs" },
  { key: "all", label: "all" },
];

export function ContentTabs({ value, onChange, counts }: ContentTabsProps) {
  const hasOnlyPosts = counts.posts > 0 && counts.docs === 0;
  const hasOnlyDocs = counts.docs > 0 && counts.posts === 0;

  if (hasOnlyPosts || hasOnlyDocs) {
    return null;
  }

  const isDisabled = (key: ContentView) => {
    if (key === "posts") return counts.posts === 0;
    if (key === "docs") return counts.docs === 0;
    return false;
  };

  return (
    <nav className="flex items-center gap-1 font-mono text-xs text-muted-foreground">
      {views.map((view, i) => (
        <span key={view.key} className="flex items-center">
          {i > 0 && <span className="mx-2 select-none opacity-30">/</span>}
          <button
            onClick={() => onChange(view.key)}
            disabled={isDisabled(view.key)}
            className={cn(
              "transition-colors duration-150",
              "hover:text-foreground",
              "disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-muted-foreground",
              value === view.key
                ? "text-foreground underline underline-offset-4 decoration-primary/60"
                : ""
            )}
          >
            {view.label}
          </button>
        </span>
      ))}
    </nav>
  );
}
