import { verifyToken } from "../lib/auth.js";

export function requireAuth(req, res, next) {
  const header = req.headers.authorization ?? "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "Falta token de autenticación." });
  }

  try {
    const payload = verifyToken(token);
    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      tenantId: payload.tenantId ?? null,
    };
    // Middleware de tenant-scoping: nunca confiar en un tenantId provisto por el cliente.
    req.tenantId = payload.tenantId ?? null;
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido o expirado." });
  }
}

export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "No tienes permiso para esta acción." });
    }
    next();
  };
}
