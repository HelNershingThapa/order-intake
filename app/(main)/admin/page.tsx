import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md shadow-lg p-6">
        <CardContent className="space-y-6">
          <h1 className="text-3xl font-bold text-center">Admin Dashboard</h1>
          <p className="text-gray-600 text-center">
            Manage vendors and their API keys from here.
          </p>
          <div className="flex flex-col gap-4">
            <Link href="/admin/create-vendor">
              <Button className="w-full">Create New Vendor</Button>
            </Link>
            <Link href="/vendor">
              <Button className="w-full" variant="outline">
                Go to Vendor Login
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
