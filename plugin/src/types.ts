export interface SiteConfig {
  name?: string;
  shortName?: string;
  description?: string;
  github?: string;
}

export interface VeslxConfig {
  dir?: string;
  site?: SiteConfig;
}

export interface ResolvedSiteConfig {
  name: string;
  shortName: string;
  description: string;
  github: string;
}

export const DEFAULT_SITE_CONFIG: ResolvedSiteConfig = {
  name: 'veslx',
  shortName: 'vx',
  description: '',
  github: '',
};
