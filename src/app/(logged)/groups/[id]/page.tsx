import { EditGroupForm } from "@/components/groups/edit-group-form";
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Detalles del grupo</h1>
          <p className="text-muted-foreground mt-2">
            Visualiza y edita los detalles de tu grupo de inversiones.
          </p>
        </div>
        <EditGroupForm group={group} typeInvestments={typeInvestments} />

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
