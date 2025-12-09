// ===============================
// Definição das rotas da API
// ===============================
import { Router } from "express";

import * as Station from "./controllers/stationController.js";
import * as Auth from "./controllers/authController.js";
import * as Device from "./controllers/deviceController.js";

const routes = Router();

// ------------------ Rota básica ------------------
routes.get("/", (req, res) => {
  res.json({ status: "BeerControl API online" });
});

// ------------------ Auth -------------------------
routes.post("/login", Auth.login);

// ------------------ Station / Tokens -------------
routes.post("/station/token", Station.generateToken);

// ------------------ Ping p/ ESP32 ----------------
// Usado pelo firmware no comando SERVER_TEST (GET em /api/ping)
routes.get("/api/ping", Device.ping);

// ------------------ Dispositivos / Serial --------
// Ativação de dispositivo (gera ou reutiliza serial)
routes.post("/device/activate", Device.activateDevice);

// Consulta por MAC (debug / suporte)
routes.get("/device/by-mac/:mac", Device.getDeviceByMac);

export default routes;
