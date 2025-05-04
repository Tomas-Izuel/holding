"use server";

import { authMiddleware } from "@/server/middlewares/auth.middleware";
import prisma from "@/server/lib/prisma";

export async function getGroups() {
  const user = await authMiddleware();

  if (user instanceof Error) {
    throw user;
  }

  try {
    const groups = await prisma.group.findMany({
      where: {
        userId: user.id,
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

export async function createGroup(name: string) {
  const user = await authMiddleware();

  if (user instanceof Error) {
    throw user;
  }

  try {
    const group = await prisma.group.create({
      data: {
        name,
        user: { connect: { id: user.id } },
        type: { connect: { id: "1" } },
      },
    });

    return group;
  } catch (error) {
    console.log("[CREATE GROUP ERROR]", error);
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
    await prisma.group.delete({
      where: {
        id,
        userId: user.id,
      },
    });

    return { message: "Grupo eliminado correctamente" };
  } catch (error) {
    console.log("[DELETE GROUP ERROR]", error);
    throw new Error("Error al eliminar el grupo", {
      cause: 500,
    });
  }
}

export async function updateGroup(id: string, name: string) {
  const user = await authMiddleware();

  if (user instanceof Error) {
    throw user;
  }

  try {
    const group = await prisma.group.update({
      where: {
        id,
        userId: user.id,
      },
      data: {
        name,
      },
    });

    return group;
  } catch (error) {
    console.log("[UPDATE GROUP ERROR]", error);
    throw new Error("Error al actualizar el grupo", {
      cause: 500,
    });
  }
}
