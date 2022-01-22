import { jsx } from "react/jsx-runtime";
import { renderToStaticMarkup } from "react-dom/server";
import requireFromString from "require-from-string";

import { readFileWithCache } from "../util/cache.mjs";
import { transpileWithSwc } from "../util/transpile.mjs";

function createEngine() {
  return renderFile;
}

const renderFile = (filename, options, callback) => {
  if (!callback) {
    return renderComponentToMarkup(filename, options);
  }

  renderComponentToMarkup(filename, options)
    .then((markup) => {
      callback(null, markup);
    })
    .catch(callback);
};

async function renderComponentToMarkup(filename, options) {
  const source = await readFileWithCache(filename, "utf8");
  const code = await transpileWithSwc(source);

  const module = requireFromString(code, { filename });
  const markup = renderToStaticMarkup(jsx(module.default, options));

  return markup;
}

export { createEngine, renderFile, renderComponentToMarkup };
