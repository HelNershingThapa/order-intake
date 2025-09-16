import { CardDescription } from "@/components/ui/card";
import OrderForm from "@/components/orders/order-form";
import { getOrder } from "@/lib/order-service";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

function EditFormSkeleton() {
  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-6">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2" />
        <div className="h-4 w-64 bg-gray-100 rounded animate-pulse" />
      </div>
      <div className="border rounded-lg p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    </div>
  );
}

async function EditOrderContent({ id }: { id: string }) {
  try {
    const order = await getOrder(id);

    return (
      <div className="mx-auto max-w-4xl p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Edit Order</h1>
          <CardDescription>Update order details for #{id}</CardDescription>
        </div>
        <OrderForm mode="edit" initialData={order} />
      </div>
    );
  } catch (error) {
    notFound();
  }
}

export default function EditOrderPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<EditFormSkeleton />}>
      <EditOrderContent id={params.id} />
    </Suspense>
  );
}
