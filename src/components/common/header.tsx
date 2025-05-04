"use client";

import type React from "react";

import { useIsMobile } from "@/hooks/use-mobile";
import { MobileNav } from "@/components/common/mobile-nav";
import { Button } from "@/components/ui/button";
import { Bell, User } from "lucide-react";

interface HeaderProps {
  navItems: {
    title: string;
    href: string;
    icon?: React.ReactNode;
  }[];
}

export function Header({ navItems }: HeaderProps) {
  const isMobile = useIsMobile();

  return (
    isMobile && (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <MobileNav items={navItems} />
          <div className="flex-1"></div>

          <div className="flex items-center gap-2 ml-auto">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
              <span className="sr-only">Profile</span>
            </Button>
          </div>
        </div>
      </header>
    )
  );
}
