import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("libera.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT,
    last_name TEXT,
    username TEXT,
    password TEXT,
    email TEXT,
    fiscal_code TEXT,
    phone TEXT,
    qualification TEXT,
    university TEXT,
    is_unlocked INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/register", (req, res) => {
    const { firstName, lastName, username, password, email } = req.body;
    const stmt = db.prepare(`
      INSERT INTO users (first_name, last_name, username, password, email)
      VALUES (?, ?, ?, ?, ?)
    `);
    const info = stmt.run(firstName, lastName, username, password, email);
    res.json({ id: info.lastInsertRowid, ...req.body, isUnlocked: 0 });
  });

  app.post("/api/unlock", (req, res) => {
    const { userId, fiscalCode, phone, qualification, university } = req.body;
    const stmt = db.prepare(`
      UPDATE users 
      SET fiscal_code = ?, phone = ?, qualification = ?, university = ?, is_unlocked = 1 
      WHERE id = ?
    `);
    stmt.run(fiscalCode, phone, qualification, university, userId);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
