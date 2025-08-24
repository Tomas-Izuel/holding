"use server";

import { authMiddleware } from "@/server/middlewares/auth.middleware";
import prisma from "@/server/lib/prisma";
import { CreateHoldingSchemaType } from "@/types/groups.type";
import { invalidateDashboardCache } from "./dashboard.service";
import { ValidateHoldingResponseType } from "@/types/holding.type";

export async function createHoldings(
  holdings: CreateHoldingSchemaType[],
  groupId: string,
  typeInvestmentId: string
) {
  const user = await authMiddleware();

  if (user instanceof Error) {
    throw user;
  }

  try {
    // Procesar cada holding y obtener o crear el asset correspondiente
    const holdingsWithAssets = [];

    for (const holding of holdings) {
      const asset = await getOrCreateAsset(
        holding.name,
        holding.code,
        typeInvestmentId
      );
      holdingsWithAssets.push({
        assetId: asset.id,
        groupId,
        quantity: holding.quantity,
      });
    }

    const createdHoldings = await prisma.holding.createMany({
      data: holdingsWithAssets,
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
  typeInvestmentId: string
) {
  await authMiddleware();

  try {
    // Primero verificar si ya existe un asset validado con este código
    const existingAsset = await prisma.asset.findFirst({
      where: {
        code: holding.code,
        isValid: true,
      },
    });

    // Si existe un asset válido, retornar true
    if (existingAsset) {
      return true;
    }

    // Si no existe o no está validado, hacer la validación externa
    const response = await fetch(
      process.env.SNAPSHOT_SERVICE_URL + "/validate",
      {
        method: "POST",
        body: JSON.stringify({
          code: holding.code,
          typeInvestmentId,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `${process.env.SNAPSHOT_SERVICE_API_KEY}`,
        },
      }
    );

    const data: ValidateHoldingResponseType = await response.json();

    // Buscar o crear el asset y actualizar su estado de validación
    const asset = await getOrCreateAsset(
      holding.name,
      holding.code,
      typeInvestmentId
    );
    await prisma.asset.update({
      where: { id: asset.id },
      data: {
        isValid: data.isValid,
        lastPrice:
          data.isValid && data.holding?.lastPrice
            ? data.holding.lastPrice
            : asset.lastPrice,
      },
    });

    return data.isValid;
  } catch (error) {
    console.log("[VALIDATE HOLDING ERROR]", error);
    throw new Error("Error al validar el holding", {
      cause: 500,
    });
  }
}

export async function getOrCreateAsset(
  name: string,
  code: string,
  typeInvestmentId: string
) {
  try {
    // Buscar asset existente por código
    let asset = await prisma.asset.findFirst({
      where: { code },
    });

    // Si existe, actualizar el nombre si es diferente y retornar
    if (asset) {
      if (asset.name !== name) {
        asset = await prisma.asset.update({
          where: { id: asset.id },
          data: { name },
        });
      }
      return asset;
    }

    // Si no existe, crear uno nuevo
    asset = await prisma.asset.create({
      data: {
        name,
        code,
        isValid: null, // Se determinará cuando se valide
        typeId: typeInvestmentId,
      },
    });

    return asset;
  } catch (error) {
    console.log("[GET OR CREATE ASSET ERROR]", error);
    throw new Error("Error al obtener o crear el asset", {
      cause: 500,
    });
  }
}
