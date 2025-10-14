import { getCurrentUser } from "@/app/actions";
import VendorProfileForm from "./components/vendor-profile-form";

export default async function Page() {
  const profile = await getCurrentUser();

  return (
    <div className="self-center space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">My Profile</h2>
        <p className="text-muted-foreground">Manage your profile info</p>
      </div>
      <VendorProfileForm vendor={profile.vendor} />
    </div>
  );
}
