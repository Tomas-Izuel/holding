"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { StepIndicator } from "@/components/groups/step-indicator";
import { GroupDetailsForm } from "@/components/groups/group-details-form";
import { AddHoldingsForm } from "@/components/groups/add-holdings-form";
import { FormSuccess } from "@/components/groups/form-success";
import { TypeInvestment } from "@prisma/client";
import { CreateHoldingSchemaType } from "@/types/groups.type";
import { createGroup } from "@/server/services/group.service";
import { toast } from "sonner";

type FormData = {
  name: string;
  typeId: string;
  holdings: CreateHoldingSchemaType[];
};

// Variantes de animación para los pasos del formulario
const formVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
};

interface CreateGroupFormProps {
  typeInvestments: TypeInvestment[];
}

export function CreateGroupForm({ typeInvestments }: CreateGroupFormProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    typeId: "",
    holdings: [],
  });

  const totalSteps = 3;

  const handleGroupDetailsSubmit = (data: { name: string; typeId: string }) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep(2);
  };

  const handleHoldingsSubmit = (holdings: CreateHoldingSchemaType[]) => {
    setFormData((prev) => ({ ...prev, holdings }));
    setStep(3);
  };

  const handleSkipHoldings = () => {
    setStep(3);
  };

  const handleCreateGroup = async () => {
    setIsSubmitting(true);
    try {
      await createGroup(formData);
      toast.success("Grupo creado correctamente");
      router.push("/groups");
    } catch (error) {
      if (error instanceof Error && error.cause === 400) {
        toast.error(error.message);
      } else {
        toast.error("Error al crear el grupo");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToGroups = () => {
    router.push("/groups");
  };

  const handlePreviousStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6 overflow-hidden">
        <StepIndicator currentStep={step} totalSteps={totalSteps} />

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <GroupDetailsForm
                onSubmit={handleGroupDetailsSubmit}
                investmentTypes={typeInvestments}
                initialData={{ name: formData.name, typeId: formData.typeId }}
                isEditing
              />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <AddHoldingsForm
                onSubmit={handleHoldingsSubmit}
                onSkip={handleSkipHoldings}
                onBack={handlePreviousStep}
                initialHoldings={formData.holdings}
                groupTypeId={formData.typeId}
                investmentTypes={typeInvestments}
                isEditing
                showAllButtons
              />
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <FormSuccess
                onFinish={handleBackToGroups}
                onCreateMore={() => {
                  setFormData({ name: "", typeId: "", holdings: [] });
                  setStep(1);
                }}
                onAddMoreHoldings={() => {
                  setStep(2);
                }}
                groupData={formData}
                isSubmitting={isSubmitting}
                onSubmit={handleCreateGroup}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}
