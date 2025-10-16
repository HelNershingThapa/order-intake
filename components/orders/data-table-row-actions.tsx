"use client";

import { Row } from "@tanstack/react-table";
import { Edit, Eye, MapPin, MoreHorizontal, Trash } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Order } from "@/types/order";
import { DeleteOrderButton } from "./delete-order-dialog";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { useState } from "react";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const order = row.original as Order;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <MoreHorizontal />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem asChild>
            <Link href={`/orders/${order.order_id}`}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/orders/${order.order_id}`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Order
            </Link>
          </DropdownMenuItem>

          {order.status === "needs_geocode" && (
            <DropdownMenuItem asChild>
              <Link href={`/orders/${order.order_id}/geocode`}>
                <MapPin className="mr-2 h-4 w-4" />
                Set Location
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onSelect={() => setIsOpen(true)}
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteOrderButton orderId={order.order_id} setIsOpen={setIsOpen} />
    </AlertDialog>
  );
}
