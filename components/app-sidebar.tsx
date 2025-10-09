"use client";

import * as React from "react";
import {
  IconDashboard,
  IconListDetails,
  IconFileUpload,
  IconSettingsBolt,
  IconTablePlus,
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
import { Vendor } from "@/types/miscellaneous";

const data = {
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
      title: "Create Vendor",
      url: "/admin/create-vendor",
      icon: IconTablePlus,
    },
    {
      title: "Settings",
      url: "/admin/settings",
      icon: IconSettingsBolt,
    },
  ],
};

export function AppSidebar({
  vendor,
  ...props
}: React.ComponentProps<typeof Sidebar> & { vendor: Vendor }) {
  const pathname = usePathname();
  const isAdminRoute =
    pathname?.startsWith("/admin") || pathname?.startsWith("/main/admin");
  const basePrefix = isAdminRoute ? "/admin" : "/vendor";
  const filtered = isAdminRoute
    ? data.navMain.filter((item) =>
        ["Orders", "Settings", "Create Vendor"].includes(item.title),
      )
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
                    priority
                    fill
                    style={{ objectFit: "contain" }}
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
        <NavUser user={vendor} />
      </SidebarFooter>
    </Sidebar>
  );
}
