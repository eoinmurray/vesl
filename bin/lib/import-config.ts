import yaml from 'js-yaml';
import type { VeslxConfig } from '../../plugin/src/types';

export default async function importConfig(root: string): Promise<VeslxConfig | undefined> {
  const file = Bun.file(`${root}/veslx.yaml`);

  if (!await file.exists()) {
    return undefined;
  }

  const content = await file.text();
  const config = yaml.load(content) as VeslxConfig;
  return config;
}
