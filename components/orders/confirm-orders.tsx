import { useMutation } from "@tanstack/react-query";
import type { Table } from "@tanstack/react-table";
import { Loader2 } from "lucide-react";
import { confirmOrders } from "@/app/(main)/orders/actions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function ConfirmOrders<TData>({ table }: DataTableToolbarProps<TData>) {
  const mutation = useMutation({
    mutationFn: async (orderIds: string[]) => confirmOrders(orderIds),
    onSuccess: () => {
      toast.info(table.getSelectedRowModel().rows.length + " orders confirmed");
    },
    onError: () => {
      toast.error("Error confirming orders");
    },
  });

  const handleConfirm = () => {
    const selection = table.getState().rowSelection;
    const orderIds = Object.keys(selection).filter((key) => selection[key]);
    mutation.mutate(orderIds);
  };

  return (
    <Button
      onClick={handleConfirm}
      size="sm"
      disabled={
        mutation.isPending || table.getSelectedRowModel().rows.length === 0
      }
    >
      {mutation.isPending && <Loader2 className="animate-spin size-4" />}Confirm
      Orders
    </Button>
  );
}
