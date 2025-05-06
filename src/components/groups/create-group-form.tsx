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
      // Aquí iría la lógica para enviar los datos al servidor
      console.log("Datos del formulario:", formData);

      // Simulamos una petición al servidor
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Si todo va bien, mantenemos el paso 3 (éxito)
    } catch (error) {
      console.error("Error al crear el grupo:", error);
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
