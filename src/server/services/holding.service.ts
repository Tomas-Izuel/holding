"use server";

import { authMiddleware } from "@/server/middlewares/auth.middleware";
import prisma from "@/server/lib/prisma";
import { CreateHoldingSchemaType } from "@/types/groups.type";
import { invalidateDashboardCache } from "./dashboard.service";
import { ValidateHoldingResponseType } from "@/types/holding.type";

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
  typeInvestmentId: string,
  groupName: string
) {
  await authMiddleware();
  console.log({
    name: holding.name,
    code: holding.code,
    typeInvestmentId,
    groupName,
  });
  try {
    const response = await fetch(
      process.env.SNAPSHOT_SERVICE_URL + "/validate",
      {
        method: "POST",
        body: JSON.stringify({
          name: holding.name,
          code: holding.code,
          typeInvestmentId,
          groupName,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `${process.env.SNAPSHOT_SERVICE_API_KEY}`,
        },
      }
    );

    const data: ValidateHoldingResponseType = await response.json();

    return data.isValid;
  } catch (error) {
    console.log("[VALIDATE HOLDING ERROR]", error);
    throw new Error("Error al validar el holding", {
      cause: 500,
    });
  }
}
