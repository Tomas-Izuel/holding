import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { AUTH_TOKEN } from "@/types/common";
import prisma from "@/server/lib/prisma";
import { getRedisClient } from "@/server/lib/redis";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
};

const CACHE_TTL = 24 * 60 * 60; // 1 día en segundos

export async function authMiddleware(): Promise<AuthUser | Error> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_TOKEN)?.value;

    if (!token) {
      throw new Error("No autorizado", {
        cause: 401,
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret"
    ) as AuthUser;

    // Intentar obtener del caché
    const cachedUser = await getRedisClient().get(`user:${decoded.id}`);
    if (cachedUser) {
      return JSON.parse(cachedUser) as AuthUser;
    }

    // Si no está en caché, buscar en la base de datos
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (!user) {
      throw new Error("Usuario no encontrado", {
        cause: 404,
      });
    }

    // Almacenar en caché
    await getRedisClient().set(`user:${decoded.id}`, JSON.stringify(user), {
      EX: CACHE_TTL,
    });

    return user;
  } catch (error) {
    console.error("[AUTH MIDDLEWARE ERROR]", error);
    if (error instanceof Error) {
      return error;
    }
    return new Error("Error de autenticación", {
      cause: 500,
    });
  }
}
