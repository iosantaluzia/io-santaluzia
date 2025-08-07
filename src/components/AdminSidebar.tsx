
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  FileText, 
  Boxes, 
  HandCoins,
  ChevronRight,
  Menu
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";

const sidebarItems = [
  { title: "Visão Geral", url: "#overview", icon: LayoutDashboard },
  { title: "Agendamentos", url: "#agendamentos", icon: Calendar },
  { title: "Pacientes", url: "#pacientes", icon: Users },
  { title: "Exames", url: "#exames", icon: FileText },
  { title: "Estoque", url: "#estoque", icon: Boxes },
  { title: "Financeiro", url: "#financeiro", icon: HandCoins },
];

interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function AdminSidebar({ activeSection, onSectionChange }: AdminSidebarProps) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const handleSectionClick = (url: string) => {
    const section = url.replace('#', '');
    onSectionChange(section);
  };

  return (
    <Sidebar className={isCollapsed ? "w-14" : "w-60"} collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full overflow-hidden flex items-center justify-center bg-white">
            <img 
              src="/lovable-uploads/e187619e-2328-418d-971f-86200b2bb552.png" 
              alt="Instituto de Olhos Santa Luzia" 
              className="h-6 w-6 object-contain animate-spin-slow" 
            />
          </div>
          {!isCollapsed && (
            <div>
              <h2 className="text-sm font-semibold text-cinza-escuro">Admin Panel</h2>
              <p className="text-xs text-gray-500">Santa Luzia</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Módulos</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    isActive={activeSection === item.url.replace('#', '')}
                  >
                    <button 
                      onClick={() => handleSectionClick(item.url)}
                      className="w-full flex items-center"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
