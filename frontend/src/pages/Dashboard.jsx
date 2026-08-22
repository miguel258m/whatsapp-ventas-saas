import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import { getSession, clearSession } from "../lib/session.js";

export default function Dashboard() {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);

  useEffect(() => {
    const current = getSession();
    if (!current) {
      navigate("/login", { replace: true });
      return;
    }
    setSession(current);
  }, [navigate]);

  function handleLogout() {
    clearSession();
    navigate("/login", { replace: true });
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-ink-50 px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-xl font-bold text-ink-900">
            WhatsApp<span className="text-brand-500">Ventas</span>
          </h1>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Cerrar sesión
          </Button>
        </div>

        <Card>
          <h2 className="text-lg font-semibold text-ink-900">
            Bienvenido, {session.user.email}
          </h2>
          <p className="mt-2 text-sm text-ink-600">
            Rol: {session.user.role}
            {session.user.tenantId ? ` · Tenant: ${session.user.tenantId}` : ""}
          </p>
          <p className="mt-6 rounded-xl border border-ink-200 bg-ink-50 px-3.5 py-2.5 text-sm text-ink-600">
            Este dashboard está vacío por ahora — pedidos, catálogo y
            conexión de WhatsApp llegan en las próximas fases del roadmap.
          </p>
        </Card>
      </div>
    </div>
  );
}
