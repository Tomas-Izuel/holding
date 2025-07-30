import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed de la base de datos...");

  // Crear tipos de usuario
  console.log("📝 Creando tipos de usuario...");
  const adminType = await prisma.typeUser.upsert({
    where: { name: "admin" },
    update: {},
    create: {
      name: "admin",
    },
  });

  const userType = await prisma.typeUser.upsert({
    where: { name: "user" },
    update: {},
    create: {
      name: "user",
    },
  });

  // Crear permisos
  console.log("🔐 Creando permisos...");
  const permissions = await Promise.all([
    prisma.permission.upsert({
      where: { name: "manage_groups" },
      update: {},
      create: {
        name: "manage_groups",
        description: "Permite crear y gestionar grupos de inversión",
        typeUserId: adminType.id,
      },
    }),
    prisma.permission.upsert({
      where: { name: "view_holdings" },
      update: {},
      create: {
        name: "view_holdings",
        description: "Permite ver holdings y sus rendimientos",
        typeUserId: userType.id,
      },
    }),
    prisma.permission.upsert({
      where: { name: "manage_holdings" },
      update: {},
      create: {
        name: "manage_holdings",
        description: "Permite agregar y editar holdings",
        typeUserId: userType.id,
      },
    }),
  ]);

  // Crear usuarios
  console.log("👤 Creando usuarios...");
  const hashedPassword = await bcrypt.hash("password123", 10);

  await prisma.user.upsert({
    where: { email: "admin@holding.com" },
    update: {},
    create: {
      email: "admin@holding.com",
      name: "Administrador",
      password: hashedPassword,
      typeId: adminType.id,
    },
  });

  const testUser = await prisma.user.upsert({
    where: { email: "usuario@holding.com" },
    update: {},
    create: {
      email: "usuario@holding.com",
      name: "Usuario Test",
      password: hashedPassword,
      typeId: userType.id,
    },
  });

  // Crear tipos de inversión
  console.log("💰 Creando tipos de inversión...");
  const cedearsType = await prisma.typeInvestment.create({
    data: {
      name: "Cedears",
      scrappingUrl: "https://api.example.com/cedears",
      currency: "ARS",
    },
  });

  const cryptoType = await prisma.typeInvestment.create({
    data: {
      name: "Criptomonedas",
      scrappingUrl: "https://api.example.com/crypto",
      currency: "USD",
    },
  });

  const stocksType = await prisma.typeInvestment.create({
    data: {
      name: "Acciones",
      scrappingUrl: "https://api.example.com/stocks",
      currency: "USD",
    },
  });

  // Crear grupos
  console.log("📊 Creando grupos de inversión...");
  const cedearsGroup = await prisma.group.create({
    data: {
      name: "Mi Portfolio de Cedears",
      userId: testUser.id,
      typeId: cedearsType.id,
    },
  });

  const cryptoGroup = await prisma.group.create({
    data: {
      name: "Crypto Portfolio",
      userId: testUser.id,
      typeId: cryptoType.id,
    },
  });

  const stocksGroup = await prisma.group.create({
    data: {
      name: "Acciones US",
      userId: testUser.id,
      typeId: stocksType.id,
    },
  });

  // Crear holdings
  console.log("📈 Creando holdings...");
  const holdings = await Promise.all([
    // Cedears
    prisma.holding.create({
      data: {
        name: "Apple",
        code: "AAPL",
        groupId: cedearsGroup.id,
        quantity: 10,
        lastPrice: 150.25,
        earnings: 125.5,
        relativeEarnings: 5.2,
      },
    }),
    prisma.holding.create({
      data: {
        name: "Microsoft",
        code: "MSFT",
        groupId: cedearsGroup.id,
        quantity: 5,
        lastPrice: 320.75,
        earnings: 45.25,
        relativeEarnings: 2.8,
      },
    }),
    prisma.holding.create({
      data: {
        name: "Tesla",
        code: "TSLA",
        groupId: cedearsGroup.id,
        quantity: 8,
        lastPrice: 245.3,
        earnings: -15.7,
        relativeEarnings: -2.1,
      },
    }),

    // Criptomonedas
    prisma.holding.create({
      data: {
        name: "Bitcoin",
        code: "BTC",
        groupId: cryptoGroup.id,
        quantity: 0.5,
        lastPrice: 45000.0,
        earnings: 2500.0,
        relativeEarnings: 5.9,
      },
    }),
    prisma.holding.create({
      data: {
        name: "Ethereum",
        code: "ETH",
        groupId: cryptoGroup.id,
        quantity: 2.5,
        lastPrice: 3200.0,
        earnings: 400.0,
        relativeEarnings: 14.3,
      },
    }),

    // Acciones US
    prisma.holding.create({
      data: {
        name: "Alphabet Inc.",
        code: "GOOGL",
        groupId: stocksGroup.id,
        quantity: 3,
        lastPrice: 2800.0,
        earnings: 150.0,
        relativeEarnings: 5.7,
      },
    }),
    prisma.holding.create({
      data: {
        name: "Amazon",
        code: "AMZN",
        groupId: stocksGroup.id,
        quantity: 2,
        lastPrice: 3400.0,
        earnings: 200.0,
        relativeEarnings: 6.3,
      },
    }),
  ]);

  console.log("✅ Seed completado exitosamente!");
  console.log(`📊 Datos creados:`);
  console.log(`   - ${permissions.length} permisos`);
  console.log(`   - 2 usuarios (admin@holding.com, usuario@holding.com)`);
  console.log(`   - 3 tipos de inversión`);
  console.log(`   - 3 grupos de inversión`);
  console.log(`   - ${holdings.length} holdings`);
  console.log(`\n🔑 Credenciales de prueba:`);
  console.log(`   Email: usuario@holding.com`);
  console.log(`   Password: password123`);
}

main()
  .catch((e) => {
    console.error("❌ Error durante el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
