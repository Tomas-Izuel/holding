"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { GroupDetailsForm } from "@/components/groups/group-details-form";
import { AddHoldingsForm } from "@/components/groups/add-holdings-form";
import { TypeInvestment, Group, Holding } from "@prisma/client";
import { CreateHoldingSchemaType } from "@/types/groups.type";
import { updateGroup } from "@/server/services/group.service";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

interface EditGroupFormProps {
  group: Group & {
    type: TypeInvestment;
    holdings: Holding[];
  };
  typeInvestments: TypeInvestment[];
}

export function EditGroupForm({ group, typeInvestments }: EditGroupFormProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: group.name,
    typeId: group.typeId,
    holdings: group.holdings.map((h) => ({
      name: h.name,
      code: h.code,
    })) as CreateHoldingSchemaType[],
  });

  const handleGroupDetailsSubmit = async (data: {
    name: string;
    typeId: string;
  }) => {
    setIsSubmitting(true);
    try {
      await updateGroup(group.id, {
        name: data.name,
        holdings: formData.holdings,
      });
      setFormData((prev) => ({ ...prev, ...data }));
      toast.success("Grupo actualizado correctamente");
      router.refresh();
    } catch (error) {
      if (error instanceof Error && error.cause === 400) {
        toast.error(error.message);
      } else {
        toast.error("Error al actualizar el grupo");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleHoldingsSubmit = async (holdings: CreateHoldingSchemaType[]) => {
    setIsSubmitting(true);
    try {
      await updateGroup(group.id, { name: formData.name, holdings });
      setFormData((prev) => ({ ...prev, holdings }));
      toast.success("Holdings actualizados correctamente");
      router.refresh();
      setIsOpen(false); // Cerrar el diálogo después de actualizar
    } catch (error) {
      if (error instanceof Error && error.cause === 400) {
        toast.error(error.message);
      } else {
        toast.error("Error al actualizar los holdings");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Pencil className="h-4 w-4" />
          Editar grupo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar grupo</DialogTitle>
          <DialogDescription>
            Modifica los detalles del grupo y sus holdings. Los cambios se
            guardarán automáticamente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <GroupDetailsForm
              onSubmit={handleGroupDetailsSubmit}
              investmentTypes={typeInvestments}
              initialData={{ name: formData.name, typeId: formData.typeId }}
              isEditing={true}
              isSubmitting={isSubmitting}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <AddHoldingsForm
              onSubmit={handleHoldingsSubmit}
              onSkip={() => {}}
              onBack={() => {}}
              initialHoldings={formData.holdings}
              groupTypeId={formData.typeId}
              investmentTypes={typeInvestments}
              isEditing={true}
            />
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
