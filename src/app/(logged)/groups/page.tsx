import { getGroups } from "@/server/services/group.service";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const groups = await getGroups();
  return (
    <>
      <h1>Grupos</h1>
      <p className="text-muted-foreground">
        Recuerda que todos los domingos a la 02:00 AM se obtendrán las
        cotizaciones semanales de tus holdings.
      </p>
      <section className="flex flex-wrap gap-4 pt-10">
        {groups.length > 0 ? (
          groups.map((group) => (
            <Link
              key={group.id}
              href={`/dashboard/groups/${group.id}`}
              className="text-center text-muted-foreground border border-border rounded-lg h-32 w-64 flex items-center justify-center hover:bg-accent/50 transition-colors cursor-pointer"
            >
              {group.name}
            </Link>
          ))
        ) : (
          <div className="text-center text-muted-foreground border border-border rounded-lg h-32 w-64 flex items-center justify-center text-sm px-5">
            Parece que no tienes grupos, puedes crear un nuevo grupo para
            empezar.
          </div>
        )}
        <Link
          className="text-center text-muted-foreground border border-dashed border-border rounded-lg h-32 w-64 flex items-center justify-center hover:bg-accent/50 transition-colors cursor-pointer"
          href="/dashboard/groups/create"
        >
          <Plus className="h-5 w-5" />
        </Link>
      </section>
    </>
  );
}
