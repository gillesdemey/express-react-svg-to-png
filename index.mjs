import express from "express";
import helmet from "helmet";
import nocache from "nocache";
import { debuglog } from "util";
import { rasterizeVector } from "./util/rasterize.mjs";
import { createEngine } from "./engines/react-typescript.mjs";

const PORT = 8080
const log = debuglog("app")

const app = express()
  .set("views", "components")
  .set("view engine", "tsx")
  .engine("tsx", createEngine());

app.use(helmet());
app.use(nocache());

app
  .get("/graph", (_req, res) => {
    res.setHeader("Content-Type", "text/html");
    res.render("graph");
  })
  .get("/graph.svg", (_req, res) => {
    res.setHeader("Content-Type", "image/svg+xml");
    res.render("graph");
  })
  .get("/graph.png", (_req, res, next) => {
    res.render("graph", {}, (err, svg) => {
      if (err) {
        return next(err);
      }

      rasterizeVector(svg)
        .then((image) => {
          res.setHeader("Content-Type", "image/png");
          res.send(image);
        })
        .catch(next);
    });
  })
  .listen(PORT, () => {
    log("Listening on http://0.0.0.0:%d", PORT);
  });

