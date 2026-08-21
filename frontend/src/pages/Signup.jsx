import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import Input from "../components/ui/Input.jsx";

function validate({ businessName, email, password, confirmPassword }) {
  const errors = {};
  if (!businessName.trim()) {
    errors.businessName = "Ingresa el nombre de tu negocio.";
  }
  if (!email.trim()) {
    errors.email = "Ingresa tu email.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Ingresa un email válido.";
  }
  if (!password) {
    errors.password = "Ingresa una contraseña.";
  } else if (password.length < 6) {
    errors.password = "La contraseña debe tener al menos 6 caracteres.";
  }
  if (confirmPassword !== password) {
    errors.confirmPassword = "Las contraseñas no coinciden.";
  }
  return errors;
}

export default function Signup() {
  const [form, setForm] = useState({
    businessName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
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
          <h1 className="text-2xl font-bold text-ink-900">Crear cuenta</h1>
          <p className="mt-1 text-sm text-ink-600">
            Empieza gratis y conecta tu WhatsApp en minutos.
          </p>

          <form
            className="mt-6 flex flex-col gap-4"
            onSubmit={handleSubmit}
            noValidate
          >
            <Input
              id="businessName"
              label="Nombre del negocio"
              type="text"
              placeholder="Mi Restaurante"
              value={form.businessName}
              onChange={handleChange("businessName")}
              error={errors.businessName}
            />
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
            <Input
              id="confirmPassword"
              label="Confirmar contraseña"
              type="password"
              placeholder="••••••••"
              value={form.confirmPassword}
              onChange={handleChange("confirmPassword")}
              error={errors.confirmPassword}
            />

            {status === "submitted" && (
              <p className="rounded-xl border border-brand-200 bg-brand-50 px-3.5 py-2.5 text-sm text-brand-700">
                Datos válidos. La conexión real al backend (creación del
                tenant) llega en el Día 6 — por ahora esta pantalla es solo
                de diseño.
              </p>
            )}

            <Button type="submit" size="lg" disabled={status === "loading"}>
              {status === "loading" ? "Creando cuenta…" : "Crear cuenta gratis"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-600">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="font-semibold text-brand-600">
              Iniciar sesión
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
