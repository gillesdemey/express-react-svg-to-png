# SVG to PNG with a React graph component

## Installation

```
yarn install
```

## Running the service

```
make dev
```

Visit it in your browser

```
open http://localhost:8080/graph
open http://localhost:8080/graph.svg
open http://localhost:8080/graph.png
open http://localhost:8080/graph.jpeg
```

<img width="1005" alt="image" src="https://user-images.githubusercontent.com/868844/149631724-2672f54e-b211-4023-a10b-c346e354e23f.png">

## How does it work?

It's a simple express service that uses a custom `engine` (see [`engines/react-typescript.mjs`](engines/react-typescript.mjs)) that does the following:

1. Transpile the React components from `components/**/*` to a commonjs module with `_jsx` calls (not `React.createComponent`, see https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html)
1. Transform the transpiled output (a `string`) to a module
1. Feed that module to `ReactDOMServer.renderToStaticMarkup` to receive the finalized markup – it's an SVG powered by [`visx`](https://airbnb.io/visx/).

The resulting SVG is rasterized to either a PNG or JPEG file using [`sharp`](https://sharp.pixelplumbing.com/) – see [`util/rasterize.mjs`](util/rasterize.mjs).
