"use server";

import { Holding } from "@prisma/client";
import { authMiddleware } from "../middlewares/auth.middleware";
import prisma from "@/server/lib/prisma";
import { ProfileResume } from "@/types/dashboard.types";
import { cacheManager, dashboardCache } from "@/server/utils/cache.utils";

export const getBestHoldingsDashboard = async (): Promise<
  Holding[] | Error
> => {
  const user = await authMiddleware();

  if (user instanceof Error) {
    throw user;
  }

  try {
    const cacheKey = dashboardCache.keys.bestHoldings(user.id);

    return await cacheManager.getOrSet(
      cacheKey,
      dashboardCache.ttl.bestHoldings,
      async () => {
        return await prisma.holding.findMany({
          where: {
            group: {
              userId: user.id,
            },
          },
          orderBy: {
            earnings: "desc",
          },
          take: 10,
          include: {
            group: {
              include: {
                type: true,
              },
            },
          },
        });
      }
    );
  } catch (error) {
    console.log("[GET BEST HOLDINGS DASHBOARD ERROR]", error);
    throw new Error("Error al obtener los mejores holdings", {
      cause: 500,
    });
  }
};

export const getTotalEarningsDashboard = async (): Promise<
  ProfileResume | Error
> => {
  const user = await authMiddleware();

  if (user instanceof Error) {
    throw user;
  }

  try {
    const cacheKey = dashboardCache.keys.totalEarnings(user.id);

    return await cacheManager.getOrSet(
      cacheKey,
      dashboardCache.ttl.totalEarnings,
      async () => {
        const totalEarnings = await prisma.holding.aggregate({
          where: {
            group: {
              userId: user.id,
            },
          },
          _sum: {
            earnings: true,
          },
        });

        const totalHoldings = await prisma.holding.count({
          where: {
            group: {
              userId: user.id,
            },
          },
        });

        const totalGroups = await prisma.group.count({
          where: {
            userId: user.id,
          },
        });

        return {
          totalEarnings: totalEarnings._sum.earnings ?? 0,
          totalHoldings: totalHoldings,
          totalGroups: totalGroups,
        };
      }
    );
  } catch (error) {
    console.log("[GET TOTAL EARNINGS DASHBOARD ERROR]", error);
    throw new Error("Error al obtener los ingresos totales", {
      cause: 500,
    });
  }
};

// Función para invalidar el cache del dashboard
export const invalidateDashboardCache = async (
  userId: string
): Promise<void> => {
  await dashboardCache.invalidate(userId);
};

// Función para limpiar todo el cache del dashboard (útil para mantenimiento)
export const clearAllDashboardCache = async (): Promise<void> => {
  await dashboardCache.clearAll();
};

// Función para verificar el estado del cache
export const getCacheStatus = async (): Promise<{
  isConnected: boolean;
  dashboardKeys: string[];
}> => {
  const isConnected = await cacheManager.isConnected();
  const dashboardKeys = await cacheManager.keys("dashboard:*");

  return {
    isConnected,
    dashboardKeys,
  };
};
