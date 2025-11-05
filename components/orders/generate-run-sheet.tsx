"use client"

import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Table } from "@tanstack/react-table"
import { format, startOfToday } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { toast } from "sonner"
import { z } from "zod"

import { getVendors } from "@/app/(main)/vendors/actions"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { generateRun, getRuns } from "@/lib/generate-run"
import { cn } from "@/lib/utils"
import type { Order } from "@/types/order"

const STORAGE_KEY = "route360-api-key"

// Helper to combine selected date with a HH:mm time string into UTC ISO without milliseconds
const toUtcIso = (date: Date, time: string) => {
  const [hStr = "0", mStr = "0", sStr = "0"] = time.split(":")
  const y = date.getFullYear()
  const m = date.getMonth()
  const d = date.getDate()
  const hh = Number(hStr)
  const mm = Number(mStr)
  const ss = Number(sStr) || 0
  return new Date(Date.UTC(y, m, d, hh, mm, ss))
    .toISOString()
    .replace(/\.\d{3}Z$/, "Z")
}

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

const formSchema = z.object({
  date: z.date({ error: "Date is required." }),
  runName: z.string().min(1, { message: "Name is required." }),
  runType: z.enum(["pickup", "delivery"], {
    message: "Run type is required.",
  }),
})

export function GenerateRunSheet<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [apiKey, setApiKey] = useState("")

  // Load API key from localStorage on mount
  useEffect(() => {
    if (globalThis.window !== undefined) {
      const savedKey = globalThis.localStorage.getItem(STORAGE_KEY)
      if (savedKey) {
        setApiKey(savedKey)
      }
    }
  }, [])

  // Selected rows from the table
  const rowsLength = table.getSelectedRowModel().rows.length
  const selectedOrders = useMemo(
    () => table.getSelectedRowModel().rows.map((row) => row.original as Order),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rowsLength]
  )

  // Determine eligible run types based on selected orders
  const eligibleRunTypes = useMemo(() => {
    if (selectedOrders.length === 0) {
      return { pickup: false, delivery: false }
    }

    const hasOrderConfirmed = selectedOrders.some(
      (order) => order.status === "order_confirmed"
    )
    const hasReadyForDelivery = selectedOrders.some(
      (order) => order.status === "ready_for_delivery"
    )

    return {
      pickup: hasOrderConfirmed,
      delivery: hasReadyForDelivery,
    }
  }, [selectedOrders])

  // Fetch vendors to get pickup window information
  const { isLoading: isVendorsLoading, data: vendors } = useQuery({
    queryKey: ["vendors"],
    queryFn: () => getVendors(),
    enabled: isOpen,
  })

  const { isLoading: isRunsLoading, data: runs } = useQuery({
    queryKey: ["runs", apiKey],
    queryFn: () => getRuns(apiKey),
    enabled: !!apiKey && isOpen,
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      runName: "",
    },
  })

  // Watch the runType field to filter orders
  const selectedRunType = form.watch("runType")

  // Filter orders based on selected run type
  const filteredOrders = useMemo(() => {
    if (!selectedRunType) return selectedOrders

    if (selectedRunType === "pickup") {
      return selectedOrders.filter(
        (order) => order.status === "order_confirmed"
      )
    } else if (selectedRunType === "delivery") {
      return selectedOrders.filter(
        (order) => order.status === "ready_for_delivery"
      )
    }

    return selectedOrders
  }, [selectedOrders, selectedRunType])

  // Derive time windows from vendors of selected orders
  const derivedTimeWindows = useMemo(() => {
    if (!vendors || filteredOrders.length === 0) {
      return { start: null, end: null }
    }

    // Get unique vendor IDs from filtered orders
    const vendorIds = new Set(filteredOrders.map((order) => order.vendor_id))

    // Filter vendors that have orders selected
    const relevantVendors = vendors.filter((v) => vendorIds.has(v.id))

    if (relevantVendors.length === 0) {
      return { start: null, end: null }
    }

    // Find earliest start time and latest end time
    let earliestStart: string | null = null
    let latestEnd: string | null = null

    for (const vendor of relevantVendors) {
      if (vendor.pickup_window_start) {
        if (!earliestStart || vendor.pickup_window_start < earliestStart) {
          earliestStart = vendor.pickup_window_start
        }
      }
      if (vendor.pickup_window_end) {
        if (!latestEnd || vendor.pickup_window_end > latestEnd) {
          latestEnd = vendor.pickup_window_end
        }
      }
    }

    return { start: earliestStart, end: latestEnd }
  }, [vendors, filteredOrders])

  // Build a friendly address string from possible fields
  const buildAddress = (o: Order) => {
    const parts = [
      o?.delivery_address_text,
      o?.tole,
      o?.landmark,
      o?.municipality,
      o?.ward ? `Ward ${o.ward}` : undefined,
    ].filter(Boolean)
    return parts.join(", ")
  }

  const derivedRunBookings = useMemo(() => {
    return filteredOrders.map((o: Order, idx: number) => ({
      orderId: o?.order_id || "",
      priority: idx, // simple priority by selection order
      quantity: 1,
      weight: 4,
      length: o?.dimensions?.l ?? 0,
      width: o?.dimensions?.w ?? 0,
      height: o?.dimensions?.h ?? 0,
      customerName: o?.recipient_name || "",
      contactNumber: o?.recipient_phone || "",
      latitude: o?.lat || 0,
      longitude: o?.lng || 0,
      address: buildAddress(o) || "",
    }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredOrders.length])

  const mutation = useMutation({
    mutationFn: (data: Parameters<typeof generateRun>[0]) => generateRun(data),
    onSuccess: () => {
      toast.success("Run generated successfully!")
      form.reset()
      table.resetRowSelection()
      setIsOpen(false)
    },
    onError: () => {
      toast.error("Failed to generate run. Please try again.")
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { date, runType, ...rest } = values

    // Use derived time windows from vendors
    const runStartTime = derivedTimeWindows.start
      ? toUtcIso(date, derivedTimeWindows.start)
      : toUtcIso(date, "09:00") // fallback

    const runEndTime = derivedTimeWindows.end
      ? toUtcIso(date, derivedTimeWindows.end)
      : toUtcIso(date, "17:00") // fallback

    const payload = {
      ...rest,
      runStartTime,
      runEndTime,
      readyToPickupTime: runStartTime,
      runBookings: derivedRunBookings,
      runType,
      apiKey,
    }
    mutation.mutate(payload)
  }

  const hasSelection = selectedOrders.length > 0

  const handleGenerateRun = () => {
    if (!apiKey) {
      toast.error("Please configure your Route360 API key in Settings first", {
        action: {
          label: "Go to Settings",
          onClick: () => router.push("/settings"),
        },
      })
      return
    }
    setIsOpen(true)
  }

  const getButtonTitle = () => {
    if (hasSelection && apiKey) return undefined
    if (!hasSelection) return "Select one or more orders"
    return "Configure API key in Settings"
  }

  return (
    <>
      <Button
        size="sm"
        disabled={!hasSelection}
        title={getButtonTitle()}
        onClick={handleGenerateRun}
      >
        Generate Run
      </Button>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="sm:max-w-[540px]">
          <SheetHeader>
            <SheetTitle>Generate Run</SheetTitle>
            <SheetDescription>
              Create a run for {selectedOrders.length} selected order
              {selectedOrders.length === 1 ? "" : "s"}.
              <br />
              <span className="font-medium">Pickup runs:</span> Collect orders
              from vendors
              <br />
              <span className="font-medium">Delivery runs:</span> Deliver orders
              to customers
              {!apiKey && (
                <span className="block mt-2 text-yellow-600 dark:text-yellow-500">
                  ⚠️ API key not configured. Please{" "}
                  <Link href="/settings" className="font-medium underline">
                    configure your Route360 API key
                  </Link>{" "}
                  in Settings.
                </span>
              )}
            </SheetDescription>
          </SheetHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 p-4"
            >
              <FormField
                control={form.control}
                name="runType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Run Type</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select run type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem
                            value="pickup"
                            disabled={!eligibleRunTypes.pickup}
                          >
                            Pickup Run
                            {!eligibleRunTypes.pickup && (
                              <span className="text-xs text-muted-foreground ml-0.5">
                                (No confirmed orders)
                              </span>
                            )}
                          </SelectItem>
                          <SelectItem
                            value="delivery"
                            disabled={!eligibleRunTypes.delivery}
                          >
                            Delivery Run
                            {!eligibleRunTypes.delivery && (
                              <span className="text-xs text-muted-foreground ml-0.5">
                                (No picked up orders)
                              </span>
                            )}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>
                      Pickup runs collect orders from vendors. Delivery runs
                      deliver to customers.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="runName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Run Name</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Route360 configured run" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {runs?.map((run) => (
                            <SelectItem value={run.name} key={run.id}>
                              {run.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>
                      You can manage runs in your Route360 portal
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < startOfToday()}
                          captionLayout="dropdown"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Display derived time windows */}
              <div className="rounded-md border p-3 text-sm bg-muted/50">
                <h4 className="font-medium mb-2">
                  Derived Time Windows (from vendors)
                </h4>
                <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                  <div>
                    <span className="font-medium">Start Time:</span>{" "}
                    {derivedTimeWindows.start ?? "09:00"}
                  </div>
                  <div>
                    <span className="font-medium">End Time:</span>{" "}
                    {derivedTimeWindows.end ?? "17:00"}
                  </div>
                </div>
                {!isVendorsLoading &&
                  !isRunsLoading &&
                  (!derivedTimeWindows.start || !derivedTimeWindows.end) && (
                    <p className="mt-2 text-xs text-yellow-600 dark:text-yellow-500">
                      ⚠️ Some vendors don&apos;t have pickup windows configured.
                      Using default times (9:00 AM - 5:00 PM).
                    </p>
                  )}
              </div>

              <div className="rounded-md border p-3 text-sm text-muted-foreground">
                {(() => {
                  const statusLabel =
                    selectedRunType === "pickup" ? "confirmed" : "picked up"

                  let orderTypeLabel = "selected orders"
                  if (selectedRunType === "pickup") {
                    orderTypeLabel = "confirmed orders"
                  } else if (selectedRunType === "delivery") {
                    orderTypeLabel = "ready-for-delivery orders"
                  }

                  if (derivedRunBookings.length === 0) {
                    return (
                      <p>
                        {selectedRunType
                          ? `No orders with ${statusLabel} status in your selection.`
                          : "Select a run type to see eligible orders."}
                      </p>
                    )
                  }

                  return (
                    <>
                      <p>
                        {derivedRunBookings.length} booking
                        {derivedRunBookings.length === 1 ? "" : "s"} will be
                        generated from {orderTypeLabel}.
                      </p>
                      {filteredOrders.length < selectedOrders.length && (
                        <p className="mt-2 text-xs text-yellow-600 dark:text-yellow-500">
                          ⚠️ {selectedOrders.length - filteredOrders.length}{" "}
                          order(s) filtered out due to incompatible status.
                        </p>
                      )}
                    </>
                  )
                })()}
              </div>
              <SheetFooter className="px-0">
                <div className="flex items-center gap-2">
                  <Button
                    type="submit"
                    disabled={
                      mutation.isPending ||
                      !hasSelection ||
                      !apiKey ||
                      derivedRunBookings.length === 0
                    }
                  >
                    {mutation.isPending ? "Generating..." : "Generate Run"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                    disabled={mutation.isPending}
                  >
                    Cancel
                  </Button>
                </div>
              </SheetFooter>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
    </>
  )
}
