import { redirect } from "next/navigation";
import AppBarChart from "@/components/AppBarChart";
import CardList from "@/components/CardList";
import AppPieChart from "@/components/AppPieChart";
import TodoList from "@/components/TodoList";
import AppAreaChart from "@/components/AppAreaChart";
import { cookies } from "next/headers";

interface VendorData {
  id: string;
  name: string;
  contact_name: string;
  contact_phone: string;
  pickup_address_text: string;
  pickup_lat: number;
  pickup_lon: number;
  pickup_window_start: string;
  pickup_window_end: string;
  is_active: boolean;
}

export default async function VendorDashboardPage() {
  const apiKey = (await cookies()).get("api_key")?.value;
  if (!apiKey) redirect("/vendor");

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL!;
  const res = await fetch(`${baseUrl.replace(/\/$/, "")}/vendor/me`, {
    method: "GET",
    headers: { "X-API-Key": apiKey, Accept: "application/json" },
    cache: "no-store",
  });

  if (!res.ok) redirect("/vendor/login");
  const vendor = await res.json();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
      <div className="bg- bg-primary-foreground p-4 rounded-lg lg:col-span-2 ">
        <AppBarChart />
      </div>
      <div className="bg- bg-primary-foreground p-4 rounded-lg">
        <CardList title="Latest Transactions" />
      </div>
      <div className="bg- bg-primary-foreground p-4 rounded-lg">
        <AppPieChart></AppPieChart>
      </div>
      <div className="bg- bg-primary-foreground p-4 rounded-lg">
        <TodoList />
      </div>
      <div className="bg- bg-primary-foreground p-4 rounded-lg lg:col-span-2">
        <AppAreaChart />
      </div>
      <div className="bg- bg-primary-foreground p-4 rounded-lg">
        <CardList title="Popular Content" />
      </div>
    </div>
  );
}
