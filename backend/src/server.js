import express from "express";

const app = express();
const PORT = process.env.PORT || 4000;

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "whatsapp-ventas-saas-backend" });
});

app.listen(PORT, () => {
  console.log(`backend listening on http://localhost:${PORT}`);
});
