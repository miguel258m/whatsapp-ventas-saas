import { Router } from "express";
import rateLimit from "express-rate-limit";
import { prisma } from "../lib/prisma.js";
import { signToken, verifyPassword, hashPassword } from "../lib/auth.js";
import { requireAuth } from "../middleware/requireAuth.js";

export const authRouter = Router();

const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Demasiados intentos de login. Intenta de nuevo más tarde." },
});

const signupRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Demasiados intentos de registro. Intenta de nuevo más tarde." },
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

function isValidSignupPayload(body) {
  return (
    body &&
    typeof body.businessName === "string" &&
    body.businessName.trim().length > 0 &&
    body.businessName.length <= 200 &&
    typeof body.email === "string" &&
    body.email.length > 0 &&
    body.email.length <= 254 &&
    typeof body.password === "string" &&
    body.password.length >= 6 &&
    body.password.length <= 200
  );
}

authRouter.post("/signup", signupRateLimiter, async (req, res) => {
  if (!isValidSignupPayload(req.body)) {
    return res.status(400).json({
      error: "businessName, email y password (mínimo 6 caracteres) son requeridos.",
    });
  }

  const businessName = req.body.businessName.trim();
  const email = req.body.email.trim().toLowerCase();
  const { password } = req.body;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(409).json({ error: "Ya existe una cuenta con ese email." });
  }

  const passwordHash = await hashPassword(password);

  const { tenant, user } = await prisma.$transaction(async (tx) => {
    const tenant = await tx.tenant.create({
      data: { name: businessName, status: "trial" },
    });
    const user = await tx.user.create({
      data: { tenantId: tenant.id, email, passwordHash, role: "tenant_admin" },
    });
    // Sin proveedor de email configurado todavía: se deja un registro persistido
    // para que el dueño lo vea (dashboard cross-tenant llega en el Día 15), en vez
    // de intentar enviar un correo real sin credenciales.
    await tx.metricsEvent.create({
      data: {
        tenantId: tenant.id,
        type: "owner_notification.new_signup",
        payload: { businessName, email, ownerEmail: "berdugo1232@gmail.com" },
      },
    });
    return { tenant, user };
  });

  console.log(
    `[notificación al dueño] Nuevo tenant trial "${businessName}" (${email}) — revisar en berdugo1232@gmail.com`,
  );

  const token = signToken(user);
  res.status(201).json({
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
    },
    tenant: { id: tenant.id, name: tenant.name, status: tenant.status },
  });
});

authRouter.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});
