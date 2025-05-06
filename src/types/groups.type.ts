import { z } from "zod";

export const CreateGroupSchema = z.object({
  name: z.string().min(1, { message: "El nombre del grupo es requerido" }),
  type: z.string().min(1, { message: "El tipo de grupo es requerido" }),
});

export type CreateGroupSchemaType = z.infer<typeof CreateGroupSchema>;

export const UpdateGroupSchema = z.object({
  name: z.string().min(1, { message: "El nombre del grupo es requerido" }),
});

export const CreateHoldingSchema = z.object({
  name: z.string().min(1, { message: "El nombre del holding es requerido" }),
  type: z.string().min(1, { message: "El tipo de holding es requerido" }),
});

export type CreateHoldingSchemaType = z.infer<typeof CreateHoldingSchema>;
