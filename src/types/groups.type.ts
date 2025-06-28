import { z } from "zod";
import { Group, Holding, TypeInvestment } from "@prisma/client";

export const CreateGroupSchema = z.object({
  name: z.string().min(1, { message: "El nombre del grupo es requerido" }),
  typeId: z.string().min(1, { message: "El tipo de grupo es requerido" }),
});

export type CreateGroupSchemaType = z.infer<typeof CreateGroupSchema>;

export const UpdateGroupSchema = z.object({
  name: z.string().min(1, { message: "El nombre del grupo es requerido" }),
});

export const CreateHoldingSchema = z.object({
  name: z.string().min(1, { message: "El nombre del holding es requerido" }),
  code: z.string().min(1, { message: "El código del holding es requerido" }),
});

export type CreateHoldingSchemaType = z.infer<typeof CreateHoldingSchema>;

export const GroupDTOSchema = CreateGroupSchema.extend({
  holdings: z.array(CreateHoldingSchema).optional(),
});

export type GroupDTOSchemaType = z.infer<typeof GroupDTOSchema>;

export type GetGroupDTO = Group & {
  type: TypeInvestment;
  holdings: Holding[];
};
