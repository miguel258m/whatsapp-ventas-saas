import { Router } from "express";
import rateLimit from "express-rate-limit";
import { prisma } from "../lib/prisma.js";
import { signToken, verifyPassword } from "../lib/auth.js";
import { requireAuth } from "../middleware/requireAuth.js";

export const authRouter = Router();

const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Demasiados intentos de login. Intenta de nuevo más tarde." },
});

function isValidLoginPayload(body) {
  return (
    body &&
    typeof body.email === "string" &&
    body.email.length > 0 &&
    body.email.length <= 254 &&
    typeof body.password === "string" &&
    body.password.length > 0 &&
    body.password.length <= 200
  );
}

authRouter.post("/login", loginRateLimiter, async (req, res) => {
  if (!isValidLoginPayload(req.body)) {
    return res.status(400).json({ error: "email y password son requeridos." });
  }

  const email = req.body.email.trim().toLowerCase();
  const { password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ error: "Credenciales inválidas." });
  }

  const passwordOk = await verifyPassword(password, user.passwordHash);
  if (!passwordOk) {
    return res.status(401).json({ error: "Credenciales inválidas." });
  }

  const token = signToken(user);
  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
    },
  });
});

authRouter.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});
