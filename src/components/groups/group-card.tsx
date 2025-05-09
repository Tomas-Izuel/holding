"use client";
import { Group } from "@prisma/client";
import Link from "next/link";
import React from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteGroup } from "@/server/services/group.service";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface GroupCardProps {
  group: Group;
}

const GroupCard = ({ group }: GroupCardProps) => {
  const router = useRouter();

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await deleteGroup(group.id);
      toast.success("Grupo eliminado correctamente");
      router.refresh();
    } catch (error) {
      console.log("[DELETE GROUP ERROR]", error);
      toast.error("Error al eliminar el grupo");
    }
  };

  return (
    <Link
      key={group.id}
      href={`/groups/${group.id}`}
      className="relative text-center text-muted-foreground border border-border rounded-lg h-32 w-64 flex items-center justify-center hover:bg-accent/50 transition-colors cursor-pointer group"
    >
      {group.name}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground"
        onClick={handleDelete}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </Link>
  );
};

export default GroupCard;
