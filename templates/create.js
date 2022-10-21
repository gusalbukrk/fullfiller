/**
 * @file Node CLI script to bootstrap a new package at `packages/`.
 * @example `npm run create packageName template`.
 */

import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

/* eslint-disable import/no-extraneous-dependencies, node/no-unpublished-import */
import fse from 'fs-extra';
/* eslint-enable import/no-extraneous-dependencies, node/no-unpublished-import */

(async function createPackageFromTemplate() {
  const __dirname = dirname(fileURLToPath(import.meta.url)); // eslint-disable-line no-underscore-dangle

  const packageName = process.argv[2];
  const template = process.argv[3];

  const packagePath = join(__dirname, '../packages', packageName);
  const templatePath = join(__dirname, template);

  if (!fs.existsSync(templatePath)) {
    throw new Error("ERROR: Template doesn't exists.");
  }

  // create package
  await fse.ensureDir(packagePath);
  await fse.copy(templatePath, packagePath);

  // edit package.json
  const configPath = join(packagePath, 'package.json');
  const configContent = fs.readFileSync(configPath, 'utf-8');
  fs.writeFileSync(
    configPath,
    configContent.replace(/"name": ".*",/, `"name": "${packageName}",`)
  );

  // edit README.md
  const readmePath = join(packagePath, 'README.md');
  fs.writeFileSync(readmePath, `# ${packageName}\n`);
})().catch(
  (error) => console.error(error) /* eslint-disable-line no-console */
);
