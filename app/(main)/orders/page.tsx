import { cookies } from "next/headers"

import { columns } from "@/components/orders/columns"
import { DataTable } from "@/components/orders/data-table"
import { getOrders } from "@/lib/order-service"
import { decrypt } from "@/lib/session"

import { getVendors } from "../vendors/actions"
import { loadSearchParams } from "./searchParams"

export default async function OrdersPage(props: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await loadSearchParams(props.searchParams)
  const session = (await cookies()).get("session")?.value
  const user = await decrypt(session)

  const [ordersResponse, vendors] = await Promise.all([
    getOrders(params),
    getVendors(),
  ])

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
        vendors={vendors}
      />
    </div>
  )
}
