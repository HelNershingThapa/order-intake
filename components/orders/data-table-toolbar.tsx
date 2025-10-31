"use client"

import type { DateRange } from "react-day-picker"
import Link from "next/link"
import { Table } from "@tanstack/react-table"
import { format } from "date-fns"
import { CalendarIcon, Plus, X } from "lucide-react"
import { useQueryStates } from "nuqs"

import { ordersSearchParams } from "@/app/(main)/orders/searchParams"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import type { Vendor } from "@/types/miscellaneous"

import { orderStatuses } from "./config"
import { ConfirmOrders } from "./confirm-orders"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { GenerateRunSheet } from "./generate-run-sheet"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  isAdmin?: boolean
  vendors: Vendor[]
}

export function DataTableToolbar<TData>({
  table,
  isAdmin = false,
  vendors,
}: DataTableToolbarProps<TData>) {
  const vendorOptions = vendors.map((vendor) => ({
    label: vendor.contact_name,
    value: vendor.id,
  }))
  const [{ search, from_, to, statuses, vendor_id }, setParams] =
    useQueryStates(ordersSearchParams, {
      shallow: false,
    })
  const isFiltered =
    table.getState().columnFilters.length > 0 ||
    !!search ||
    !!from_ ||
    !!to ||
    (statuses && statuses.length > 0) ||
    (vendor_id && vendor_id.length > 0)

  function handleSearch(term: string) {
    setParams({ search: term || null, page: 1 })
  }

  function handleDateRangeSelect(range: DateRange | undefined) {
    setParams({
      from_: range?.from ?? null,
      to: range?.to ?? null,
      page: 1,
    })
  }

  return (
    <div className="flex items-center justify-between flex-wrap">
      <div className="flex flex-1 items-center gap-2 flex-wrap">
        <Input
          placeholder="Search orders..."
          value={search || ""}
          onChange={(e) => {
            handleSearch(e.target.value)
          }}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={orderStatuses}
            filterKey="statuses"
          />
        )}
        {table.getColumn("vendor_name") && (
          <DataTableFacetedFilter
            column={table.getColumn("vendor_name")}
            title="Vendor"
            options={vendorOptions}
            filterKey="vendor_id"
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              table.resetColumnFilters()
              setParams({
                search: null,
                statuses: null,
                vendor_id: null,
                from_: null,
                to: null,
                page: 1,
              })
            }}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X />
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        {!isAdmin && <ConfirmOrders table={table} />}
        {isAdmin && <GenerateRunSheet table={table} />}
        {!isAdmin && (
          <Button size="sm" asChild>
            <Link href="/orders/new">
              <Plus />
              Add Order
            </Link>
          </Button>
        )}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={from_ || to ? "default" : "outline"}
              size="sm"
              id="date"
              className="justify-between font-normal"
            >
              <CalendarIcon className="size-4 shrink-0" />
              {from_ && to && (
                <span className="ml-2">
                  {format(new Date(from_), "LLL dd")} -{" "}
                  {format(new Date(to), "LLL dd")}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="range"
              defaultMonth={from_ || new Date()}
              numberOfMonths={2}
              selected={{
                from: from_ ? new Date(from_) : undefined,
                to: to ? new Date(to) : undefined,
              }}
              className="rounded-lg border shadow-sm"
              onSelect={handleDateRangeSelect}
              hidden={{
                after: new Date(),
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
