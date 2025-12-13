export type ContentView = 'posts' | 'docs' | 'all';

export interface SiteConfig {
  name?: string;
  description?: string;
  github?: string;
  defaultView?: ContentView;
}

export interface VeslxConfig {
  dir?: string;
  site?: SiteConfig;
}

export interface ResolvedSiteConfig {
  name: string;
  description: string;
  github: string;
  defaultView: ContentView;
}

export const DEFAULT_SITE_CONFIG: ResolvedSiteConfig = {
  name: 'veslx',
  description: '',
  github: '',
  defaultView: 'all',
};
