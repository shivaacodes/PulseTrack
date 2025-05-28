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
import { useTheme } from "next-themes";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function DashboardSidebar() {
  const { theme } = useTheme();

  const menuItems = [
    { 
      name: 'Analytics', 
      icon: <Activity className="h-7 w-7" />,
      description: 'Overview of all key metrics',
      criteria: 'Combined view of all analytics data'
    },
    { 
      name: 'Page Visits', 
      icon: <BarChart3 className="h-7 w-7" />,
      description: 'Number of unique page visits',
      criteria: 'Unique visitors per page / Total visitors × 100'
    },
    { 
      name: 'Click Rate', 
      icon: <MousePointerClick className="h-7 w-7" />,
      description: 'User interaction through clicks',
      criteria: 'Total clicks / Total page views × 100'
    },
    { 
      name: 'Bounce Rate', 
      icon: <ArrowDownToLine className="h-7 w-7" />,
      description: 'Users who leave without interaction',
      criteria: 'Single-page sessions / Total sessions × 100'
    },
    { 
      name: 'Conversion', 
      icon: <Target className="h-7 w-7" />,
      description: 'Goal completion rate',
      criteria: 'Completed goals / Total visitors × 100'
    },
    { 
      name: 'Retention', 
      icon: <UserCheck className="h-7 w-7" />,
      description: 'Returning user rate',
      criteria: 'Returning users / Total users × 100'
    }
  ];

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
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <SidebarMenuButton 
                        asChild 
                        className="w-full px-6 py-5 rounded-xl transition-all hover:bg-muted hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <button 
                          className="flex items-center gap-5 text-muted-foreground hover:text-foreground w-full"
                        >
                          {item.icon}
                          <span className="font-semibold text-lg">{item.name}</span>
                        </button>
                      </SidebarMenuButton>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent 
                    side="right" 
                    sideOffset={10}
                    className="bg-popover text-popover-foreground border border-border shadow-lg rounded-lg p-4 max-w-[300px]"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        {item.icon}
                        <h4 className="font-semibold text-base">{item.name}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                      <div className="pt-2 border-t border-border">
                        <p className="text-xs text-muted-foreground">
                          <span className="font-medium text-foreground">Computation:</span> {item.criteria}
                        </p>
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}