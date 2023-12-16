import fs from "node:fs";
import path from "node:path";

function emptyDir(dir: string) {
  if (!fs.existsSync(dir)) return;

  for (const filename of fs.readdirSync(dir)) {
    if (filename === ".git") continue;
    const fullpath = path.resolve(dir, filename);

    if (fs.lstatSync(fullpath).isDirectory()) {
      emptyDir(fullpath);
    } else {
      fs.unlinkSync(fullpath);
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
    const fullpath = path.resolve(dir, filename);

    if (fs.lstatSync(fullpath).isDirectory()) {
      dirCallback(fullpath);
      if (fs.existsSync(fullpath)) {
        preDirectoryTraverse(fullpath, dirCallback, fileCallback);
      }
      continue;
    }
    fileCallback(fullpath);
  }
}

function postDirectoryTraverse(
  dir: string,
  dirCallback: Function,
  fileCallback: Function
) {
  for (const filename of fs.readdirSync(dir)) {
    if (filename === ".git") continue;
    const fullpath = path.resolve(dir, filename);

    if (fs.lstatSync(fullpath).isDirectory()) {
      postDirectoryTraverse(fullpath, dirCallback, fileCallback);
      dirCallback(fullpath);
      continue;
    }
    fileCallback(fullpath);
  }
}

export { emptyDir, preDirectoryTraverse, postDirectoryTraverse };
