"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="mb-8">
      <div className="relative flex items-center justify-between">
        {/* Línea de fondo continua */}
        <div className="absolute left-0 top-4 h-1 w-full -translate-y-1/2 bg-muted-foreground/25" />

        {/* Línea de progreso animada */}
        <motion.div
          className="absolute left-0 top-4 h-1 w-full origin-left -translate-y-1/2 bg-primary"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: (currentStep - 1) / (totalSteps - 1) }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />

        {/* Círculos de pasos */}
        {Array.from({ length: totalSteps }).map((_, index) => (
          <motion.div
            key={index}
            className="relative z-10"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
          >
            <motion.div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full border text-xs font-medium",
                currentStep > index + 1
                  ? "border-primary bg-primary text-primary-foreground"
                  : currentStep === index + 1
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-muted-foreground/25 bg-muted-foreground/60 text-muted-foreground"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {index + 1}
            </motion.div>
          </motion.div>
        ))}
      </div>

      <div className="mt-2 flex justify-between text-xs">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <motion.div
            key={index}
            className={cn(
              "font-medium",
              currentStep >= index + 1
                ? "text-primary"
                : "text-muted-foreground"
            )}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
          >
            {index === 0 && "Detalles del grupo"}
            {index === 1 && "Agregar holdings (opcional)"}
            {index === 2 && "Finalizar"}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
