import { StaffMenuClient } from "@/components/menu/StaffMenuClient";
import { StaffNavigation } from "@/components/navigation/StaffNavigation";
import { requireAuth } from "@/utils/auth";

export default async function StaffMenuPage() {
  const user = await requireAuth();

  // Only allow staff with menu management permissions
  if (!user.canManageMenu) {
    return (
      <div className="min-h-screen bg-gray-50">
        <StaffNavigation user={user} />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Access Denied
            </h1>
            <p className="text-gray-600">
              You don't have permission to manage the menu.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <StaffNavigation user={user} />
      <StaffMenuClient staff={user} />
    </div>
  );
}
