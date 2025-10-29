import OrderForm from "@/components/orders/order-form";
import { CardDescription } from "@/components/ui/card";
import { getOrder } from "@/lib/order-service";

export default async function EditOrderPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const order = await getOrder(orderId);

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Edit Order</h1>
        <CardDescription>Update order details for #{orderId}</CardDescription>
      </div>
      <OrderForm mode="edit" initialData={{ ...order, id: orderId }} />
    </div>
  );
}
