"use server";

import { authMiddleware } from "@/server/middlewares/auth.middleware";
import prisma from "@/server/lib/prisma";
import {
  GroupDTOSchemaType,
  CreateHoldingSchemaType,
  GetGroupDTO,
} from "@/types/groups.type";
import { createHoldings } from "./holding.service";
import { invalidateDashboardCache } from "./dashboard.service";

export async function getGroups(): Promise<GetGroupDTO[]> {
  const user = await authMiddleware();

  if (user instanceof Error) {
    throw user;
  }

  try {
    const groups = await prisma.group.findMany({
      where: {
        userId: user.id,
      },
      include: {
        type: true,
        holdings: true,
      },
    });

    return groups;
  } catch (error) {
    console.log("[GET GROUPS ERROR]", error);
    throw new Error("Error al obtener los grupos", {
      cause: 500,
    });
  }
}

export async function createGroup(data: GroupDTOSchemaType) {
  const user = await authMiddleware();

  if (user instanceof Error) {
    throw user;
  }

  try {
    const existingGroup = await prisma.group.findFirst({
      where: {
        name: data.name,
        userId: user.id,
      },
    });

    if (existingGroup) {
      throw new Error("Ya existe un grupo con este nombre", {
        cause: 400,
      });
    }

    const group = await prisma.group.create({
      data: {
        name: data.name,
        user: { connect: { id: user.id } },
        type: { connect: { id: data.typeId } },
      },
    });

    if (data.holdings) {
      await createHoldings(data.holdings, group.id);
    }

    // Invalidar cache del dashboard después de crear grupo
    await invalidateDashboardCache(user.id);

    return {
      ...group,
      holdings: data.holdings,
    };
  } catch (error) {
    console.log("[CREATE GROUP ERROR]", error);
    if (error instanceof Error && error.cause === 400) {
      throw error;
    }
    throw new Error("Error al crear el grupo", {
      cause: 500,
    });
  }
}

export async function deleteGroup(id: string) {
  const user = await authMiddleware();

  if (user instanceof Error) {
    throw user;
  }

  try {
    const group = await prisma.group.findUnique({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!group) {
      throw new Error("Grupo no encontrado", {
        cause: 404,
      });
    }

    // Delete all holdings in the group
    await prisma.holding.deleteMany({
      where: {
        groupId: group.id,
      },
    });

    await prisma.group.delete({
      where: {
        id,
        userId: user.id,
      },
    });

    // Invalidar cache del dashboard después de eliminar grupo
    await invalidateDashboardCache(user.id);

    return { message: "Grupo eliminado correctamente" };
  } catch (error) {
    console.log("[DELETE GROUP ERROR]", error);
    throw new Error("Error al eliminar el grupo", {
      cause: 500,
    });
  }
}

export async function updateGroup(
  id: string,
  data: { name: string; holdings?: CreateHoldingSchemaType[] }
) {
  const user = await authMiddleware();

  if (user instanceof Error) {
    throw user;
  }

  console.log(data);

  try {
    const group = await prisma.group.update({
      where: {
        id,
        userId: user.id,
      },
      data: {
        name: data.name,
      },
    });

    if (data.holdings) {
      // Eliminar holdings existentes
      await prisma.holding.deleteMany({
        where: {
          groupId: group.id,
        },
      });

      // Crear nuevos holdings
      await createHoldings(data.holdings, group.id);
    }

    // Invalidar cache del dashboard después de actualizar grupo
    await invalidateDashboardCache(user.id);

    return group;
  } catch (error) {
    console.log("[UPDATE GROUP ERROR]", error);
    throw new Error("Error al actualizar el grupo", {
      cause: 500,
    });
  }
}

export async function getTypesInvestment() {
  const user = await authMiddleware();

  if (user instanceof Error) {
    throw user;
  }

  try {
    const typesInvestment = await prisma.typeInvestment.findMany();

    return typesInvestment;
  } catch (error) {
    console.log("[GET TYPES INVESTMENT ERROR]", error);
    throw new Error("Error al obtener los tipos de inversión", {
      cause: 500,
    });
  }
}

export async function getGroupById(id: string) {
  const user = await authMiddleware();

  if (user instanceof Error) {
    throw user;
  }

  try {
    const group = await prisma.group.findUnique({
      where: {
        id,
        userId: user.id,
      },
      include: {
        type: true,
        holdings: true,
      },
    });

    if (!group) {
      throw new Error("Grupo no encontrado", {
        cause: 404,
      });
    }

    return group;
  } catch (error) {
    console.log("[GET GROUP BY ID ERROR]", error);
    if (error instanceof Error && error.cause === 404) {
      throw error;
    }
    throw new Error("Error al obtener el grupo", {
      cause: 500,
    });
  }
}
