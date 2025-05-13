"use client";

import { useState } from "react";
import { CheckCircle2, ArrowRight, Plus, ListPlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Holding } from "@prisma/client";

interface FormSuccessProps {
  onFinish: () => void;
  onCreateMore: () => void;
  onAddMoreHoldings: () => void;
  groupData: {
    name: string;
    typeId: string;
    holdings: Holding[];
  };
  isSubmitting: boolean;
  onSubmit: () => Promise<void>;
}

// Variantes de animación
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function FormSuccess({
  onFinish,
  onCreateMore,
  onAddMoreHoldings,
  groupData,
  isSubmitting,
  onSubmit,
}: FormSuccessProps) {
  const [isCreated, setIsCreated] = useState(false);

  const handleSubmit = async () => {
    await onSubmit();
    setIsCreated(true);
  };

  return (
    <AnimatePresence mode="wait">
      {!isCreated ? (
        <motion.div
          className="space-y-6"
          key="summary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="text-center"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-bold">Resumen del grupo</h2>
            <p className="text-muted-foreground mt-2">
              Revisa la información antes de crear el grupo
            </p>
          </motion.div>

          <motion.div
            className="space-y-4 mt-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="border rounded-md p-4"
              variants={itemVariants}
              transition={{ duration: 0.3 }}
            >
              <h3 className="font-medium">Detalles del grupo</h3>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nombre:</span>
                  <span className="font-medium">{groupData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Tipo de inversión:
                  </span>
                  <span className="font-medium">{groupData.typeId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Holdings:</span>
                  <span className="font-medium">
                    {groupData.holdings.length}
                  </span>
                </div>
              </div>
            </motion.div>

            {groupData.holdings.length > 0 && (
              <motion.div
                className="border rounded-md p-4"
                variants={itemVariants}
                transition={{ duration: 0.3 }}
              >
                <h3 className="font-medium">Holdings</h3>
                <div className="mt-2 space-y-2">
                  {groupData.holdings.map((holding, index) => (
                    <motion.div
                      key={holding.id}
                      className="flex justify-between"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.05, duration: 0.2 }}
                    >
                      <span className="text-muted-foreground">
                        {holding.name}
                      </span>
                      <span className="font-medium">{holding.code}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>

          <motion.div
            className="flex justify-between pt-4"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" onClick={onAddMoreHoldings}>
                {groupData.holdings.length > 0
                  ? "Editar holdings"
                  : "Agregar holdings"}
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="relative"
              >
                {isSubmitting && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center bg-primary rounded-md"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <svg
                      className="animate-spin h-5 w-5 text-primary-foreground"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </motion.div>
                )}
                <span className={isSubmitting ? "opacity-0" : "opacity-100"}>
                  Crear grupo
                </span>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          className="space-y-6 text-center"
          key="success"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="flex justify-center"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <div className="rounded-full bg-primary/10 p-3">
              <CheckCircle2 className="h-12 w-12 text-primary" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold">¡Grupo creado con éxito!</h2>
            <p className="text-muted-foreground mt-2">
              Tu grupo {groupData.name} ha sido creado correctamente
              {groupData.holdings.length > 0
                ? ` con ${groupData.holdings.length} holdings.`
                : "."}
            </p>
          </motion.div>

          <motion.div
            className="pt-6 space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button onClick={onFinish} className="w-full">
                Ver todos los grupos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                onClick={onCreateMore}
                variant="outline"
                className="w-full"
              >
                Crear otro grupo
                <Plus className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
            {groupData.holdings.length === 0 && (
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button
                  onClick={onAddMoreHoldings}
                  variant="outline"
                  className="w-full"
                >
                  Agregar holdings a este grupo
                  <ListPlus className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
