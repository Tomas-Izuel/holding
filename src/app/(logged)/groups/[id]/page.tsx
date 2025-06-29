import { EditGroupButton } from "@/components/groups/edit-group-button";
import GroupHoldingsView from "@/components/groups/group-holdings-view";
import {
  getGroupById,
  getTypesInvestment,
} from "@/server/services/group.service";
import { notFound } from "next/navigation";

export default async function EditGroupPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  try {
    const [group, typeInvestments] = await Promise.all([
      getGroupById(id),
      getTypesInvestment(),
    ]);

    return (
      <>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Detalles del grupo</h1>
            <p className="text-muted-foreground mt-2">
              Tipo de inversión: {group.type.name}
            </p>
            <p className="text-muted-foreground mt-2">
              Moneda: {group.type.currency}
            </p>
            <p className="text-muted-foreground mt-2">
              Fecha de creación: {group.createdAt.toLocaleDateString()}
            </p>
          </div>
          <EditGroupButton group={group} typeInvestments={typeInvestments} />
        </div>

        <GroupHoldingsView holdings={group.holdings} />
      </>
    );
  } catch (error) {
    if (error instanceof Error && error.cause === 404) {
      notFound();
    }
    throw error;
  }
}
