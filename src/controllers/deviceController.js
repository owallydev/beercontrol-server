// ===============================
// Controller de Dispositivos (ESP32 / FlowNode)
// Responsável por:
// - gerar número de série AAAAMMDDBCTXXXX
// - vincular MAC + modelo
// - responder para o app / firmware
// ===============================
import { promisify } from "util";
import db from "../db.js";

// Promisify para usar async/await com sqlite3
const dbGet = promisify(db.get.bind(db));
const dbRun = promisify(db.run.bind(db));

// ---------------------- Função utilitária ----------------------
// Gera prefixo de serial: AAAAMMDDBCT
function buildSerialPrefix() {
  const now = new Date();
  const year = String(now.getFullYear());
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  const prefix = `${year}${month}${day}BCT`; // AAAAMMDDBCT
  return { prefix, now };
}

// ---------------------- /api/ping ------------------------------
// Usado pela ESP32 no comando SERVER_TEST (GET em /api/ping)
export const ping = (req, res) => {
  return res.json({
    status: "ok",
    service: "BeerControl API",
    time: new Date().toISOString(),
  });
};

// ---------------------- POST /device/activate ------------------
// Corpo esperado: { mac: "AA:BB:CC:DD:EE:FF", model: "BC-FLOWNODE" }
//
// Regras:
// 1. Se já existir dispositivo com esse MAC -> devolve o serial já cadastrado.
// 2. Se não existir -> gera novo serial AAAAMMDDBCTXXXX, salva e devolve.
export const activateDevice = async (req, res) => {
  try {
    const { mac, model } = req.body || {};

    if (!mac) {
      return res.status(400).json({ error: "Campo 'mac' é obrigatório" });
    }

    // Normaliza MAC (tira espaços e deixa maiúsculo)
    const macNorm = String(mac).trim().toUpperCase();

    // 1) Já existe device com esse MAC?
    const existing = await dbGet(
      "SELECT * FROM devices WHERE mac = ? ORDER BY id DESC LIMIT 1",
      [macNorm]
    );

    if (existing) {
      // Já está ativado → devolve o mesmo serial (idempotente)
      return res.json({
        serial: existing.serial,
        mac: existing.mac,
        model: existing.model,
        createdAt: existing.created_at,
        reused: true,
      });
    }

    // 2) Não existe ainda → gerar novo serial do dia
    const { prefix, now } = buildSerialPrefix(); // AAAAMMDDBCT
    const likePattern = `${prefix}%`;

    const lastForToday = await dbGet(
      "SELECT serial FROM devices WHERE serial LIKE ? ORDER BY serial DESC LIMIT 1",
      [likePattern]
    );

    let nextNumber = 1;
    if (lastForToday && lastForToday.serial) {
      const lastSerial = lastForToday.serial;
      const suffix = lastSerial.slice(-4); // pega XXXX
      const num = parseInt(suffix, 10);
      if (!Number.isNaN(num)) {
        nextNumber = num + 1;
      }
    }

    const suffix = String(nextNumber).padStart(4, "0"); // XXXX
    const newSerial = `${prefix}${suffix}`; // AAAAMMDDBCTXXXX

    const isoNow = now.toISOString();

    await dbRun(
      "INSERT INTO devices (serial, mac, model, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
      [newSerial, macNorm, model || null, isoNow, isoNow]
    );

    return res.status(201).json({
      serial: newSerial,
      mac: macNorm,
      model: model || null,
      createdAt: isoNow,
      reused: false,
    });
  } catch (err) {
    console.error("❌ Erro em activateDevice:", err);
    return res.status(500).json({ error: "Erro interno ao gerar serial" });
  }
};

// ---------------------- GET /device/by-mac/:mac ----------------
// Endpoint opcional para consulta pelo MAC (útil para debug/app)
export const getDeviceByMac = async (req, res) => {
  try {
    const macParam = req.params.mac;
    if (!macParam) {
      return res.status(400).json({ error: "Informe o MAC na URL" });
    }

    const macNorm = String(macParam).trim().toUpperCase();

    const device = await dbGet(
      "SELECT * FROM devices WHERE mac = ? ORDER BY id DESC LIMIT 1",
      [macNorm]
    );

    if (!device) {
      return res.status(404).json({ error: "Dispositivo não encontrado" });
    }

    return res.json({
      serial: device.serial,
      mac: device.mac,
      model: device.model,
      createdAt: device.created_at,
      updatedAt: device.updated_at,
    });
  } catch (err) {
    console.error("❌ Erro em getDeviceByMac:", err);
    return res.status(500).json({ error: "Erro interno ao buscar dispositivo" });
  }
};
