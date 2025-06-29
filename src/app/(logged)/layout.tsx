import { Header } from "@/components/common/header";
import { Sidebar } from "@/components/common/sidebar";
import { getMetadata } from "@/server/utils/common";
import { Group, Home } from "lucide-react";
import { redirect } from "next/navigation";

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <Home className="h-5 w-5" />,
    disabled: false,
  },
  {
    title: "Groups",
    href: "/groups",
    icon: <Group className="h-5 w-5" />,
    disabled: false,
  },
];

export default async function LoggedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const metadata = await getMetadata();
  if (!metadata) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen bg-black">
      <Sidebar
        items={navItems}
        user={{
          name: metadata.name,
          email: metadata.email,
        }}
      />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header navItems={navItems} />
        <main className="flex-1 overflow-y-auto p-6 lg:p-14 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
