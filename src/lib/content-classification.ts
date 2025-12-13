import type { ContentView } from "../../plugin/src/types";
import type { DirectoryEntry, FileEntry } from "../../plugin/src/lib";
import { findReadme, findSlides, findMdxFiles, findStandaloneSlides } from "../../plugin/src/client";

export type PostEntry = {
  type: 'folder' | 'file';
  name: string;
  path: string;
  readme: FileEntry | null;
  slides: FileEntry | null;
  file: FileEntry | null;
};

export function getFrontmatter(post: PostEntry) {
  return post.readme?.frontmatter || post.file?.frontmatter || post.slides?.frontmatter;
}

export function hasDate(post: PostEntry): boolean {
  const frontmatter = getFrontmatter(post);
  return frontmatter?.date !== undefined && frontmatter.date !== null && frontmatter.date !== '';
}

export function filterByView(posts: PostEntry[], view: ContentView): PostEntry[] {
  if (view === 'all') return posts;
  if (view === 'posts') return posts.filter(hasDate);
  if (view === 'docs') return posts.filter(post => !hasDate(post));
  return posts;
}

export function getViewCounts(posts: PostEntry[]): { posts: number; docs: number; all: number } {
  const dated = posts.filter(hasDate).length;
  return {
    posts: dated,
    docs: posts.length - dated,
    all: posts.length,
  };
}

export function directoryToPostEntries(directory: DirectoryEntry): PostEntry[] {
  const folders = directory.children.filter((c): c is DirectoryEntry => c.type === "directory");
  const standaloneFiles = findMdxFiles(directory);
  const standaloneSlidesFiles = findStandaloneSlides(directory);

  const folderPosts: PostEntry[] = folders
    .map((folder) => ({
      type: 'folder' as const,
      name: folder.name,
      path: folder.path,
      readme: findReadme(folder),
      slides: findSlides(folder),
      file: null,
    }))
    .filter((post) => post.readme || post.slides); // Only include folders with content

  const filePosts: PostEntry[] = standaloneFiles.map((file) => ({
    type: 'file' as const,
    name: file.name.replace(/\.mdx?$/, ''),
    path: file.path,
    readme: null,
    slides: null,
    file,
  }));

  // Standalone slides files (e.g., getting-started.slides.mdx)
  const slidesPosts: PostEntry[] = standaloneSlidesFiles.map((file) => ({
    type: 'file' as const,
    name: file.name.replace(/\.slides\.mdx?$/, ''),
    path: file.path,
    readme: null,
    slides: file,
    file: null,
  }));

  return [...folderPosts, ...filePosts, ...slidesPosts];
}

export function filterVisiblePosts(posts: PostEntry[]): PostEntry[] {
  return posts.filter((post) => {
    const frontmatter = getFrontmatter(post);
    return frontmatter?.visibility !== "hidden" && frontmatter?.draft !== true;
  });
}

export type { ContentView };
