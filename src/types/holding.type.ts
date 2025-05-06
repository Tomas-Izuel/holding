import { z } from "zod";

export const CreateHoldingSchema = z.object({
  name: z.string().min(1, { message: "El nombre de la holding es requerido" }),
  code: z.string().min(1, { message: "El codigo de la holding es requerido" }),
  groupId: z.string().min(1, { message: "El id del grupo es requerido" }),
});

export type CreateHoldingSchemaType = z.infer<typeof CreateHoldingSchema>;

export const UpdateHoldingSchema = z.object({
  name: z.string().min(1, { message: "El nombre de la holding es requerido" }),
});
