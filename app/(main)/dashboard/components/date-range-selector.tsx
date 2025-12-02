"use client";

import * as React from "react";
import { type DateRange } from "react-day-picker";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { dateRanges, TimeRange } from "./config";

function parseDate(str?: string | null): Date | undefined {
  if (!str || str === "all") return undefined;
  const d = new Date(str);
  return isNaN(d.getTime()) ? undefined : d;
}

// Helper: check if from/to match a preset
function getTimeRangeFromParams(
  from: string | null,
  to: string | null,
): TimeRange {
  // If no date params, return '7D' as default
  if (!from && !to) return "7D" as TimeRange;

  for (const [key, value] of Object.entries(dateRanges)) {
    if (value.from === from && value.to === to) {
      return key as TimeRange;
    }
  }
  return "custom";
}

export function DateRangeSelector() {
  const [open, setOpen] = React.useState(false);
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const pathname = usePathname();
  const timeRange = getTimeRangeFromParams(from, to);
  const router = useRouter();

  // Only set dateRange if custom
  const initialDateRange =
    timeRange === "custom" && from && to
      ? { from: parseDate(from), to: parseDate(to) }
      : undefined;

  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(
    initialDateRange,
  );

  // Helper to update the search params for 'from' and 'to' in the URL
  const updateDateParams = (range: DateRange | undefined) => {
    if (!range?.from) return;
    const params = new URLSearchParams(searchParams);
    params.set("from", format(range.from, "yyyy-MM-dd"));
    if (range.to) {
      params.set("to", format(range.to, "yyyy-MM-dd"));
    } else {
      params.delete("to");
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex gap-2">
      {Object.entries(dateRanges).map(([key, value]) => (
        <Button
          key={key}
          size="sm"
          className="rounded-full"
          variant={
            (from === value.from && to === value.to) ||
            (!from && !to && key === "7D")
              ? "default"
              : "outline"
          }
          asChild
        >
          <Link
            href={`/dashboard?from=${value.from}&to=${value.to}`}
            prefetch={false}
            replace
          >
            {key === "ALL" ? "All Time" : key}
          </Link>
        </Button>
      ))}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={timeRange === "custom" ? "default" : "outline"}
            size="sm"
            id="date"
            className="justify-between font-normal"
          >
            <CalendarIcon className="size-4 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={(newRange) => {
              setDateRange(newRange);
              updateDateParams(newRange);
            }}
            numberOfMonths={2}
            className="rounded-lg border shadow-sm"
            hidden={{
              after: new Date(),
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
