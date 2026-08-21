import express from "express";
import { authRouter } from "./routes/auth.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "whatsapp-ventas-saas-backend" });
});

app.use("/api", authRouter);

app.listen(PORT, () => {
  console.log(`backend listening on http://localhost:${PORT}`);
});
