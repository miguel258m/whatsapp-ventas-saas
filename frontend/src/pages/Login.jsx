import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import Input from "../components/ui/Input.jsx";

function validate({ email, password }) {
  const errors = {};
  if (!email.trim()) {
    errors.email = "Ingresa tu email.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Ingresa un email válido.";
  }
  if (!password) {
    errors.password = "Ingresa tu contraseña.";
  } else if (password.length < 6) {
    errors.password = "La contraseña debe tener al menos 6 caracteres.";
  }
  return errors;
}

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | loading | submitted

  function handleChange(field) {
    return (event) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
      setStatus("idle");
    };
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus("loading");
    setTimeout(() => {
      setStatus("submitted");
    }, 700);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-50 px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link to="/" className="text-lg font-bold text-ink-900">
            WhatsApp<span className="text-brand-500">Ventas</span>
          </Link>
        </div>
        <Card>
          <h1 className="text-2xl font-bold text-ink-900">Iniciar sesión</h1>
          <p className="mt-1 text-sm text-ink-600">
            Ingresa a tu cuenta para gestionar tus pedidos.
          </p>

          <form
            className="mt-6 flex flex-col gap-4"
            onSubmit={handleSubmit}
            noValidate
          >
            <Input
              id="email"
              label="Email"
              type="email"
              placeholder="tu@negocio.com"
              value={form.email}
              onChange={handleChange("email")}
              error={errors.email}
            />
            <Input
              id="password"
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange("password")}
              error={errors.password}
            />

            {status === "submitted" && (
              <p className="rounded-xl border border-brand-200 bg-brand-50 px-3.5 py-2.5 text-sm text-brand-700">
                Datos válidos. La conexión real al backend llega en el Día 6
                — por ahora esta pantalla es solo de diseño.
              </p>
            )}

            <Button type="submit" size="lg" disabled={status === "loading"}>
              {status === "loading" ? "Ingresando…" : "Iniciar sesión"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-600">
            ¿No tienes cuenta?{" "}
            <Link to="/signup" className="font-semibold text-brand-600">
              Crear cuenta
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
