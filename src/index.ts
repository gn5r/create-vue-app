#!/usr/bin/env node

import path from "node:path";
import fs from "node:fs";

import minimist from "minimist";
import {
  initPrompts,
  renderTemplate,
  installDependencies,
  emptyDir,
  initialGit,
  preDirectoryTraverse,
  postDirectoryTraverse,
} from "./utils";

import type { Context } from "./utils/prompts";

import { bold, green, red } from "kolorist";

import ejs from "ejs";

async function run() {
  const argv = minimist(process.argv.slice(2));
  const defaultProjectName = argv._[0] ? argv._[0] : "vue-app";

  const context: Context = {
    cwd: process.cwd(),
    targetDir: argv._[0],
    projectName: defaultProjectName,
  };

  const {
    cwd,
    targetDir,
    projectName,
    packageName = projectName ?? defaultProjectName,
    isOverwrite,
    author,
    version,
    runGitInit,
    usePages,
    useVueLayouts,
    usePackageManager,
  } = await initPrompts(context);

  const root = path.join(cwd, targetDir);

  if (fs.existsSync(root) && isOverwrite) {
    emptyDir(root);
  } else if (!fs.existsSync(root)) {
    fs.mkdirSync(root);
  }

  fs.writeFileSync(
    path.resolve(root, "package.json"),
    JSON.stringify(
      {
        name: packageName,
        version: version,
        private: true,
        author: author,
      },
      null,
      2
    )
  );

  const templatePath = path.resolve(__dirname, "../template");
  renderTemplate(path.resolve(templatePath, "base"), root);

  if (usePages && useVueLayouts) {
    renderTemplate(path.resolve(templatePath, "pagesAndVueLayouts"), root);
  } else if (usePages) {
    renderTemplate(path.resolve(templatePath, "pages"), root);
  } else if (useVueLayouts) {
    renderTemplate(path.resolve(templatePath, "vueLayouts"), root);
  }

  if (runGitInit) {
    initialGit(root);
  }

  if (usePackageManager) {
    console.log(`Installing dependencies with ${usePackageManager}...\n`);
    installDependencies(root, usePackageManager);
  }

  // EJS template rendering
  preDirectoryTraverse(
    root,
    () => {},
    (filepath: string) => {
      if (filepath.endsWith(".ejs")) {
        const template = fs.readFileSync(filepath, "utf8");
        const dest = filepath.replace(/\.ejs$/, "");
        const content = ejs.render(template, {
          packageManager: usePackageManager,
        });

        fs.writeFileSync(dest, content);
        fs.unlinkSync(filepath);
      }
    }
  );

  // grant execute permission to files under .husky
  postDirectoryTraverse(
    `${root}/.husky`,
    () => {},
    (filepath: string) => {
      if (!(fs.statSync(filepath).mode & 0o111)) {
        fs.chmodSync(filepath, 0o755);
      }
    }
  );

  console.log(
    `\n${bold(green(`${projectName} has been generated at ${root}\n`))}`
  );
}

run()
  .then(() => {
    console.log("GitHub: https://github.com/gn5r/create-vue-app");
  })
  .catch((err) => {
    console.error(`\n${red("✖")} ${err}\n`);
    process.exit(1);
  });
