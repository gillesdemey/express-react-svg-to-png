import { readFile } from "fs/promises";

const cache = new Map();

function readFileWithCache(filename) {
  if (cache.has(filename)) {
    return cache.get(filename);
  }

  const contents = readFile(filename, "utf8");
  cache.set(filename, contents);

  return contents;
}

export { readFileWithCache };
