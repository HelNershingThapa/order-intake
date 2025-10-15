import { getOrders } from "@/lib/order-service";
import { columns } from "@/components/orders/columns";
import { DataTable } from "@/components/orders/data-table";
import type { OrderFilters } from "@/types/order";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";

type SearchParams = {
  search?: string;
  status?: string;
  geocode_status?: string;
  page?: string;
  page_size?: string;
};

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

export default async function OrdersPage(props: {
  searchParams?: Promise<SearchParams>;
}) {
  const searchParams = await props.searchParams;
  const filters = parseFilters(searchParams);
  const ordersResponse = await getOrders(filters, true);
  const session = (await cookies()).get("session")?.value;
  const user = await decrypt(session);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Orders</h2>
          <p className="text-muted-foreground">
            Manage and track all your orders!
          </p>
        </div>
      </div>
      <DataTable
        data={ordersResponse}
        columns={columns}
        isAdmin={user?.role === "admin"}
      />
    </div>
  );
}
