"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PlusCircle, X, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { Holding, TypeInvestment } from "@/types";

const holdingSchema = z.object({
  name: z.string().min(1, { message: "El nombre es requerido" }),
  code: z.string().min(1, { message: "El código es requerido" }),
});

interface AddHoldingsFormProps {
  onSubmit: (holdings: Holding[]) => void;
  onSkip: () => void;
  onBack: () => void;
  initialHoldings: Holding[];
  groupTypeId: string;
  investmentTypes: TypeInvestment[];
}

// Variantes de animación para los elementos de la lista
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, x: -100 },
};

export function AddHoldingsForm({
  onSubmit,
  onSkip,
  onBack,
  initialHoldings = [],
  groupTypeId,
  investmentTypes,
}: AddHoldingsFormProps) {
  const [holdings, setHoldings] = useState<Holding[]>(initialHoldings);
  const selectedType = investmentTypes.find((type) => type.id === groupTypeId);

  const form = useForm<z.infer<typeof holdingSchema>>({
    resolver: zodResolver(holdingSchema),
    defaultValues: {
      name: "",
      code: "",
    },
  });

  const addHolding = (data: z.infer<typeof holdingSchema>) => {
    const newHolding: Holding = {
      id: `temp-${Date.now()}`, // ID temporal, el servidor asignará uno real
      name: data.name,
      code: data.code,
    };

    setHoldings([...holdings, newHolding]);
    form.reset();
  };

  const removeHolding = (id: string) => {
    setHoldings(holdings.filter((holding) => holding.id !== id));
  };

  const handleSubmit = () => {
    onSubmit(holdings);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-lg font-medium">Agregar holdings (opcional)</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Agrega los activos que formarán parte de este grupo de inversión.
        </p>
      </motion.div>

      {selectedType && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Información</AlertTitle>
            <AlertDescription>
              Estás agregando holdings para un grupo de tipo{" "}
              <strong>{selectedType.name}</strong> en{" "}
              <strong>{selectedType.currency}</strong>.
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(addHolding)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del holding</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Apple Inc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código del holding</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: AAPL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                variant="outline"
                size="sm"
                className="mt-2"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Agregar holding
              </Button>
            </motion.div>
          </form>
        </Form>
      </motion.div>

      {holdings.length > 0 && (
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <h3 className="text-sm font-medium">
            Holdings agregados ({holdings.length})
          </h3>
          <div className="border rounded-md divide-y">
            <AnimatePresence>
              {holdings.map((holding) => (
                <motion.div
                  key={holding.id}
                  className="flex items-center justify-between p-3"
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.2 }}
                  layout
                >
                  <div>
                    <p className="font-medium">{holding.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {holding.code}
                    </p>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeHolding(holding.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      <motion.div
        className="flex justify-between pt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button variant="outline" onClick={onBack}>
            Atrás
          </Button>
        </motion.div>
        <div className="space-x-2">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ display: "inline-block" }}
          >
            <Button variant="ghost" onClick={onSkip}>
              Omitir
            </Button>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ display: "inline-block" }}
          >
            <Button onClick={handleSubmit} disabled={holdings.length === 0}>
              Continuar
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
