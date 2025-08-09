import getServerSession from "@/lib/auth/server";
import ManageStaffClient from "./manage-staff-client";

export default async function ManageStaffPage() {
  const session = await getServerSession();
  const restaurantId = session?.session?.userId;

  if (!restaurantId) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="text-muted-foreground mt-2">
            You must be logged in to access this page.
          </p>
        </div>
      </div>
    );
  }

  return <ManageStaffClient restaurantId={restaurantId} />;
}
