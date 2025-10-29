import { ApiKeyForm } from "./components/api-key-form"
import { AdminProfileForm } from "./components/admin-profile-form"
import { getCurrentUser } from "@/app/actions"
import { getPickupWindows } from "./actions"

export default async function Page() {
  const [{ admin }, pickupWindows] = await Promise.all([
    getCurrentUser(),
    getPickupWindows(),
  ])

  return (
    <>
      <AdminProfileForm admin={admin} pickupWindows={pickupWindows} />
      <ApiKeyForm />
    </>
  )
}
