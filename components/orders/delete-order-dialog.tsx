"use client";

import { type Dispatch, type SetStateAction } from "react";
import { useRouter } from "next/navigation";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import { deleteOrder } from "@/lib/order-service";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

export function DeleteOrderButton({
  orderId,
  setIsOpen,
}: {
  orderId: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (orderId: string) => deleteOrder(orderId),
    onSuccess: () => {
      toast.success("Order deleted successfully");
      setIsOpen(false);
      router.refresh();
    },
    onError: () => {
      toast.error("Failed to delete order");
    },
  });

  const handleDelete = () => {
    mutation.mutate(orderId);
  };

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete your order
          &nbsp;<span className="font-medium">{orderId}</span>&nbsp;and remove
          its data from our servers.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel disabled={mutation.isPending}>
          Cancel
        </AlertDialogCancel>
        <AlertDialogAction
          onClick={handleDelete}
          disabled={mutation.isPending}
          className="bg-destructive text-white hover:bg-destructive/90"
        >
          {mutation.isPending && (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          )}
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
