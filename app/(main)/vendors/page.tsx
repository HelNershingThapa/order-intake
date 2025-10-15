import { getVendors } from "./actions";
import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";

export default async function Page() {
  const vendors = await getVendors();

  return <DataTable data={vendors} columns={columns} />;
}
