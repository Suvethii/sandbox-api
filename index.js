const express = require("express");
const { Pool } = require("pg");

const app = express();

// Render/local: the platform gives the port in PORT. On Vercel this is handled automatically.
const PORT = process.env.PORT || 3000;

// Database connection: the URL comes from an env variable, never from the code
const pool = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL, max: 1 })
  : null;

// ---------- CORS: which websites may call this API from the browser ----------
const allowedOrigins = [
  "http://localhost:3000",                       // local development
  "https://sandbox-frontend-seven.vercel.app",   // production frontend
];
// Vercel preview deployments of the frontend, e.g. sandbox-frontend-git-connect-api-suvethica-sivarasa.vercel.app
const previewPattern = /^https:\/\/sandbox-frontend-[a-z0-9-]+-suvethica-sivarasa\.vercel\.app$/;

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && (allowedOrigins.includes(origin) || previewPattern.test(origin))) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", "GET");
    res.setHeader("Vary", "Origin");
  }
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});
// -----------------------------------------------------------------------------

// Home page
app.get("/", (req, res) => {
  res.send("Suvethii's sandbox API is running");
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Database check endpoint
app.get("/db", async (req, res) => {
  if (!pool) {
    return res.status(500).json({ status: "error", message: "DATABASE_URL is not set" });
  }
  try {
    const result = await pool.query("SELECT NOW() AS db_time, version() AS version");
    res.json({
      status: "ok",
      db_time: result.rows[0].db_time,
      version: result.rows[0].version,
    });
  } catch (err) {
    console.error("Database error:", err.message);
    res.status(500).json({ status: "error", message: "Could not connect to the database" });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening on port ${PORT}`);
});