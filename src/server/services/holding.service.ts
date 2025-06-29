"use server";

import { authMiddleware } from "@/server/middlewares/auth.middleware";
import prisma from "@/server/lib/prisma";
import { CreateHoldingSchemaType } from "@/types/groups.type";

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
  const group = await prisma.typeInvestment.findUnique({
    where: {
      id: groupId,
    },
  });

  if (!group) {
    throw new Error("Grupo no encontrado", {
      cause: 404,
    });
  }

  try {
    // Simular el tiempo de respuesta del scraper
    await new Promise((resolve) => setTimeout(resolve, 1500));

    //const isValid = send holding to scrapper
    return false;
  } catch (error) {
    console.log("[VALIDATE HOLDING ERROR]", error);
    throw new Error("Error al validar el holding", {
      cause: 500,
    });
  }
}
