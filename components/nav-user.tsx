"use client"

import { IconDotsVertical, IconLogout } from "@tabler/icons-react"

import { logout } from "@/app/login/actions"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import type { CurrentUser } from "@/types/miscellaneous"

// Derive 2-letter initials from a full name (e.g., "John Doe" -> "JD").
// If a single word is provided, use first two characters. Fallback to "?".
function getInitialsFromName(name?: string) {
  if (!name) return "?"
  const parts = name
    .trim()
    .split(/[\s-]+/)
    .filter(Boolean)
  if (parts.length >= 2) {
    const first = parts[0][0] || ""
    const last = parts.at(-1)?.charAt(0) || ""
    return (first + last).toUpperCase()
  }
  const word = parts[0] || ""
  return word.slice(0, 2).toUpperCase() || "?"
}

export function NavUser({ user: current }: { user: CurrentUser }) {
  const { isMobile } = useSidebar()

  // Derive display fields based on role-discriminated CurrentUser
  let primaryName: string = "" // Contact person or username
  let secondaryLabel: string = "" // Company/vendor name or email/username
  let phone: string | null | undefined = undefined
  let initialsBase: string = ""

  if (current.vendor) {
    // vendor present, admin null
    primaryName = current.vendor.contact_name
    secondaryLabel = current.user.email
    phone = current.vendor.contact_phone
    initialsBase = secondaryLabel || primaryName
  } else if (current.admin) {
    // admin present, vendor null
    primaryName = current.admin.contact_name
    secondaryLabel = current.user.email
    phone = current.admin.contact_phone
    initialsBase = primaryName
  } else {
    // superadmin: both admin and vendor are null
    primaryName = current.user.username
    secondaryLabel = current.user.email
    phone = null
    initialsBase = primaryName
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarFallback className="rounded-lg">
                  {getInitialsFromName(initialsBase)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{primaryName}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {secondaryLabel}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className="rounded-lg">
                    {getInitialsFromName(initialsBase)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{primaryName}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {phone || secondaryLabel}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={logout}>
              <IconLogout />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
