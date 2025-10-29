import { serverFetch } from "@/lib/serverFetch";
import type { Vendor } from "@/types/miscellaneous";

import type { VendorFormData } from "./new/components/vendor-form";

export const getVendors = async () => {
  return await serverFetch<Vendor[]>(`/admin/vendors`);
};

type VendorCreationResponse = {
  message: string;
  vendor_id: string;
  user_id: string;
};

export async function createVendor(
  data: VendorFormData,
): Promise<VendorCreationResponse> {
  return serverFetch<VendorCreationResponse>(
    "/admin/create-vendor",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
    true,
  );
}
