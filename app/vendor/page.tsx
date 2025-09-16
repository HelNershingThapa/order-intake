import Link from "next/link";
import { cookies } from "next/headers";

export default async function VendorHome() {
  const apiKey = (await cookies()).get("api_key")?.value;
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Vendor Portal</h1>
      {!apiKey ? (
        <div className="space-y-4">
          <p>You're not logged in. Add your vendor API key to continue.</p>
          <Link
            href="/vendor/login"
            className="inline-block px-4 py-2 rounded bg-black text-white"
          >
            Login with API key
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">API key set in cookie.</p>
          <div className="flex gap-3">
            <Link
              href="/vendor/orders"
              className="px-4 py-2 rounded bg-black text-white"
            >
              Go to Orders
            </Link>
            <form action="/api/auth/clear-key" method="post">
              <button className="px-4 py-2 rounded border">Logout</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
