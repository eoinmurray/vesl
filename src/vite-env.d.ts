/// <reference types="vite/client" />

declare module 'virtual:veslx-config' {
  type ContentView = 'posts' | 'docs' | 'all';

  interface SiteConfig {
    name: string;
    description: string;
    github: string;
    defaultView: ContentView;
  }
  const config: SiteConfig;
  export default config;
}
