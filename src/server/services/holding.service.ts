"use server";

import { authMiddleware } from "@/server/middlewares/auth.middleware";
import prisma from "@/server/lib/prisma";
import { CreateHoldingSchemaType } from "@/types/groups.type";
import { invalidateDashboardCache } from "./dashboard.service";
import { HoldingType, ValidateHoldingResponseType } from "@/types/holding.type";

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
    const validationErrors: string[] = [];

    for (const holding of holdings) {
      try {
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
      } catch (assetError) {
        console.log(`[ASSET ERROR for ${holding.code}]`, assetError);
        validationErrors.push(
          `${holding.code}: ${
            assetError instanceof Error
              ? assetError.message
              : "Error desconocido"
          }`
        );
      }
    }

    // Si hay errores de validación, lanzar error con detalles
    if (validationErrors.length > 0) {
      throw new Error(
        `Algunos assets no pudieron ser validados:\n${validationErrors.join(
          "\n"
        )}`,
        {
          cause: 400,
        }
      );
    }

    // Si no hay holdings válidos, lanzar error
    if (holdingsWithAssets.length === 0) {
      throw new Error(
        "No se pudieron procesar ninguno de los holdings proporcionados",
        {
          cause: 400,
        }
      );
    }

    const createdHoldings = await prisma.holding.createMany({
      data: holdingsWithAssets,
    });

    // Invalidar cache del dashboard después de crear holdings
    await invalidateDashboardCache(user.id);

    return createdHoldings;
  } catch (error) {
    console.log("[CREATE HOLDINGS ERROR]", error);
    throw new Error(
      error instanceof Error ? error.message : "Error al crear los holdings",
      {
        cause: error instanceof Error && error.cause ? error.cause : 500,
      }
    );
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
    return await prisma.$transaction(async (tx) => {
      // Buscar asset existente por código
      let asset = await tx.asset.findFirst({
        where: { code, typeId: typeInvestmentId },
      });

      // Si existe, actualizar el nombre si es diferente y retornar
      if (asset) {
        if (asset.name !== name) {
          asset = await tx.asset.update({
            where: { id: asset.id },
            data: { name },
          });
        }
        return asset;
      }

      // Si no existe, crear uno nuevo temporalmente
      asset = await tx.asset.create({
        data: {
          name,
          code,
          isValid: null, // Se determinará mediante validación
          typeId: typeInvestmentId,
        },
      });

      // Validar el asset mediante la API de Snapshot
      try {
        const response = await fetch(
          process.env.SNAPSHOT_SERVICE_URL + "/validate",
          {
            method: "POST",
            body: JSON.stringify({
              code: code,
              typeInvestmentId,
            }),
            headers: {
              "Content-Type": "application/json",
              Authorization: `${process.env.SNAPSHOT_SERVICE_API_KEY}`,
            },
          }
        );

        const data: ValidateHoldingResponseType = await response.json();

        // Actualizar el asset con el resultado de la validación
        asset = await tx.asset.update({
          where: { id: asset.id },
          data: {
            isValid: data.isValid,
            lastPrice:
              data.isValid && data.holding?.lastPrice
                ? data.holding.lastPrice
                : null,
          },
        });

        // Si el asset no es válido, lanzar error para revertir la transacción
        if (!data.isValid) {
          throw new Error(
            `Asset con código ${code} no es válido según la API de Snapshot`
          );
        }

        return asset;
      } catch (validationError) {
        console.log("[ASSET VALIDATION ERROR]", validationError);
        // La transacción se revertirá automáticamente si hay un error
        throw new Error(
          `Error al validar el asset ${code}: ${
            validationError instanceof Error
              ? validationError.message
              : "Error desconocido"
          }`,
          {
            cause: 400,
          }
        );
      }
    });
  } catch (error) {
    console.log("[GET OR CREATE ASSET ERROR]", error);
    throw new Error("Error al obtener o crear el asset", {
      cause: error instanceof Error && error.cause ? error.cause : 500,
    });
  }
}

export async function getHoldingById(id: string): Promise<HoldingType | null> {
  await authMiddleware();
  try {
    const response = await prisma.holding.findUnique({
      where: { id },
      include: {
        asset: {
          include: {
            type: {
              select: {
                id: true,
                name: true,
                currency: true,
              },
            },
          },
        },
        snapshots: true,
      },
    });
    return response as HoldingType | null;
  } catch (error) {
    console.log("[GET HOLDING BY ID ERROR]", error);
    throw new Error("Error al obtener el holding", {
      cause: error instanceof Error && error.cause ? error.cause : 500,
    });
  }
}
