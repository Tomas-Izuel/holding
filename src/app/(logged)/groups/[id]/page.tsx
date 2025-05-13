import { EditGroupForm } from "@/components/groups/edit-group-form";
import {
  getGroupById,
  getTypesInvestment,
} from "@/server/services/group.service";
import { notFound } from "next/navigation";
import React from "react";

interface EditGroupPageProps {
  params: {
    id: string;
  };
}

export default async function EditGroupPage({ params }: EditGroupPageProps) {
  try {
    const [group, typeInvestments] = await Promise.all([
      getGroupById(params.id),
      getTypesInvestment(),
    ]);

    return (
      <>
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Detalles del grupo</h1>
          <p className="text-muted-foreground mt-2">
            Visualiza y edita los detalles de tu grupo de inversiones.
          </p>
        </div>
        <EditGroupForm group={group} typeInvestments={typeInvestments} />
      </>
    );
  } catch (error) {
    if (error instanceof Error && error.cause === 404) {
      notFound();
    }
    throw error;
  }
}
