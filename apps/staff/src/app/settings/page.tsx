import { StaffNavigation } from "@/components/navigation/StaffNavigation";
import { requireAuth } from "@/utils/auth";

export default async function StaffSettingsPage() {
  const user = await requireAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <StaffNavigation user={user} />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Settings</h1>
            <p className="text-gray-600">
              Settings functionality coming soon...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
