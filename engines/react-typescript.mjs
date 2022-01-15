import ts from "typescript";
import { readFile } from "fs/promises";
import React from "react";
import ReactDOMServer from "react-dom/server";
import requireFromString from "require-from-string";

function createEngine() {
  return function renderFile(filename, options, callback) {
    renderComponentToMarkup(filename, options)
      .then((markup) => {
        callback(null, markup);
      })
      .catch(callback);
  };
}

// TODO caching etc
async function renderComponentToMarkup(filename, options) {
  const source = await readFile(filename, "utf8");

  const result = ts.transpileModule(source, {
    compilerOptions: {
      module: "commonjs",
      jsx: "react",
      esModuleInterop: true,
      allowSyntheticDefaultImports: true,
      target: "es6",
      noImplicitAny: true,
      moduleResolution: "node",
      sourceMap: false,
      baseUrl: ".",
      paths: {
        "*": ["node_modules/*", "src/types/*"],
      },
    },
    include: ["components/**/*"],
  });

  const module = requireFromString(result.outputText, {
    filename,
  });

  const markup = ReactDOMServer.renderToStaticMarkup(
    React.createElement(module.default, options)
  );

  return markup;
}

export { createEngine };
