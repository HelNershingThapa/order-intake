"use client";
import Link from "next/link";
import { ChevronsLeftIcon, ChevronsRightIcon, Moon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger, useSidebar } from "./ui/sidebar";
const NavBar = () => {
  const { open, toggleSidebar } = useSidebar();

  return (
    <nav className=" p-4 flex items-center justify-between shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)] mb-2 ">
      <button onClick={toggleSidebar}>
        {open ? <ChevronsLeftIcon /> : <ChevronsRightIcon />}
      </button>

      <div className=" flex items-center gap-5 justify-between ">
        <Link href="/">Dashboard</Link>
        <Moon></Moon>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Team</DropdownMenuItem>
            <DropdownMenuItem>Subscription</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default NavBar;
