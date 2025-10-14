import * as React from "react";

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

import { getCurrentUser } from "@/app/actions";
import type { Role } from "@/types/miscellaneous";

type IconKey =
  | "dashboard"
  | "orders"
  | "upload"
  | "createVendor"
  | "settings"
  | "profile";
type NavItem = {
  title: string;
  url: string;
  role: Role[];
  iconKey: IconKey;
};

const data: { navMain: NavItem[] } = {
  navMain: [
    {
      title: "Dashboard",
      url: "/vendor/dashboard",
      role: ["admin", "vendor"],
      iconKey: "dashboard",
    },
    {
      title: "Orders",
      url: "/vendor/orders",
      role: ["vendor"],
      iconKey: "orders",
    },
    {
      title: "Bulk Upload",
      url: "/vendor/upload",
      role: ["vendor"],
      iconKey: "upload",
    },
    {
      title: "Vendors",
      url: "/vendors",
      role: ["admin"],
      iconKey: "createVendor",
    },
    {
      title: "Settings",
      url: "/admin/settings",
      role: ["admin"],
      iconKey: "settings",
    },
    {
      title: "Profile",
      url: "/profile",
      role: ["vendor"],
      iconKey: "profile",
    },
  ],
};

export async function AppSidebar() {
  const currentUser = await getCurrentUser();
  const navItems: { title: string; url: string; iconKey?: IconKey }[] =
    data.navMain
      .filter((item) => item.role.includes(currentUser.user.role))
      .map((item) => ({
        title: item.title,
        iconKey: item.iconKey,
        url: item.url,
      }));

  return (
    <Sidebar collapsible="offcanvas" variant="inset">
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
        <NavMain items={navItems} role={currentUser.user.role} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={currentUser} />
      </SidebarFooter>
    </Sidebar>
  );
}
