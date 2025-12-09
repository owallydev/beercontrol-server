// ===============================
// Definição das rotas da API
// ===============================
import express from "express";
import sqlite3 from "sqlite3";

const router = express.Router();

// Abre o banco SQLite dentro do Render (persistência limitada — OK p/ testes)
const db = new sqlite3.Database("/opt/render/project/src/data/beercontrol.db");

// Cria tabela se não existir
db.run(`
  CREATE TABLE IF NOT EXISTS devices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    mac TEXT UNIQUE,
    model TEXT,
    serial TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// =========================
//   ATIVAÇÃO DO DISPOSITIVO
// =========================
router.post("/device/activate", (req, res) => {
  const { mac, model } = req.body;

  if (!mac || !model) {
    return res.status(400).json({
      activateOK: false,
      activateMsg: "MAC_OR_MODEL_MISSING"
    });
  }

  // Gera serial no formato BCYYMMDDXXXX
  const prefix = "BC";
  const date = new Date();
  const code =
    date.getFullYear().toString().slice(2) +
    String(date.getMonth() + 1).padStart(2, "0") +
    String(date.getDate()).padStart(2, "0");

  // Serial final
  const serial = `${prefix}${code}${Math.floor(Math.random() * 9999)
    .toString()
    .padStart(4, "0")}`;

  // Insere ou atualiza dispositivo
  db.run(
    `
    INSERT INTO devices (mac, model, serial)
    VALUES (?, ?, ?)
    ON CONFLICT(mac) DO UPDATE SET serial = excluded.serial, model = excluded.model
  `,
    [mac, model, serial],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          activateOK: false,
          activateMsg: "DB_ERROR"
        });
      }

      return res.json({
        activateOK: true,
        serial,
        activateMsg: "DEVICE_ACTIVATED"
      });
    }
  );
});

export default router;
