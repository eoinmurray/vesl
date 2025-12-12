import nodePath from "path";

export default async function createNewConfig() {
  const configPath = "veslx.config.ts"

  if (await Bun.file(configPath).exists()) {
    console.error(`Configuration file '${configPath}' already exists.`);
    return
  }

  const cwd = process.cwd();
  const folderName = nodePath.basename(cwd);
  const shortName = folderName.slice(0, 2).toLowerCase();

  const configStr = `export default {
  dir: '.',
  site: {
    name: '${folderName}',
    shortName: '${shortName}',
    description: '',
    github: '',
  }
}
`

  await Bun.write(configPath, configStr);

  console.log(`Created veslx.config.ts`);
  console.log(`\nEdit the file to customize your site, then run:`);
  console.log(`  veslx serve`);
}