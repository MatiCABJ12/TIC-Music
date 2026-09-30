
import express from "express";

import {
  createUsuario,
  getMati,
  escucho
} from "./funciones.js";

const app = express();

app.use(express.json());

app.get("/", (_, res) => {
  res.send("TIC Music API working!");
});

/* ------------------- Rutas ------------------- */

app.post("/crearusuario", createUsuario);
app.get("/login", getMati);
app.post("/escucho", escucho);

export default app;
