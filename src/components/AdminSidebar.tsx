
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
  FileCheck,
  Truck
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
  { title: "Visão Geral", url: "#overview", icon: LayoutDashboard, roles: ['admin', 'doctor', 'secretary', 'financeiro'] },
  { title: "Agendamentos", url: "#agendamentos", icon: Calendar, roles: ['admin', 'doctor', 'secretary', 'financeiro'] },
  { title: "Pacientes", url: "#pacientes", icon: Users, roles: ['admin', 'doctor', 'secretary', 'financeiro'] },
  { title: "Exames", url: "#exames", icon: FileText, roles: ['admin', 'doctor', 'secretary', 'financeiro'] },
  { title: "Documentos", url: "#documentos", icon: FileCheck, roles: ['admin', 'doctor'] },
  { title: "Estoque", url: "#estoque", icon: Boxes, roles: ['admin', 'doctor', 'secretary', 'financeiro'] },
  { title: "Fornecedores", url: "#fornecedores", icon: Truck, roles: ['admin', 'secretary', 'financeiro'] },
  { title: "Financeiro", url: "#financeiro", icon: HandCoins, roles: ['admin', 'doctor', 'financeiro'] },
  { title: "Email", url: "#email", icon: Mail, roles: ['admin', 'financeiro'], disabled: true },
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
      const hasRole = item.roles.includes(appUser.role);
      return hasRole;
    });
  }, [appUser]);

  const handleSectionClick = (url: string) => {
    const section = url.replace('#', '');
    onSectionChange(section);
  };

  return (
    <Sidebar className={isCollapsed ? "w-14" : "w-60"} collapsible="icon">
      <SidebarHeader className="p-4">
        <img src="/uploads/logoiosantaluzia-removebg-preview.png" alt="Instituto de Olhos Santa Luzia" className={`${isCollapsed ? 'h-8 w-auto' : 'h-18 w-auto md:h-24 md:w-auto'} object-contain`} />
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
                    disabled={item.disabled}
                  >
                    <button
                      onClick={() => !item.disabled && handleSectionClick(item.url)}
                      className={`w-full flex items-center ${item.disabled ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!isCollapsed && (
                        <div className="flex items-center gap-2">
                          <span>{item.title}</span>
                          {item.disabled && <span className="text-[10px] font-normal italic opacity-60">(Em breve)</span>}
                        </div>
                      )}
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
