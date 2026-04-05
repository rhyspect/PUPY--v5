import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync, statSync } from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const frontendDir = process.cwd();
const repoRoot = path.resolve(frontendDir, '..', '..');
const backendDir = path.resolve(repoRoot, '\u540e\u7aefV5');
const targetDir = path.resolve(frontendDir, 'api', '_backend');
const backendNodeModules = path.resolve(backendDir, 'node_modules');
const backendDist = path.resolve(backendDir, 'dist');
const backendPublic = path.resolve(backendDir, 'src', 'public');

const run = (command, args, cwd) => {
  const result = spawnSync(command, args, {
    cwd,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
};

const copyDirectory = (sourceDir, targetRoot) => {
  mkdirSync(targetRoot, { recursive: true });
  for (const entry of readdirSync(sourceDir, { withFileTypes: true })) {
    const sourcePath = path.join(sourceDir, entry.name);
    const targetPath = path.join(targetRoot, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(sourcePath, targetPath);
      continue;
    }

    if (entry.isFile() || statSync(sourcePath).isFile()) {
      mkdirSync(path.dirname(targetPath), { recursive: true });
      copyFileSync(sourcePath, targetPath);
    }
  }
};

if (!existsSync(backendNodeModules)) {
  run('npm', ['install'], backendDir);
}

run('npm', ['run', 'build'], backendDir);

rmSync(targetDir, { recursive: true, force: true });
mkdirSync(targetDir, { recursive: true });
copyDirectory(backendDist, path.resolve(targetDir, 'dist'));

if (existsSync(backendPublic)) {
  copyDirectory(backendPublic, path.resolve(targetDir, 'public'));
  copyDirectory(backendPublic, path.resolve(targetDir, 'dist', 'public'));
}
