const express = require("express");
const { Pool } = require("pg");

const app = express();

// Render/local: the platform gives the port in PORT. On Vercel this is handled automatically.
const PORT = process.env.PORT || 3000;

// Database connection: the URL comes from an env variable, never from the code
const pool = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL, max: 1 })
  : null;

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