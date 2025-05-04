import { z } from "zod";

export const RegisterSchema = z.object({
  name: z
    .string({
      message: "El nombre es requerido",
    })
    .min(1),
  email: z
    .string({
      message: "El email es requerido",
    })
    .email({
      message: "El email no es valido",
    }),
  password: z
    .string({
      message: "La contraseña es requerida",
    })
    .min(8, {
      message: "La contraseña debe tener al menos 8 caracteres",
    }),
});

export type RegisterSchemaType = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
  email: z
    .string({
      message: "El email es requerido",
    })
    .email({ message: "El email no es valido" }),
  password: z
    .string({
      message: "La contraseña es requerida",
    })
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres" }),
});

export type LoginSchemaType = z.infer<typeof LoginSchema>;
export type LoginResponse = {
  token: string;
  metadata: {
    id: string;
    email: string;
    name: string;
  };
};
