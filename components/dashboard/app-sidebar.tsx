"use client"

import * as React from "react"
import {
  LayoutDashboard,
  Package,
  Users,
  Settings,
  ChevronLeft,
  Store,
  Plus,
  User,
  LogOut,
  ChevronUp,
  ShoppingCart
} from "lucide-react"

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
  SidebarSeparator,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { signOut } from "next-auth/react"
import { useTranslations } from "next-intl"

const data = {
  navMain: [
    {
      title: "Overview",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Products",
      url: "/dashboard/products",
      icon: Package,
    },
    {
      title: "Orders",
      url: "/dashboard/orders",
      icon: ShoppingCart,
    },
    {
      title: "Users",
      url: "/dashboard/users",
      icon: Users,
    },
  ],
  settings: [
    {
      title: "My Profile",
      url: "/dashboard/settings/profile",
      icon: Users,
    },
    {
      title: "Account Settings",
      url: "/dashboard/settings/account",
      icon: Settings,
    },
  ]
}

const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const t = useTranslations('Dashboard')
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" {...props} className="border-r border-gray-100 p-2">
      <SidebarHeader className="p-4 border-b border-gray-50">
        <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
                <span className="text-white font-black text-lg italic">V</span>
            </div>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden overflow-hidden">
                <span className="font-black text-lg tracking-tighter text-gray-900 leading-none truncate"><span className="text-primary">Admin</span></span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate">v1.0</span>
            </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2 gap-0 overflow-x-hidden">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-black uppercase tracking-widest text-gray-300 px-4 py-2 group-data-[collapsible=icon]:hidden">Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navMain.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                        asChild 
                        isActive={isActive} 
                        tooltip={item.title}
                        className={cn(
                            "py-5 px-4 rounded-xl transition-all duration-200",
                            isActive ? "bg-primary/5 text-primary font-bold shadow-sm" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                        )}
                    >
                      <Link href={item.url}>
                        <item.icon className={cn("size-5 shrink-0", isActive && "text-primary")} />
                        <span className="text-sm truncate">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="mx-4 my-2 group-data-[collapsible=icon]:hidden bg-gray-100" />

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-black uppercase tracking-widest text-gray-300 px-4 py-2 group-data-[collapsible=icon]:hidden">Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.settings.map((item) => {
                 const isActive = pathname === item.url;
                 return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                        asChild 
                        isActive={isActive} 
                        tooltip={item.title}
                        className={cn(
                            "py-5 px-4 rounded-xl transition-all duration-200",
                            isActive ? "bg-primary/5 text-primary font-bold shadow-sm" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                        )}
                    >
                      <Link href={item.url}>
                        <item.icon className={cn("size-5 shrink-0", isActive && "text-primary")} />
                        <span className="text-sm truncate">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-2 border-t border-gray-50 gap-2 overflow-hidden">
        <SidebarMenu>
          <SidebarMenuItem>
             <SidebarMenuButton 
                asChild
                className="bg-primary text-white hover:bg-primary/90 hover:text-white shadow-lg shadow-primary/20 justify-center font-bold py-6 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:size-10 rounded-xl"
                tooltip="Quick Add Product"
            >
                <Link href="/dashboard/products/manage">
                    <Plus className="size-5 shrink-0" />
                    <span className="group-data-[collapsible=icon]:hidden truncate">{t('quickAdd')}</span>
                </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="cursor-pointer data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground rounded-xl py-6"
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gray-100 text-sidebar-primary-foreground shrink-0">
                    <User className="size-4 text-gray-500" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight overflow-hidden">
                    <span className="truncate font-semibold">Administrator</span>
                    <span className="truncate text-xs text-gray-400">admin@volt.com</span>
                  </div>
                  <ChevronUp className="ml-auto shrink-0" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                
                side="top"
                className="w-[15rem]"
              >
                <DropdownMenuItem asChild>
                    <Link href="/" className="cursor-pointer gap-2">
                        <Store className="size-4" />
                        <span>{t('backToStore')}</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer gap-2 text-red-500 focus:text-red-500 focus:bg-red-50">
                  <LogOut className="size-4" />
                  <span>{t('signOut')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar;
