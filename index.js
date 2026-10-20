const express = require("express");

const app = express();

// Render gives the port in the PORT env variable. 3000 is only for local testing.
const PORT = process.env.PORT || 3000;

// Home page
app.get("/", (req, res) => {
  res.send("Suvethii's sandbox API is running");
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// 0.0.0.0 = accept connections from outside the container, not just localhost
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening on port ${PORT}`);
});