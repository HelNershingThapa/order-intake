"use server";

import { revalidateTag } from "next/cache";

import { serverFetch } from "@/lib/serverFetch";

export const confirmOrders = async (orderIds: string[]) => {
  const res = await serverFetch("/orders/confirm", {
    method: "PATCH",
    body: JSON.stringify({
      order_ids: orderIds,
      status: "order_confirmed",
    }),
  });
  revalidateTag("orders");
  return res;
};
