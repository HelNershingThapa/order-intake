import OrderForm from "@/components/orders/order-form";
import { CardDescription } from "@/components/ui/card";

export default function NewOrderPage() {
  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Add Order</h1>
        <CardDescription>
          Fill the recipient & delivery details.
        </CardDescription>
      </div>
      <OrderForm mode="create" />
    </div>
  );
}
