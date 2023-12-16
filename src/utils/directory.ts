import fs from "node:fs";
import { resolve } from "node:path";

function emptyDir(dir: string) {
  if (!fs.existsSync(dir)) return;

  for (const filename of fs.readdirSync(dir)) {
    if (filename === ".git") continue;
    const path = resolve(dir, filename);

    if (fs.lstatSync(path).isDirectory()) {
      emptyDir(path);
    } else {
      fs.unlinkSync(path);
    }
  }
}

function preDirectoryTraverse(
  dir: string,
  dirCallback: Function,
  fileCallback: Function
) {
  for (const filename of fs.readdirSync(dir)) {
    if (filename === ".git") continue;
    const path = resolve(dir, filename);
    if (fs.lstatSync(path).isDirectory()) {
      dirCallback(path);
      if (fs.existsSync(path)) {
        preDirectoryTraverse(path, dirCallback, fileCallback);
      }
      continue;
    }
    fileCallback(path);
  }
}

function postDirectoryTraverse(
  dir: string,
  dirCallback: Function,
  fileCallback: Function
) {
  for (const filename of fs.readdirSync(dir)) {
    if (filename === ".git") continue;
    const path = resolve(dir, filename);
    if (fs.lstatSync(path).isDirectory()) {
      postDirectoryTraverse(path, dirCallback, fileCallback);
      dirCallback(path);
      continue;
    }
    fileCallback(path);
  }
}

export { emptyDir, preDirectoryTraverse, postDirectoryTraverse };
