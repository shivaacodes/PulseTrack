import React from "react";
import {
  SidebarProvider,
  SidebarInset,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import DashboardSidebar from "./Sidebar";
import ThemeSelector from "./ThemeSelector";
import ChartSelector from "./ChartSelector";
import LogoutButton from "./LogoutButton";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export default function Dashboard() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <DashboardSidebar />
        <SidebarInset>
          <header className="sticky top-0 z-50 bg-background border-b border-border px-4 md:px-6 py-3 md:py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 md:gap-4">
                <SidebarTrigger className="hover:bg-muted rounded-lg p-1.5 md:p-2" />
                <h1 className="text-2xl md:text-4xl font-bold">Analytics Dashboard</h1>
              </div>
              <div className="flex items-center gap-2 md:gap-4">
                <ThemeSelector />
                <ThemeToggle />
                <LogoutButton />
              </div>
            </div>
          </header>
          <div className="p-4 md:p-6 w-full">
            <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
              <div className="flex-1 min-w-0">
                <ChartSelector />
              </div>
            </div>
          </div>
        </SidebarInset>
        <SidebarRail />
      </div>
    </SidebarProvider>
  );
}
