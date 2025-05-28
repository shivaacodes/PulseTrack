import React from 'react';
import { 
  Sidebar, 
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar";
import { 
  BarChart3,
  Users,
  MousePointerClick,
  UserCheck,
  Activity,
  ArrowDownToLine,
  Target
} from "lucide-react";
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from "next-themes";

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme } = useTheme();

  const menuItems = [
    { 
      name: 'Analytics', 
      icon: <Activity className="h-7 w-7" />,
      chart: 'analytics'
    },
    { 
      name: 'Page Visits', 
      icon: <BarChart3 className="h-7 w-7" />,
      chart: 'page-visits'
    },
    { 
      name: 'Click Rate', 
      icon: <MousePointerClick className="h-7 w-7" />,
      chart: 'click-tracking'
    },
    { 
      name: 'Bounce Rate', 
      icon: <ArrowDownToLine className="h-7 w-7" />,
      chart: 'bounce-rate'
    },
    { 
      name: 'Conversion', 
      icon: <Target className="h-7 w-7" />,
      chart: 'conversion-rate'
    },
    { 
      name: 'Retention', 
      icon: <UserCheck className="h-7 w-7" />,
      chart: 'user-retention'
    }
  ];

  const handleChartSelect = (chart: string) => {
    router.push(`/dashboard?chart=${chart}`);
  };

  return (
    <Sidebar className="border-r border-border bg-background">
      <SidebarHeader className="px-8 border-b border-border">
        <div className="relative w-[180px] h-[80px]">
          <Image
            src={theme === 'dark' ? "/images/Pulsetrack-dark.png" : "/images/Pulsetrack-light.png"}
            alt="PulseTrack Logo"
            fill
            sizes="(max-width: 768px) 100vw, 180px"
            className="object-cover"
            priority
          />
        </div>
      </SidebarHeader>
      <SidebarContent className="py-10">
        <SidebarMenu className="space-y-12 px-6">
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton 
                asChild 
                isActive={pathname === '/dashboard' && new URLSearchParams(window.location.search).get('chart') === item.chart}
                className="w-full px-6 py-5 rounded-xl transition-all hover:bg-muted hover:scale-[1.02] active:scale-[0.98]"
              >
                <button 
                  onClick={() => handleChartSelect(item.chart)}
                  className="flex items-center gap-5 text-muted-foreground hover:text-foreground w-full"
                >
                  {item.icon}
                  <span className="font-semibold text-lg">{item.name}</span>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}