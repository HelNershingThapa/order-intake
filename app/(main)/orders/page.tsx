import { getOrders } from "@/lib/order-service"
import { columns } from "@/components/orders/columns"
import { DataTable } from "@/components/orders/data-table"
import { cookies } from "next/headers"
import { decrypt } from "@/lib/session"
import { loadSearchParams } from "./searchParams"
import { OrderStatus } from "@/types/order"

type SearchParams = {
  search?: string
  statuses?: OrderStatus[]
  geocode_status?: string
  page?: string
  page_size?: string
  vendor_id?: string
}

export default async function OrdersPage(props: {
  searchParams: Promise<SearchParams>
}) {
  const params = await loadSearchParams(props.searchParams)
  const ordersResponse = await getOrders(params, true)
  const session = (await cookies()).get("session")?.value
  const user = await decrypt(session)

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
  )
}
