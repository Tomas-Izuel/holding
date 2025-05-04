"use server";

import {
  LoginResponse,
  LoginSchema,
  LoginSchemaType,
  RegisterSchema,
  RegisterSchemaType,
} from "@/types/auth.type";
import bcrypt from "bcrypt";
import prisma from "@/server/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { AUTH_TOKEN, METADATA_TOKEN } from "@/types/common";
import { redirect } from "next/navigation";

export async function register(
  data: RegisterSchemaType
): Promise<LoginResponse | Error> {
  const cookieStore = await cookies();
  try {
    const validatedFields = RegisterSchema.safeParse(data);
    if (!validatedFields.success) {
      throw new Error("Campos inválidos", {
        cause: 400,
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: validatedFields.data.email },
    });

    if (existingUser) {
      throw new Error("El usuario ya existe", {
        cause: 400,
      });
    }
    const typeUser = await prisma.typeUser.findUnique({
      where: { name: "FREE" },
    });

    const user = await prisma.user.create({
      data: {
        name: validatedFields.data.name,
        email: validatedFields.data.email,
        password: bcrypt.hashSync(validatedFields.data.password, 10),
        type: { connect: { id: typeUser?.id } },
      },
      select: {
        name: true,
        email: true,
        id: true,
      },
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET || "secret"
    );

    cookieStore.set(AUTH_TOKEN, token, {
      httpOnly: true,
      secure: true,
    });

    return {
      token,
      metadata: { id: user.id, email: user.email, name: user.name },
    };
  } catch (error) {
    console.log("[REGISTER ERROR]", error);
    throw new Error("Error al registrar el usuario", {
      cause: 500,
    });
  }
}

export async function login(
  data: LoginSchemaType
): Promise<LoginResponse | Error> {
  const cookieStore = await cookies();
  try {
    const validatedFields = LoginSchema.safeParse(data);
    if (!validatedFields.success) {
      throw new Error("Campos inválidos", {
        cause: 400,
      });
    }

    const user = await prisma.user.findUnique({
      where: { email: validatedFields.data.email },
    });

    if (!user) {
      throw new Error("Usuario no encontrado", {
        cause: 400,
      });
    }

    const isPasswordValid = await bcrypt.compare(
      validatedFields.data.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new Error("Contraseña incorrecta", {
        cause: 400,
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET || "secret"
    );

    cookieStore.set(AUTH_TOKEN, token, {
      httpOnly: true,
      secure: true,
    });

    cookieStore.set(
      METADATA_TOKEN,
      JSON.stringify({
        id: user.id,
        email: user.email,
        name: user.name,
      }),
      {
        httpOnly: true,
      }
    );

    return {
      token,
      metadata: { id: user.id, email: user.email, name: user.name },
    };
  } catch (error) {
    console.log("[LOGIN ERROR]", error);
    throw new Error("Error al iniciar sesión", {
      cause: 500,
    });
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_TOKEN);
  cookieStore.delete(METADATA_TOKEN);
  redirect("/login");
}
