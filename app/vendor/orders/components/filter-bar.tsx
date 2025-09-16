"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { OrderFilters } from "@/app/types/order";

export function FilterBar({ filters }: { filters: OrderFilters }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [searchValue, setSearchValue] = useState(filters.search || "");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(() => {
      const formData = new FormData(e.currentTarget);
      const params = new URLSearchParams();

      const search = formData.get("search")?.toString().trim();
      const status = formData.get("status")?.toString();
      const geocodeStatus = formData.get("geocode_status")?.toString();

      if (search) params.set("search", search);
      if (status && status !== "all") params.set("status", status);
      if (geocodeStatus && geocodeStatus !== "all")
        params.set("geocode_status", geocodeStatus);
      params.set("page", "1");
      params.set("page_size", filters.page_size?.toString() || "20");

      router.push(`/vendor/orders?${params.toString()}`);
    });
  };

  const clearFilters = () => {
    startTransition(() => {
      setSearchValue("");
      router.push("/vendor/orders");
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <Input
          name="search"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search orders..."
          disabled={isPending}
        />
      </div>

      {/* <Select name="status" defaultValue={filters.status} disabled={isPending}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Order Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="draft">Draft</SelectItem>
          <SelectItem value="needs_geocode">Needs Geocode</SelectItem>
          <SelectItem value="ready">Ready</SelectItem>
        </SelectContent>
      </Select> */}

      <Select
        name="geocode_status"
        defaultValue={filters.geocode_status}
        disabled={isPending}
      >
        <SelectTrigger className="w-52">
          <SelectValue placeholder="Geocode Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Geocode Status</SelectItem>
          <SelectItem value="ok">Resolved</SelectItem>
          <SelectItem value="pending">Needs Address</SelectItem>
          <SelectItem value="failed">Failed</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex gap-2">
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Apply
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={clearFilters}
          disabled={isPending}
        >
          Clear
        </Button>
      </div>
    </form>
  );
}
