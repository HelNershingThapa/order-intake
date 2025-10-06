import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, startOfToday } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { Order } from "@/types/order";
import { generateRun, getRuns } from "@/lib/generate-run";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

const formSchema = z.object({
  date: z.date({ error: "Date is required." }),
  runStartTime: z.iso.time({ error: "Pickup time is required." }),
  runEndTime: z.iso.time({ error: "End time is required." }),
  readyToPickupTime: z.iso.time({ error: "Pickup time is required." }),
  runName: z.string().min(1, { message: "Name is required." }),
});

export function GenerateRunSheet<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const [isOpen, setIsOpen] = useState(false);
  const [apiKeyDialogOpen, setApiKeyDialogOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [apiKeyInput, setApiKeyInput] = useState("");
  // Selected rows from the table
  const selectedOrders = useMemo(
    () => table.getSelectedRowModel().rows.map((row) => row.original as Order),
    [table.getSelectedRowModel().rows.length],
  );
  const { data: runs } = useQuery({
    queryKey: ["runs", apiKey],
    queryFn: () => getRuns(apiKey),
    enabled: !!apiKey,
  });

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      runStartTime: "",
      runEndTime: "",
      readyToPickupTime: "",
    },
  });

  // Build a friendly address string from possible fields
  const buildAddress = (o: any) => {
    const parts = [
      o?.delivery_address_text,
      o?.tole,
      o?.landmark,
      o?.municipality,
      o?.ward ? `Ward ${o.ward}` : undefined,
    ].filter(Boolean);
    return parts.join(", ");
  };

  const derivedRunBookings = useMemo(() => {
    return selectedOrders.map((o: any, idx: number) => ({
      orderId: o?.order_id || o?.id || "",
      priority: idx, // simple priority by selection order
      quantity: 1,
      weight: 4,
      length: o?.dimensions?.l ?? 0,
      width: o?.dimensions?.w ?? 0,
      height: o?.dimensions?.h ?? 0,
      customerName: o?.recipient_name || "",
      contactNumber: o?.recipient_phone || "",
      address: buildAddress(o) || "",
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOrders.length]);

  const mutation = useMutation({
    mutationFn: (data: any) => generateRun(data),
    onSuccess: () => {
      toast.success("Run generated successfully!");
      form.reset();
      table.resetRowSelection();
      setIsOpen(false);
    },
    onError: () => {
      toast.error("Failed to generate run. Please try again.");
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Helper to combine selected date with a HH:mm time string into UTC ISO without milliseconds
    const toUtcIso = (date: Date, time: string) => {
      const [hStr = "0", mStr = "0", sStr = "0"] = time.split(":");
      const y = date.getFullYear();
      const m = date.getMonth();
      const d = date.getDate();
      const hh = Number(hStr);
      const mm = Number(mStr);
      const ss = Number(sStr) || 0;
      return new Date(Date.UTC(y, m, d, hh, mm, ss))
        .toISOString()
        .replace(/\.\d{3}Z$/, "Z");
    };

    const { date, runStartTime, runEndTime, readyToPickupTime, ...rest } =
      values;

    const payload = {
      ...rest,
      runStartTime: toUtcIso(date, runStartTime),
      runEndTime: toUtcIso(date, runEndTime),
      readyToPickupTime: toUtcIso(date, readyToPickupTime),
      runBookings: derivedRunBookings,
      apiKey,
    }; // payload matches CreateRunRequest
    mutation.mutate(payload);
  }

  const hasSelection = selectedOrders.length > 0;

  return (
    <>
      <Button
        size="sm"
        disabled={!hasSelection}
        title={!hasSelection ? "Select one or more orders" : undefined}
        onClick={() => setApiKeyDialogOpen(true)}
      >
        Generate Run
      </Button>
      <Dialog open={apiKeyDialogOpen} onOpenChange={setApiKeyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Route360 Auth Token</DialogTitle>
            <DialogDescription>
              This key will be used to fetch configured runs and generate the
              run. You can find your token in your Route360 portal under
              Settings → API Config.{" "}
              <a
                href="https://vrs.baato.io/dashboard/settings/api-config"
                target="_blank"
                rel="noreferrer noopener"
                className="font-medium underline"
              >
                Open API Config
              </a>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Input
              type="password"
              placeholder="••••••••"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
            />
          </div>
          <DialogFooter>
            <div className="flex w-full items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setApiKeyInput("");
                  setApiKeyDialogOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => {
                  if (!apiKeyInput?.trim()) {
                    toast.error("API key is required");
                    return;
                  }
                  setApiKey(apiKeyInput.trim());
                  setApiKeyDialogOpen(false);
                  setIsOpen(true);
                }}
              >
                Continue
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="sm:max-w-[540px]">
          <SheetHeader>
            <SheetTitle>Generate Run</SheetTitle>
            <SheetDescription>
              Create a delivery run for {selectedOrders.length} selected order
              {selectedOrders.length === 1 ? "" : "s"}. Review details and
              submit to generate the run in Baato VRS.
            </SheetDescription>
          </SheetHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 p-4"
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                                !field.value && "text-muted-foreground",
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
                <FormField
                  control={form.control}
                  name="runStartTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="runEndTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="readyToPickupTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pickup Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="rounded-md border p-3 text-sm text-muted-foreground">
                {derivedRunBookings.length === 0 ? (
                  <p>
                    No orders selected. Select orders from the table to include
                    in this run.
                  </p>
                ) : (
                  <p>
                    {derivedRunBookings.length} booking
                    {derivedRunBookings.length === 1 ? "" : "s"} will be
                    generated from selected orders.
                  </p>
                )}
              </div>
              <SheetFooter>
                <div className="flex items-center gap-2">
                  <Button
                    type="submit"
                    disabled={mutation.isPending || !hasSelection || !apiKey}
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
  );
}
