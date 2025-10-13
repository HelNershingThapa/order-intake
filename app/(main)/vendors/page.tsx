import { getVendors } from "./actions";
import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";

export default async function Page() {
  const vendors = await getVendors();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Vendors</h2>
          <p className="text-muted-foreground">Manage your vendors list.</p>
        </div>
      </div>
      <DataTable data={vendors} columns={columns} />
    </div>
  );
}
