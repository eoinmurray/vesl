import { createServer } from 'vite'
import { execSync } from 'child_process'
import importConfig from "./import-config";
import veslxPlugin from '../../plugin/src/plugin'
import path from 'path'

interface PackageJson {
  name?: string;
  description?: string;
}

async function readPackageJson(cwd: string): Promise<PackageJson | null> {
  const file = Bun.file(path.join(cwd, 'package.json'));
  if (!await file.exists()) return null;
  try {
    return await file.json();
  } catch {
    return null;
  }
}

function getGitHubRepo(cwd: string): string {
  try {
    const remote = execSync('git remote get-url origin', { cwd, encoding: 'utf-8' }).trim();
    // Parse github URL: git@github.com:user/repo.git or https://github.com/user/repo.git
    const match = remote.match(/github\.com[:/]([^/]+\/[^/.]+)/);
    return match ? match[1] : '';
  } catch {
    return '';
  }
}

async function getDefaultConfig(cwd: string) {
  const pkg = await readPackageJson(cwd);
  const folderName = path.basename(cwd);
  const name = pkg?.name || folderName;
  const shortName = name.slice(0, 2).toLowerCase();

  return {
    dir: '.',
    site: {
      name,
      shortName,
      description: pkg?.description || '',
      github: getGitHubRepo(cwd),
    }
  };
}

export default async function start(dir?: string) {
  const cwd = process.cwd()

  console.log(`Starting veslx dev server in ${cwd}`);

  // Get defaults first, then merge with config file if it exists
  const defaults = await getDefaultConfig(cwd);
  const fileConfig = await importConfig(cwd);

  // CLI argument takes precedence over config file
  const config = {
    dir: dir || fileConfig?.dir || defaults.dir,
    site: {
      ...defaults.site,
      ...fileConfig?.site,
    }
  };

  const veslxRoot = new URL('../..', import.meta.url).pathname;
  const configFile = new URL('../../vite.config.ts', import.meta.url).pathname;

  // Resolve content directory relative to user's cwd (where config lives)
  const contentDir = path.isAbsolute(config.dir)
    ? config.dir
    : path.resolve(cwd, config.dir);

  const server = await createServer({
    root: veslxRoot,
    configFile,
    // Cache in user's project so it persists across bunx runs
    cacheDir: path.join(cwd, 'node_modules/.vite'),
    plugins: [
      veslxPlugin(contentDir, config)
    ],
  })

  await server.listen()
  server.printUrls()
  server.bindCLIShortcuts({ print: true })
}
