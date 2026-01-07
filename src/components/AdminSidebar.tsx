
import React, { useMemo } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  FileText, 
  Boxes, 
  HandCoins,
  Stethoscope,
  Mail,
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
import { useAuth } from '@/hooks/useAuth';

const allSidebarItems = [
  { title: "Visão Geral", url: "#overview", icon: LayoutDashboard, roles: ['admin', 'doctor', 'secretary'] },
  { title: "Agendamentos", url: "#agendamentos", icon: Calendar, roles: ['admin', 'doctor', 'secretary'] },
  { title: "Pacientes", url: "#pacientes", icon: Users, roles: ['admin', 'doctor', 'secretary'] },
  { title: "Exames", url: "#exames", icon: FileText, roles: ['admin', 'doctor', 'secretary'] },
  { title: "Estoque", url: "#estoque", icon: Boxes, roles: ['admin', 'doctor', 'secretary'] },
  { title: "Financeiro", url: "#financeiro", icon: HandCoins, roles: ['admin', 'doctor', 'secretary'] },
  { title: "Email", url: "#email", icon: Mail, roles: ['admin'], allowedUsers: ['financeiro'] }, // Só para financeiro
];

interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function AdminSidebar({ activeSection, onSectionChange }: AdminSidebarProps) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const { appUser } = useAuth();
  
  // Filtrar itens do sidebar baseado no role e username do usuário
  const sidebarItems = useMemo(() => {
    if (!appUser) return [];
    
    return allSidebarItems.filter(item => {
      // Se o item tem allowedUsers, verificar se o username está na lista
      if (item.allowedUsers) {
        return item.allowedUsers.includes(appUser.username);
      }
      // Caso contrário, verificar por role
      return item.roles.includes(appUser.role);
    });
  }, [appUser]);

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
              src="/uploads/e187619e-2328-418d-971f-86200b2bb552.png" 
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
