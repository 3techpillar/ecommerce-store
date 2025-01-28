import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import SidebarWrapper from "@/components/navbar-wrapper";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <SidebarWrapper />
      <SidebarTrigger />
      <main className="w-full">{children}</main>
    </SidebarProvider>
  );
}
