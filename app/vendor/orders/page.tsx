import { Suspense } from "react";
import { OrdersLoading } from "./components/order-loading";
import { OrdersContent } from "./components/orders-content";

type SearchParams = {
  search?: string;
  status?: string;
  geocode_status?: string;
  page?: string;
  page_size?: string;
};

export default function OrdersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <Suspense fallback={<OrdersLoading />}>
      <OrdersContent searchParams={searchParams} />
    </Suspense>
  );
}
