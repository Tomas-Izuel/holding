"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TypeInvestment } from "@prisma/client";
import { CreateGroupSchema, CreateGroupSchemaType } from "@/types/groups.type";

interface GroupDetailsFormProps {
  onSubmit: (data: CreateGroupSchemaType) => void;
  investmentTypes: TypeInvestment[];
  initialData?: {
    name: string;
    typeId: string;
  };
  isEditing?: boolean;
  isSubmitting?: boolean;
}

export function GroupDetailsForm({
  onSubmit,
  investmentTypes,
  initialData = { name: "", typeId: "" },
  isEditing = false,
  isSubmitting = false,
}: GroupDetailsFormProps) {
  const form = useForm<CreateGroupSchemaType>({
    resolver: zodResolver(CreateGroupSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, staggerChildren: 0.1 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del grupo</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Mi portafolio de inversiones"
                      {...field}
                      disabled={!isEditing || isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>
                    Elige un nombre descriptivo para tu grupo de inversiones.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <FormField
              control={form.control}
              name="typeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de inversión</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={!isEditing || isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un tipo de inversión" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {investmentTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name} ({type.currency})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    El tipo de inversión determina la moneda y la fuente de
                    datos.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>
        </motion.div>

        {isEditing && (
          <motion.div
            className="flex justify-end"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Guardando..." : "Guardar cambios"}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </form>
    </Form>
  );
}
