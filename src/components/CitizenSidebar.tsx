import { NavLink, useLocation } from 'react-router-dom';
import { MapPin, Camera, MessageSquare, Brain, Trophy, ShoppingBag, LayoutDashboard } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

const menuItems = [
  { title: 'Overview', url: '/citizen', icon: LayoutDashboard },
  { title: 'Report Waste', url: '/citizen/report', icon: MapPin },
  { title: 'AI Scanner', url: '/citizen/scanner', icon: Camera },
  { title: 'Marketplace', url: '/citizen/marketplace', icon: ShoppingBag },
  { title: 'Rewards', url: '/citizen/rewards', icon: Trophy },
];

export function CitizenSidebar() {
  const { open } = useSidebar();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-center px-4 text-sidebar-foreground/70 font-semibold">
            Citizen Portal
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-4">
            <SidebarMenu className="gap-4 text-lg">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.url)}
                    className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-gradient-to-r data-[active=true]:from-primary data-[active=true]:to-accent data-[active=true]:text-primary-foreground data-[active=true]:shadow-md transition-all"
                  >
                    <NavLink to={item.url} className="flex items-center gap-3 px-4 py-3 rounded-md">
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.title}</span>
                    </NavLink>
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
