import { NavLink, useLocation } from 'react-router-dom';
import { Map, CheckCircle, Package, BarChart3, LayoutDashboard } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

const menuItems = [
  { title: 'Overview', url: '/collector', icon: LayoutDashboard },
  { title: 'Assigned Areas', url: '/collector/areas', icon: Map },
  { title: 'Log Collection', url: '/collector/log', icon: CheckCircle },
  { title: 'Sell Recyclables', url: '/collector/sell', icon: Package },
  { title: 'Performance', url: '/collector/performance', icon: BarChart3 },
];

export function CollectorSidebar() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-center px-4 text-sidebar-foreground/70 font-semibold">
            Collector Portal
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-4">
            <SidebarMenu className="gap-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.url)}
                    className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-gradient-to-r data-[active=true]:from-accent data-[active=true]:to-primary data-[active=true]:text-accent-foreground data-[active=true]:shadow-md transition-all"
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
