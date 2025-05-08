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
