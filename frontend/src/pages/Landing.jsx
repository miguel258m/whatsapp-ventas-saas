import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import Badge from "../components/ui/Badge.jsx";

const PLANS = [
  {
    name: "Starter",
    price: "$95",
    description: "Para un negocio con un solo canal de WhatsApp.",
    features: [
      "1 número de WhatsApp conectado",
      "Catálogo y pedidos ilimitados",
      "Dashboard de pedidos en vivo",
      "Soporte por email",
    ],
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$150",
    description: "Para negocios que ya venden todos los días por WhatsApp.",
    features: [
      "1 número de WhatsApp conectado",
      "Notas de voz e import de catálogo por PDF",
      "Reservas y promociones",
      "Soporte prioritario",
    ],
    highlighted: true,
  },
  {
    name: "Escala",
    price: "$250",
    description: "Para cadenas o negocios con múltiples sedes.",
    features: [
      "Hasta 3 números de WhatsApp",
      "Roles y permisos por sede",
      "Métricas avanzadas",
      "Onboarding asistido",
    ],
    highlighted: false,
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-ink-50">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <span className="text-lg font-bold text-ink-900">
          WhatsApp<span className="text-brand-500">Ventas</span>
        </span>
        <nav className="flex items-center gap-3">
          <Button as="a" href="/login" variant="ghost" size="sm">
            Iniciar sesión
          </Button>
          <Button as="a" href="/signup" variant="primary" size="sm">
            Crear cuenta
          </Button>
        </nav>
      </header>

      <main>
        <section className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 pb-20 pt-12 text-center">
          <Badge>Bot de ventas por WhatsApp</Badge>
          <h1 className="text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl">
            Vende por WhatsApp con un bot que nunca se cansa de atender
          </h1>
          <p className="max-w-2xl text-lg text-ink-600">
            Conecta tu número de WhatsApp, sube tu catálogo y deja que la
            plataforma tome pedidos, arme el carrito y cobre por ti — con un
            dashboard donde ves cada conversación y cada venta en vivo.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button as="a" href="/signup" size="lg">
              Empezar ahora
            </Button>
            <Button as="a" href="#planes" variant="outline" size="lg">
              Ver planes
            </Button>
          </div>
        </section>

        <section id="planes" className="mx-auto max-w-6xl px-6 pb-24">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-ink-900">
              Un plan para cada tamaño de negocio
            </h2>
            <p className="mt-2 text-ink-600">
              Sin contratos largos, cambia o cancela cuando quieras.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {PLANS.map((plan) => (
              <Card
                key={plan.name}
                className={
                  plan.highlighted
                    ? "border-brand-500 ring-2 ring-brand-500/30"
                    : ""
                }
              >
                {plan.highlighted && (
                  <Badge className="mb-4">Más popular</Badge>
                )}
                <h3 className="text-xl font-bold text-ink-900">{plan.name}</h3>
                <p className="mt-1 text-sm text-ink-600">{plan.description}</p>
                <p className="mt-4 text-3xl font-extrabold text-ink-900">
                  {plan.price}
                  <span className="text-base font-medium text-ink-500">
                    /mes
                  </span>
                </p>
                <ul className="mt-6 flex flex-col gap-2 text-sm text-ink-700">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <span className="mt-0.5 text-brand-500">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  as="a"
                  href="/signup"
                  variant={plan.highlighted ? "primary" : "outline"}
                  className="mt-8 w-full"
                >
                  Elegir {plan.name}
                </Button>
              </Card>
            ))}
          </div>
        </section>

        <section className="border-t border-ink-100 bg-white">
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 px-6 py-16 text-center">
            <h2 className="text-2xl font-bold text-ink-900">
              ¿Listo para automatizar tus ventas por WhatsApp?
            </h2>
            <Button as="a" href="/signup" size="lg">
              Crear cuenta gratis
            </Button>
          </div>
        </section>
      </main>

      <footer className="mx-auto max-w-6xl px-6 py-8 text-center text-sm text-ink-500">
        © {new Date().getFullYear()} WhatsAppVentas
      </footer>
    </div>
  );
}
