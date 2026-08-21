import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

// Password de prueba conocido, solo para la DB de desarrollo compartida — nunca usar en producción.
const SEED_OWNER_PASSWORD = "cambiar-en-produccion";

async function main() {
  const passwordHash = await bcrypt.hash(SEED_OWNER_PASSWORD, 10);

  const owner = await prisma.user.upsert({
    where: { email: "dueno@whatsapp-ventas-saas.test" },
    update: { passwordHash },
    create: {
      email: "dueno@whatsapp-ventas-saas.test",
      passwordHash,
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
