// ===============================
// BeerControl API - servidor principal
// ===============================
import express from "express";
import cors from "cors";
import deviceRoutes from "./routes/device.js";

const app = express();

// Render sempre usa essa porta internamente
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// Prefixo único da API
app.use("/api", deviceRoutes);

// Health check para o ESP
app.get("/api/ping", (req, res) => {
  res.json({ ok: true, message: "BeerControl API is alive" });
});

app.listen(PORT, () => {
  console.log(`BeerControl server rodando na porta ${PORT}`);
});
