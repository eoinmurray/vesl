import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ContentView } from "@/lib/content-classification";

interface ContentTabsProps {
  value: ContentView;
  onChange: (view: ContentView) => void;
  counts: { posts: number; docs: number; all: number };
}

export function ContentTabs({ value, onChange, counts }: ContentTabsProps) {
  const hasOnlyPosts = counts.posts > 0 && counts.docs === 0;
  const hasOnlyDocs = counts.docs > 0 && counts.posts === 0;

  if (hasOnlyPosts || hasOnlyDocs) {
    return null;
  }

  return (
    <Tabs value={value} onValueChange={(v) => onChange(v as ContentView)}>
      <TabsList>
        <TabsTrigger value="posts" disabled={counts.posts === 0}>
          Posts
          {counts.posts > 0 && (
            <span className="ml-1.5 text-xs opacity-60">({counts.posts})</span>
          )}
        </TabsTrigger>
        <TabsTrigger value="docs" disabled={counts.docs === 0}>
          Docs
          {counts.docs > 0 && (
            <span className="ml-1.5 text-xs opacity-60">({counts.docs})</span>
          )}
        </TabsTrigger>
        <TabsTrigger value="all">
          All
          <span className="ml-1.5 text-xs opacity-60">({counts.all})</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
