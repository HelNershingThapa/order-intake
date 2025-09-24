"use client";

import { ColumnDef } from "@tanstack/react-table";

import { orderStatuses, geocodeStatuses } from "./config";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import type { OrderSummary } from "@/types/order";
import { format } from "date-fns";

export const columns: ColumnDef<OrderSummary>[] = [
  {
    accessorKey: "order_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Order ID" />
    ),
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate">{row.getValue("order_id")}</div>
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
        (status) => status.value === row.getValue("status"),
      );

      if (!status) {
        return null;
      }

      return (
        <div className="flex w-[120px] items-center">
          {status.icon && (
            <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{status.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "geocode_status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Geocode Status" />
    ),
    cell: ({ row }) => {
      const geocodeStatus = geocodeStatuses.find(
        (status) => status.value === row.getValue("geocode_status"),
      );

      if (!geocodeStatus) {
        return null;
      }

      return (
        <div className="flex items-center">
          {geocodeStatus.icon && (
            <geocodeStatus.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{geocodeStatus.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) =>
      format(new Date(row.getValue("created_at")), "LLL Mo, HH:mm"),
    enableSorting: true,
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
