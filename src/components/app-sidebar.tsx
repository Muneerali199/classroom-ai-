'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar';
import { useTranslations } from 'next-intl';
import { 
  Home, 
  User, 
  Users, 
  BarChart3, 
  Bot, 
  Calendar,
  ClipboardList,
  BookOpen,
  Settings,
  HelpCircle,
  ChevronUp,
} from 'lucide-react';
import { Logo } from '@/components/icons';
import { Link, usePathname } from '@/routing';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/use-auth';

// Menu items organized by sections
const menuItems = [
  {
    title: 'Main',
    items: [
      { href: '/dashboard', label: 'dashboard', icon: Home },
      { href: '/dashboard/attendance', label: 'attendance', icon: BarChart3 },
      { href: '/dashboard/students', label: 'students', icon: Users },
    ]
  },
  {
    title: 'Academic',
    items: [
      { href: '/dashboard/assignments', label: 'assignments', icon: ClipboardList },
      { href: '/dashboard/timetable', label: 'timetable', icon: Calendar },
      { href: '/dashboard/meetings', label: 'meetings', icon: BookOpen },
    ]
  },
  {
    title: 'Tools',
    items: [
      { href: '/dashboard/assistant', label: 'assistant', icon: Bot },
      { href: '/dashboard/profile', label: 'profile', icon: User },
      { href: '/dashboard/settings', label: 'settings', icon: Settings },
    ]
  }
];

export default function AppSidebar() {
  const t = useTranslations('DashboardNav');
  const pathname = usePathname();
  const { user } = useAuth();
  const { state } = useSidebar();

  const getRelativePath = (path: string) => {
    const segments = pathname.split('/');
    const locale = segments[1];
    return `/${locale}${path}`;
  };

  const isActive = (path: string) => pathname === getRelativePath(path);

  const getInitials = (name: string | null | undefined, fallback: string) => {
    if (!name) return fallback;
    const parts = name.split(' ');
    if (parts.length > 1 && parts[0] && parts[parts.length - 1]) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return (name[0] || '').toUpperCase();
  };

  return (
    <Sidebar collapsible="icon" className="border-sidebar-border bg-sidebar">
      {/* Header with Logo */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard" className="flex items-center gap-3">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-sidebar-primary-foreground">
                  <Logo className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-sidebar-foreground">
                    ClassroomAI
                  </span>
                  <span className="truncate text-xs text-sidebar-foreground/70">
                    Education Platform
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Main Navigation */}
      <SidebarContent>
        {menuItems.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel className="text-sidebar-foreground/70 text-xs font-medium">
              {section.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive(item.href)}
                      tooltip={t(item.label)}
                      className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground"
                    >
                      <Link href={item.href}>
                        <item.icon className="size-4" />
                        <span>{t(item.label)}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

        {/* Help Section */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Help & Support">
                  <Link href="/help">
                    <HelpCircle className="size-4" />
                    <span>Help & Support</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer with User Profile */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage 
                      src={user?.photoURL ?? "https://picsum.photos/100"} 
                      alt={user?.displayName ?? 'User'} 
                    />
                    <AvatarFallback className="rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
                      {getInitials(user?.displayName || user?.email, 'U')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold text-sidebar-foreground">
                      {user?.displayName ?? 'User'}
                    </span>
                    <span className="truncate text-xs text-sidebar-foreground/70">
                      {user?.email ?? 'user@example.com'}
                    </span>
                  </div>
                  <ChevronUp className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side={state === "collapsed" ? "right" : "bottom"}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span className="text-red-600">Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      
      {/* Rail for expand/collapse */}
      <SidebarRail />
    </Sidebar>
  );
}
