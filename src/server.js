// ===============================
// BeerControl API - servidor principal
// ===============================
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes.js";

dotenv.config();

const app = express();

// Middleware base
app.use(cors());
app.use(express.json());

// Rotas principais
app.use("/", routes);

// Porta da aplicação (Render usa PORT do ambiente)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✔ BeerControl API rodando na porta ${PORT}`);
});
