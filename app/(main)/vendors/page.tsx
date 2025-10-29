import { getVendors } from "./actions";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";

export default async function Page() {
  const vendors = await getVendors();

  return <DataTable data={vendors} columns={columns} />;
}
