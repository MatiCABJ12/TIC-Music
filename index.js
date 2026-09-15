import express from "express";
const app = express();
const port = 3000;

import createUsuario from "./funciones.js";


app.use(express.json());

app.get("/", (_, res) => {
  res.send("TIC Music API working!");
});

/* ------------------- Rutas ------------------- */

app.post("/crearusuario", createUsuario);
app.get("/login", funciones.getMati);
app.get("/escucho", funciones.getAlgo);

const server = app.listen(port, () => {
  console.log(`TIC Music API listening at http://localhost:${port}`);
});

export { app, server };
