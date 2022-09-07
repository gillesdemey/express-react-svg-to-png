import { transform } from "@swc/core";

const TRANSPILE_CACHE = new Map()

// import ts from "typescript";

// somewhat slower but probably has less edge-cases
// function transpileWithTypeScript(source) {
//   const result = ts.transpileModule(source, {
//     compilerOptions: {
//       module: "commonjs",
//       // this way we don't have to always import React
//       // see https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html
//       jsx: "react-jsx",
//       esModuleInterop: true,
//       allowSyntheticDefaultImports: true,
//       target: "es6",
//       moduleResolution: "node",
//       sourceMap: false,
//     },
//   });

//   return result.outputText;
// }

async function transpileWithSwc(source) {
  const cachedEntry = TRANSPILE_CACHE.get(source)

  if (cachedEntry) {
    return cachedEntry
  }

  const result = await transform(source, {
    jsc: {
      target: "es2021",
      parser: {
        syntax: "typescript",
        tsx: true,
      },
      transform: {
        react: {
          // this way we don't have to always import React
          // see https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html
          runtime: "automatic",
        },
      },
    },
    minify: false,
    isModule: true,
    module: {
      type: "commonjs",
      noInterop: false,
    },
    sourceMaps: false,
    swcrc: false,
  });

  TRANSPILE_CACHE.set(source, result.code)

  return result.code;
}

export {
  transpileWithSwc,
  // transpileWithTypeScript
};
