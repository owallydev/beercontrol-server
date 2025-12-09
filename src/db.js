// ===============================
// Conexão e inicialização do SQLite (Compatível com Render)
// ===============================
import sqlite3 from "sqlite3";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Pasta onde o banco ficará (TEM que estar dentro do container permitido)
const dataDir = path.join(__dirname, "db"); // <--- ALTERADO AQUI!

// Cria a pasta se não existir
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, "beercontrol.db");

// Abre (ou cria) o banco
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("❌ Erro ao abrir o banco SQLite:", err.message);
    return;
  }

  console.log("✔ Banco SQLite aberto em:", dbPath);

  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS devices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      serial TEXT NOT NULL UNIQUE,
      mac TEXT NOT NULL,
      model TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `;

  db.run(createTableSQL, (err2) => {
    if (err2) {
      console.error("❌ Erro ao criar tabela devices:", err2.message);
    } else {
      console.log("✔ Tabela devices OK");
    }
  });
});

export default db;
