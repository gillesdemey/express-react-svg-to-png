import express from "express";
import helmet from "helmet";
import nocache from "nocache";
import { debuglog } from "util";
import pino from "express-pino-logger";
import { rasterizeVector } from "./util/rasterize.mjs";
import { createEngine } from "./engines/react-typescript.mjs";

const PORT = 8080;
const log = debuglog("app");

const app = express()
  .set("views", "components")
  .set("view engine", "tsx")
  .engine("tsx", createEngine());

app.use(helmet());
app.use(nocache());
app.use(pino());

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

      rasterizeVector(svg, "png")
        .then((image) => {
          res.setHeader("Content-Type", "image/png");
          res.send(image);
        })
        .catch(next);
    });
  })
  .get(["/graph.jpg", "/graph.jpeg"], (_req, res, next) => {
    res.render("graph", {}, (err, svg) => {
      if (err) {
        return next(err);
      }

      rasterizeVector(svg, "jpeg")
        .then((image) => {
          res.setHeader("Content-Type", "image/jpeg");
          res.send(image);
        })
        .catch(next);
    });
  })
  .listen(PORT, () => {
    log("Listening on http://0.0.0.0:%d", PORT);
  });
