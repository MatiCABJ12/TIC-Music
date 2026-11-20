import "dotenv/config";
import express from "express";
import routes from "./routes/routes.js";


const app = express();

app.use(express.json());

app.get("/", (_, res) => {
  res.send("TIC Music API working!");
});

app.use("/", routes); //todo lo que arranca con / se va al archivo de routes

// Solo levanta el servidor cuando corre en tu compu (Vercel no lo necesita)
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
}

export default app;