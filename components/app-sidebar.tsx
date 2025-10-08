"use client";

import * as React from "react";
import {
  IconDashboard,
  IconListDetails,
  IconFileUpload,
  IconSettingsBolt,
} from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";

import { usePathname } from "next/navigation";

const data = {
  user: {
    name: "suraj",
    email: "suraj@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/vendor/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Orders",
      url: "/vendor/orders",
      icon: IconListDetails,
    },
    {
      title: "Bulk Upload",
      url: "/vendor/upload",
      icon: IconFileUpload,
    },
    {
      title: "Settings",
      url: "/admin/settings",
      icon: IconSettingsBolt,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const isAdminRoute =
    pathname?.startsWith("/admin") || pathname?.startsWith("/main/admin");
  const basePrefix = isAdminRoute ? "/admin" : "/vendor";
  const filtered = isAdminRoute
    ? data.navMain.filter((item) => ["Orders", "Settings"].includes(item.title))
    : data.navMain.filter((item) => item.title !== "Settings");
  const navItems = filtered.map((item) => ({
    ...item,
    url: item.url.replace(/^\/(admin|vendor)/, basePrefix),
  }));
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5 h-full"
            >
              <Link href="/">
                <div className="relative w-full h-16">
                  <Image
                    src={"/logo.svg"}
                    alt="Baato Maps cover"
                    fill
                    objectFit="contain"
                  />
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
