import express from "express";
const app = express();
const port = 3000;

import {createUsuario} from "./funciones.js";
import {getMati} from "./funciones.js";
import {escucho} from "./funciones.js";


app.use(express.json());

app.get("/", (_, res) => {
  res.send("TIC Music API working!");
});

/* ------------------- Rutas ------------------- */

app.post("/crearusuario", createUsuario);
app.get("/login", getMati); 
app.post("/escucho", escucho);

const server = app.listen(port, () => {
  console.log(`TIC Music API listening at http://localhost:${port}`);
});

export { app, server };
