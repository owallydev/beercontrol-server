// ===============================
// Definição das rotas da API
// ===============================

import { Router } from "express";
import * as Station from "./controllers/stationController.js";
import * as Auth from "./controllers/authController.js";

const routes = Router();

// Rota para teste rápido se a API está online
routes.get("/", (req, res) => {
  res.json({ status: "BeerControl API online 🍺" });
});

// Login simples (futuramente vamos ligar com banco de dados)
routes.post("/login", Auth.login);

// Geração de token para estação
routes.post("/station/token", Station.generateToken);

export default routes;
