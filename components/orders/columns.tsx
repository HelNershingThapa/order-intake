"use client"

import Link from "next/link"
import type { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import type { Order } from "@/types/order"

import { orderStatuses } from "./config"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"

export const columns: ColumnDef<Order>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "order_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Order ID" />
    ),
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate">
        <Link
          href={`/orders/${row.getValue("order_id")}`}
          className="font-medium hover:underline"
        >
          {row.getValue("order_id")}
        </Link>
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "recipient_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Recipient" />
    ),
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate font-medium">
        {row.getValue("recipient_name")}
      </div>
    ),
  },
  {
    accessorKey: "vendor_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Vendor" />
    ),
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate font-medium">
        <Link
          href={`/vendors/${row.original.vendor_id}`}
          className="font-medium hover:underline"
        >
          {row.getValue("vendor_name")}
        </Link>
      </div>
    ),
  },
  {
    id: "pickup_window_name",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="hidden"
        column={column}
        title="Pickup Window"
      />
    ),
    cell: ({ row }) => (
      <div className="max-w-[200px] hidden truncate">
        {row.getValue("pickup_window_name") || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "delivery_address_text",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Delivery Address" />
    ),
    cell: ({ row }) => (
      <div className="max-w-[300px] truncate">
        {row.getValue("delivery_address_text")}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = orderStatuses.find(
        (status) => status.value === row.getValue("status")
      )

      if (!status) {
        return null
      }
      return (
        <Badge variant={status.variant} className="[&>svg]:size-3.5">
          {status.icon && <status.icon />}
          {status.label}
        </Badge>
      )
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) =>
      format(new Date(row.getValue("created_at")), "LLL do, HH:mm"),
    enableSorting: true,
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
