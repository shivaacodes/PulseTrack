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

export default function DashboardSidebar() {
  const menuItems = [
    { 
      name: 'Analytics', 
      icon: <Activity className="h-7 w-7" />,
      path: '/',
      active: true
    },
    { 
      name: 'Page Visits', 
      icon: <BarChart3 className="h-7 w-7" />,
      path: '/page-visits'
    },
    { 
      name: 'Click Rate', 
      icon: <MousePointerClick className="h-7 w-7" />,
      path: '/click-tracking'
    },
    { 
      name: 'Bounce Rate', 
      icon: <ArrowDownToLine className="h-7 w-7" />,
      path: '/bounce-rate'
    },
    { 
      name: 'Conversion', 
      icon: <Target className="h-7 w-7" />,
      path: '/conversion-rate'
    },
    { 
      name: 'Retention', 
      icon: <UserCheck className="h-7 w-7" />,
      path: '/use-retention'
    }
  ];

  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="px-8 border-b border-gray-200">
        <div className="relative w-[180px] h-[80px]">
          <Image
            src="/images/PulseTrack.png"
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
                isActive={item.active}
                className="w-full px-6 py-5 rounded-xl transition-all hover:bg-gray-100 hover:scale-[1.02] active:scale-[0.98]"
              >
                <a href={item.path} className="flex items-center gap-5 text-gray-700 hover:text-black">
                  {item.icon}
                  <span className="font-semibold text-lg">{item.name}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}