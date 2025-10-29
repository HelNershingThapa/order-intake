import { CardDescription } from "@/components/ui/card";

import CreateVendorFormClient from "./components/vendor-form";

export default function NewVendorPage() {
  return (
    <div className="flex justify-center p-10">
      <div className="w-full max-w-2xl space-y-2">
        <h1 className="text-2xl font-semibold">Add Vendor</h1>
        <CardDescription>
          Provide vendor details and select the pickup location on the map.
        </CardDescription>
        <CreateVendorFormClient />
      </div>
    </div>
  );
}
