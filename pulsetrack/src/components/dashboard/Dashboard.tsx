import React from 'react';
import { SidebarProvider, SidebarInset, SidebarRail, SidebarTrigger } from '@/components/ui/sidebar';
import DashboardSidebar from './Sidebar';
import ThemeSelector from './ThemeSelector';
import ChartSelector from './ChartSelector';
import SalesTable from './SalesTable';
import LogoutButton from './LogoutButton';
import { 
  Users, 
  BarChart3, 
  MousePointerClick, 
  UserCheck,
  Clock,
  Target,
  Zap,
  Activity,
  Settings2
} from 'lucide-react';

export default function Dashboard() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-white">
        <DashboardSidebar />
        <SidebarInset>
          <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="hover:bg-gray-100 rounded-lg" />
                <h1 className="text-4xl font-bold">Analytics Dashboard</h1>
              </div>
              <div className="flex items-center gap-4">
                <ThemeSelector />
                <button 
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Settings"
                >
                  <Settings2 className="h-5 w-5 text-gray-600" />
                </button>
                <LogoutButton />
              </div>
            </div>
          </header>
          <div className="p-6 w-full">
            <div className="flex gap-6">
              {/* Main content area with charts */}
              <div className="flex-1 min-w-0">
                <ChartSelector />
              </div>
              
              {/* Fixed sales table on the right */}
              <div className="w-[400px] flex-shrink-0">
                <div className="sticky top-24">
                  <SalesTable />
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
        <SidebarRail />
      </div>
    </SidebarProvider>
  );
}