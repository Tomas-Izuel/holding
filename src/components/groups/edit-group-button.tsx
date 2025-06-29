"use client";

import dynamic from "next/dynamic";
import { TypeInvestment, Group, Holding } from "@prisma/client";

// Importación dinámica para optimizar el rendimiento
const EditGroupForm = dynamic(
  () =>
    import("@/components/groups/edit-group-form").then((mod) => ({
      default: mod.EditGroupForm,
    })),
  {
    loading: () => (
      <div className="flex items-center justify-center p-4">
        Cargando formulario...
      </div>
    ),
    ssr: false,
  }
);

interface EditGroupButtonProps {
  group: Group & {
    type: TypeInvestment;
    holdings: Holding[];
  };
  typeInvestments: TypeInvestment[];
}

export function EditGroupButton({
  group,
  typeInvestments,
}: EditGroupButtonProps) {
  return <EditGroupForm group={group} typeInvestments={typeInvestments} />;
}
