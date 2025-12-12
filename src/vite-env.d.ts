/// <reference types="vite/client" />

declare module 'virtual:veslx-config' {
  interface SiteConfig {
    name: string;
    shortName: string;
    description: string;
    github: string;
  }
  const config: SiteConfig;
  export default config;
}
