import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const owner = await prisma.user.upsert({
    where: { email: "dueno@whatsapp-ventas-saas.test" },
    update: {},
    create: {
      email: "dueno@whatsapp-ventas-saas.test",
      // Placeholder: el Día 5 agrega bcrypt y reemplaza esto por un hash real.
      passwordHash: "PENDIENTE_DIA_5_BCRYPT",
      role: "owner_admin",
      tenantId: null,
    },
  });

  const tenant = await prisma.tenant.upsert({
    where: { id: "00000000-0000-0000-0000-000000000001" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000001",
      name: "Tenant de prueba",
      status: "trial",
    },
  });

  console.log("Seed OK:", { owner: owner.email, tenant: tenant.name });
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
