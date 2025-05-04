import { PrismaClient } from "@prisma/client";

// Declaramos una variable global para el cliente de Prisma
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Creamos una función para obtener o crear el cliente de Prisma
export function getPrismaClient(): PrismaClient {
  // En desarrollo, usamos la variable global para evitar múltiples instancias durante hot-reloading
  if (process.env.NODE_ENV === "development") {
    if (!global.prisma) {
      global.prisma = new PrismaClient();
    }
    return global.prisma;
  }

  // En producción, creamos una nueva instancia si no existe
  const prisma = global.prisma || new PrismaClient();

  return prisma;
}

// Exportamos una instancia única de Prisma Client
const prisma = getPrismaClient();
export default prisma;
