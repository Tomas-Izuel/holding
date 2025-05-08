import { CreateGroupForm } from "@/components/groups/create-group-form";
import { getTypesInvestment } from "@/server/services/group.service";
import React from "react";

export default async function CreateGroupPage() {
  const typeInvestments = await getTypesInvestment();
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Crear nuevo grupo</h1>
        <p className="text-muted-foreground mt-2">
          Crea un nuevo grupo de inversiones y opcionalmente agrega holdings.
        </p>
      </div>
      <CreateGroupForm typeInvestments={typeInvestments} />
    </>
  );
}
