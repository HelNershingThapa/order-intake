import Link from "next/link";
import {
  IconCirclePlusFilled,
  IconDashboard,
  IconListDetails,
  IconFileUpload,
  IconSettingsBolt,
  IconTablePlus,
} from "@tabler/icons-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { Role } from "@/types/miscellaneous";

// Map serializable keys to actual icon components on the client side
const ICONS = {
  dashboard: IconDashboard,
  orders: IconListDetails,
  upload: IconFileUpload,
  createVendor: IconTablePlus,
  settings: IconSettingsBolt,
} as const;
type IconKey = keyof typeof ICONS;

export function NavMain({
  items,
  role,
}: {
  items: {
    title: string;
    url: string;
    // Use a serializable icon key instead of passing component constructors
    iconKey?: IconKey;
  }[];
  role: Role;
}) {
  let primaryAction = {
    label: "Add Admin",
    href: "/admins/new",
  };
  if (role === "admin") {
    primaryAction = {
      label: "Add Vendor",
      href: "/vendors/new",
    };
  }
  if (role === "vendor") {
    primaryAction = {
      label: "Add Order",
      href: "/vendor/orders/new",
    };
  }
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip={primaryAction.label}
              asChild
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
            >
              <Link href={primaryAction.href} className="w-full">
                <IconCirclePlusFilled />
                <span>{primaryAction.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => {
            const IconComp = item.iconKey ? ICONS[item.iconKey] : undefined;
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link href={item.url}>
                    {IconComp ? <IconComp /> : null}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
