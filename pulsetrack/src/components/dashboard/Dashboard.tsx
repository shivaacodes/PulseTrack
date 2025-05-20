import React from 'react';
import { SidebarProvider, SidebarInset, SidebarRail } from '@/components/ui/sidebar';
import DashboardSidebar from './Sidebar';
import ThemeSelector from './ThemeSelector';
import SalesChart from './SalesChart';
import SalesTable from './SalesTable';
import StatCard from './StatCard';
import { 
  Users, 
  BarChart3, 
  MousePointerClick, 
  UserCheck,
  Clock,
  Target,
  Zap,
  Activity
} from 'lucide-react';

export default function Dashboard() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-white">
        <DashboardSidebar />
        <SidebarInset>
          <div className="p-6 w-full">
            <header className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-4xl font-bold">Analytics Dashboard</h1>
              </div>
              <ThemeSelector />
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard 
                title="Active Users" 
                value="2,543"
                icon={<Users className="h-5 w-5" />}
                trend={{ value: 12.5, positive: true }}
                description="Current active users in the last 24 hours"
              />
              <StatCard 
                title="Page Views" 
                value="45.2K"
                icon={<BarChart3 className="h-5 w-5" />}
                trend={{ value: 8.2, positive: true }}
                description="Total page views this month"
              />
              <StatCard 
                title="Click Rate" 
                value="68.3%"
                icon={<MousePointerClick className="h-5 w-5" />}
                trend={{ value: 3.1, positive: false }}
                description="Average click-through rate"
              />
              <StatCard 
                title="Retention" 
                value="92.4%"
                icon={<UserCheck className="h-5 w-5" />}
                trend={{ value: 5.7, positive: true }}
                description="User retention rate this month"
              />
              
              <div className="col-span-3">
                <SalesChart />
              </div>
              <div className="col-span-1">
                <SalesTable />
              </div>
            </div>
          </div>
        </SidebarInset>
        <SidebarRail />
      </div>
    </SidebarProvider>
  );
}