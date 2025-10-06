"use client";

import * as React from "react";
import {
  IconDashboard,
  IconListDetails,
  IconFileUpload,
  // IconSettingsBolt,
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
    // {
    //   title: "Settings",
    //   url: "/vendor/settings",
    //   icon: IconSettingsBolt,
    // },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/">
                <div className="relative w-full h-16">
                  <Image
                    src={"/baato_maps_cover.jpeg"}
                    alt="Baato Maps cover"
                    fill
                    objectFit="cover"
                  />
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
