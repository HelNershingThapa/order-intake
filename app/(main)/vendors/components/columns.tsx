"use client";

import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/orders/data-table-column-header";
import type { Vendor } from "@/types/miscellaneous";

export const columns: ColumnDef<Vendor>[] = [
  {
    accessorKey: "contact_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate font-medium">
        {row.getValue("contact_name")}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "contact_phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" />
    ),
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate font-medium">
        {row.getValue("contact_phone") || "-"}
      </div>
    ),
  },
  {
    accessorKey: "pickup_address_text",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Pickup Address" />
    ),
    cell: ({ row }) => (
      <div className="max-w-[300px] truncate">
        {row.getValue("pickup_address_text")}
      </div>
    ),
  },
  {
    accessorKey: "pickup_window_start",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Pickup Window Start" />
    ),
    cell: ({ row }) => {
      const value = row.getValue<string | null>("pickup_window_start");
      return <div className="max-w-[200px] truncate">{value || "-"}</div>;
    },
  },
  {
    accessorKey: "pickup_window_end",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Pickup Window End" />
    ),
    cell: ({ row }) => {
      const value = row.getValue<string | null>("pickup_window_end");
      return <div className="max-w-[200px] truncate">{value || "-"}</div>;
    },
  },
  {
    accessorKey: "is_active",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Active" />
    ),
    cell: ({ row }) => {
      const active = row.getValue<boolean>("is_active");
      return (
        <span className={active ? "text-green-600" : "text-muted-foreground"}>
          {active ? "Yes" : "No"}
        </span>
      );
    },
  },
  {
    id: "total_orders",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Orders" />
    ),
    accessorFn: (row) => row.stats.total_orders,
    cell: ({ row }) => <span>{row.original.stats.total_orders}</span>,
    enableSorting: true,
  },
  {
    id: "ready_count",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ready" />
    ),
    accessorFn: (row) => row.stats.ready_count,
    cell: ({ row }) => <span>{row.original.stats.ready_count}</span>,
    enableSorting: true,
  },
  {
    id: "geocode_pending",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Geocode Pending" />
    ),
    accessorFn: (row) => row.stats.geocode_pending,
    cell: ({ row }) => <span>{row.original.stats.geocode_pending}</span>,
    enableSorting: true,
  },
  {
    id: "last_order_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Order" />
    ),
    accessorFn: (row) => row.stats.last_order_at ?? "",
    cell: ({ row }) => <span>{row.original.stats.last_order_at ?? "-"}</span>,
    enableSorting: true,
  },
];
