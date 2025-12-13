export interface SiteConfig {
  name?: string;
  description?: string;
  github?: string;
}

export interface VeslxConfig {
  dir?: string;
  site?: SiteConfig;
}

export interface ResolvedSiteConfig {
  name: string;
  description: string;
  github: string;
}

export const DEFAULT_SITE_CONFIG: ResolvedSiteConfig = {
  name: 'veslx',
  description: '',
  github: '',
};
