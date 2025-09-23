import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar, MapPin, Package, Pencil, Plus } from "lucide-react";
import { getOrders } from "@/lib/order-service";
import { OrderFilters } from "@/types/order";
import { FilterBar } from "./filter-bar";
import { Pagination } from "./pagination";
import { DeleteOrderButton } from "./delete-order-dialog";
import { Suspense } from "react";

function parseFilters(searchParams: any): OrderFilters {
  return {
    search: searchParams.search || "",
    status: ["draft", "needs_geocode", "ready"].includes(searchParams.status)
      ? searchParams.status
      : "all",
    geocode_status: ["pending", "ok", "failed"].includes(
      searchParams.geocode_status,
    )
      ? searchParams.geocode_status
      : "all",
    page: Math.max(1, parseInt(searchParams.page) || 1),
    page_size: Math.max(1, parseInt(searchParams.page_size) || 20),
  };
}

function GeocodeBadge({ status }: { status: string }) {
  const variant =
    {
      ok: "default",
      pending: "secondary",
      failed: "destructive",
    }[status] || "outline";

  const label =
    {
      ok: "Resolved",
      pending: "Needs Address",
      failed: "Failed",
    }[status] || status;

  return <Badge variant={variant as any}>{label}</Badge>;
}

export async function OrdersContent({ searchParams }: { searchParams: any }) {
  const filters = parseFilters(searchParams);
  const data = await getOrders(filters);

  const totalPages = Math.ceil(data.total / data.page_size);
  const geocodedCount = data.items.filter(
    (o) => o.geocode_status === "ok",
  ).length;
  const needsAttentionCount = data.items.filter((o) =>
    ["pending", "failed"].includes(o.geocode_status),
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-muted-foreground">
            Manage and track all your orders
          </p>
        </div>
        <Link href="/vendor/orders/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Order
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Geocoded</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{geocodedCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Need Attention
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{needsAttentionCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <FilterBar filters={filters} />
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Orders ({data.items.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Geocode</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="text-muted-foreground">
                        {filters.search ||
                        filters.status !== "all" ||
                        filters.geocode_status !== "all"
                          ? "No orders match your filters."
                          : "No orders found."}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  data.items.map((order) => (
                    <TableRow key={order.order_id}>
                      <TableCell className="font-mono text-sm">
                        {order.order_id}
                      </TableCell>
                      <TableCell className="capitalize">
                        {order.status}
                      </TableCell>
                      <TableCell>
                        <GeocodeBadge status={order.geocode_status} />
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(order.created_at).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button asChild variant="ghost" size="sm">
                            <Link href={`/vendor/orders/${order.order_id}`}>
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Link>
                          </Button>
                          <DeleteOrderButton orderId={order.order_id} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {data.total > 0 && (
            <Suspense fallback={<div>Loading pagination </div>}>
              <Pagination
                currentPage={data.page}
                totalPages={totalPages}
                totalItems={data.total}
                itemsPerPage={data.page_size}
                filters={filters}
              />
            </Suspense>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
