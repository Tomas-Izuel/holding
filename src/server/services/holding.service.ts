"use server";

import { authMiddleware } from "@/server/middlewares/auth.middleware";
import prisma from "@/server/lib/prisma";
import redisClient from "@/server/lib/redis";
import { CreateHoldingSchemaType } from "@/types/groups.type";
import { invalidateDashboardCache } from "./dashboard.service";

export async function createHoldings(
  holdings: CreateHoldingSchemaType[],
  groupId: string
) {
  const user = await authMiddleware();

  if (user instanceof Error) {
    throw user;
  }

  try {
    const createdHoldings = await prisma.holding.createMany({
      data: holdings.map((holding) => ({ ...holding, groupId })),
    });

    // Invalidar cache del dashboard después de crear holdings
    await invalidateDashboardCache(user.id);

    return createdHoldings;
  } catch (error) {
    console.log("[CREATE HOLDINGS ERROR]", error);
    throw new Error("Error al crear los holdings", {
      cause: 500,
    });
  }
}

export async function validateHolding(
  holding: CreateHoldingSchemaType,
  groupId: string
) {
  const group = await prisma.group.findUnique({
    where: {
      id: groupId,
    },
    include: {
      type: true,
    },
  });

  if (!group) {
    throw new Error("Grupo no encontrado", {
      cause: 404,
    });
  }

  try {
    // Crear una clave única para el cache basada en el tipo de investment y el código del holding
    const cacheKey = `holding_validation:${group.type.name}:${holding.code}`;

    // Verificar si ya existe una validación cacheada
    const cachedValidation = await redisClient.get(cacheKey);

    if (cachedValidation) {
      console.log(
        `[CACHE HIT] Validación cacheada encontrada para ${holding.code} en ${group.type.name}`
      );
      return JSON.parse(cachedValidation);
    }

    // Simular el tiempo de respuesta del scraper
    await new Promise((resolve) => setTimeout(resolve, 1500));

    //const isValid = send holding to scrapper
    const validationResult = true;

    // Cachear la validación por 1 mes (30 días en segundos)
    const oneMonthInSeconds = 30 * 24 * 60 * 60;
    await redisClient.setEx(
      cacheKey,
      oneMonthInSeconds,
      JSON.stringify(validationResult)
    );

    console.log(
      `[CACHE SET] Validación cacheada para ${holding.code} en ${group.type.name} por 1 mes`
    );

    return validationResult;
  } catch (error) {
    console.log("[VALIDATE HOLDING ERROR]", error);
    throw new Error("Error al validar el holding", {
      cause: 500,
    });
  }
}
