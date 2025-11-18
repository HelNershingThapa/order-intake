'use client'

import * as React from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table'
import { useQueryStates } from 'nuqs'

import { ordersSearchParams } from '@/app/(main)/orders/searchParams'
import type { TimeWindow } from '@/app/(main)/settings/components/schema'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Vendor } from '@/types/miscellaneous'
import type { Order, OrderListResponse } from '@/types/order'

import { DataTablePagination } from './data-table-pagination'
import { DataTableToolbar } from './data-table-toolbar'

interface DataTableProps<TValue> {
  columns: ColumnDef<Order, TValue>[]
  data: OrderListResponse
  isAdmin?: boolean
  vendors: Vendor[]
  pickupWindows: TimeWindow[]
}

export function DataTable<TValue>({
  columns,
  data,
  isAdmin = false,
  vendors,
  pickupWindows,
}: DataTableProps<TValue>) {
  const [
    { page, page_size, statuses, vendor_ids, pickup_window_ids },
    setParams,
  ] = useQueryStates(ordersSearchParams, {
    shallow: false,
  })

  console.log('data', data)

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({ vendor_name: isAdmin })
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [rowSelection, setRowSelection] = React.useState({})

  // Derive column filters from URL params for UI consistency
  const columnFilters = React.useMemo<ColumnFiltersState>(() => {
    const filters: ColumnFiltersState = []
    if (statuses && statuses.length > 0) {
      filters.push({ id: 'status', value: statuses })
    }
    if (vendor_ids && vendor_ids.length > 0) {
      filters.push({ id: 'vendor_name', value: vendor_ids })
    }
    if (pickup_window_ids && pickup_window_ids.length > 0) {
      filters.push({ id: 'pickup_window_name', value: pickup_window_ids })
    }
    return filters
  }, [statuses, vendor_ids, pickup_window_ids])

  const table = useReactTable({
    data: data.items,
    columns,
    state: {
      sorting,
      columnVisibility,
      columnFilters,
      rowSelection,
      pagination: {
        pageIndex: page ? page - 1 : 0,
        pageSize: page_size,
      },
    },
    manualFiltering: true,
    manualPagination: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onPaginationChange: (updater) => {
      // Update search params on pagination change
      const next =
        typeof updater === 'function'
          ? updater(table.getState().pagination)
          : updater
      setParams({
        page: Number(next.pageIndex + 1),
        page_size: Number(next.pageSize),
      })
    },
    rowCount: data.total,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getRowId: (order) => order.order_id,
  })

  return (
    <div className="space-y-4">
      <DataTableToolbar
        table={table}
        isAdmin={isAdmin}
        vendors={vendors}
        pickupWindows={pickupWindows}
      />
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}
