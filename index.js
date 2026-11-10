import "dotenv/config";
import express from "express";
import routes from "./routes/routes.js";


const app = express();

app.use(express.json());

app.get("/", (_, res) => {
  res.send("TIC Music API working!");
});

app.use("/", routes); //todo lo que arranca con / se va al archivo de routes

export default app;