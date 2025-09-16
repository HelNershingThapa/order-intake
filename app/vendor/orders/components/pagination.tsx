import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { OrderFilters } from "@/app/types/order";

function buildQuery(filters: OrderFilters, page: number): string {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.status && filters.status !== "all")
    params.set("status", filters.status);
  if (filters.geocode_status && filters.geocode_status !== "all")
    params.set("geocode_status", filters.geocode_status);
  params.set("page", page.toString());
  params.set("page_size", (filters.page_size || 20).toString());
  return `?${params.toString()}`;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  filters,
}: {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  filters: OrderFilters;
}) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex items-center justify-between mt-4">
      <div className="text-sm text-muted-foreground">
        Showing {startItem}-{endItem} of {totalItems} orders
      </div>

      <div className="flex items-center gap-2">
        <Button asChild variant="outline" size="sm" disabled={currentPage <= 1}>
          <Link href={buildQuery(filters, currentPage - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>

        <div className="text-sm font-medium px-3 py-1 bg-primary text-primary-foreground rounded">
          {currentPage}
        </div>

        <Button
          asChild
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages}
        >
          <Link href={buildQuery(filters, currentPage + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
