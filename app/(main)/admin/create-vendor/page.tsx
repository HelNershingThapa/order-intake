import CreateVendorFormClient from "@/components/admin/vendor-form";
import { CardDescription } from "@/components/ui/card";

export default function CreateVendorPage() {
  return (
    <div className="flex justify-center p-10">
      <div className="w-full max-w-2xl space-y-2">
        <h1 className="text-2xl font-semibold">Create Vendor</h1>
        <CardDescription>
          Provide vendor details and select the pickup location on the map.
        </CardDescription>
        <CreateVendorFormClient />
      </div>
    </div>
  );
}
