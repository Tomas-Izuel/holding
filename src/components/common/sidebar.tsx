"use client";

import type React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LogOut, User } from "lucide-react";
import { Button } from "../ui/button";
import { logout } from "@/server/services/auth.service";
import Image from "next/image";

interface SidebarProps {
  items: {
    title: string;
    href: string;
    icon?: React.ReactNode;
  }[];
  user: {
    name: string;
    email: string;
  };
}

export function Sidebar({ items, user }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex flex-col w-64 border-r bg-background h-screen">
      <div className="p-6 mt-5">
        <Image
          src="/HoldIn-colorized.svg"
          alt="Holding logo"
          width={120}
          height={120}
        />
      </div>
      <div className="flex-1 px-3 py-2">
        <nav className="space-y-1">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm rounded-xl transition-colors",
                pathname === item.href
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              {item.icon}
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
      <div className="p-2 border-t">
        <div className="flex items-center gap-2 px-1 py-2 text-sm text-muted-foreground">
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
            <User className="h-5 w-5" />
          </div>
          <div>
            <p className="font-medium text-foreground">{user.name}</p>
            <p className="text-xs">{user.email}</p>
          </div>
          <Button variant="outline" onClick={logout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
