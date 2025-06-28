import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { AUTH_TOKEN } from "@/types/common";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
};

export async function authMiddleware(): Promise<AuthUser | Error> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_TOKEN)?.value;

    if (!token) {
      throw new Error("No autorizado", {
        cause: 401,
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret"
    ) as AuthUser;

    console.log(decoded);

    return decoded;
  } catch (error) {
    console.error("[AUTH MIDDLEWARE ERROR]", error);
    if (error instanceof Error) {
      return error;
    }
    return new Error("Error de autenticación", {
      cause: 500,
    });
  }
}
