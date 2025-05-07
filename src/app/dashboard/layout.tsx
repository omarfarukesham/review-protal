"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

// import data from "./data.json"

export default function DashboradLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const session = useSession()
  // console.log("session from dashboard layout", session)
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <div className="flex flex-1 flex-col">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
