import nodePath from "path";
import yaml from "js-yaml";

export default async function createNewConfig() {
  const configPath = "veslx.yaml";

  if (await Bun.file(configPath).exists()) {
    console.error(`Configuration file '${configPath}' already exists.`);
    return;
  }

  const cwd = process.cwd();
  const folderName = nodePath.basename(cwd);

  const config = {
    dir: ".",
    site: {
      name: folderName,
      github: "",
    },
  };

  const configStr = yaml.dump(config, { indent: 2, quotingType: '"' });

  await Bun.write(configPath, configStr);

  console.log(`Created veslx.yaml`);
  console.log(`\nEdit the file to customize your site, then run:`);
  console.log(`  veslx serve`);
}
