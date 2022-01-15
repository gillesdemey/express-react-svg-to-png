import ts from "typescript";
import React from "react";
import ReactDOMServer from "react-dom/server";
import requireFromString from "require-from-string";
import { readFileWithCache } from "../util/cache.mjs";

function createEngine() {
  return renderFile;
}

const renderFile = (filename, options, callback) => {
  renderComponentToMarkup(filename, options)
    .then((markup) => {
      callback(null, markup);
    })
    .catch(callback);
};

async function renderComponentToMarkup(filename, options) {
  const source = await readFileWithCache(filename, "utf8");

  const result = ts.transpileModule(source, {
    compilerOptions: {
      module: "commonjs",
      // this way we don't have to always import React
      // see https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html
      jsx: "react-jsx",
      esModuleInterop: true,
      allowSyntheticDefaultImports: true,
      target: "es6",
      moduleResolution: "node",
      sourceMap: false,
    },
  });

  const module = requireFromString(result.outputText, { filename });

  const markup = ReactDOMServer.renderToStaticMarkup(
    React.createElement(module.default, options)
  );

  return markup;
}

export { createEngine };
