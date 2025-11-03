import { CardDescription } from "@/components/ui/card"

import { CreateAdminForm } from "./components/admin-form"

export default function NewAdminPage() {
  return (
    <div className="flex justify-center p-10">
      <div className="w-full max-w-2xl space-y-2">
        <h1 className="text-2xl font-semibold">Add Admin</h1>
        <CardDescription>
          Provide details of the new logistics provider admin to create an
          account.
        </CardDescription>
        <CreateAdminForm />
      </div>
    </div>
  )
}
