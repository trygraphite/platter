import { StaffNavigation } from "@/components/navigation/StaffNavigation";
import { requireAuth } from "@/utils/auth";

export default async function StaffReportsPage() {
  const user = await requireAuth();

  // Only allow staff with report viewing permissions
  if (!user.canViewReports) {
    return (
      <div className="min-h-screen bg-gray-50">
        <StaffNavigation user={user} />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Access Denied
            </h1>
            <p className="text-gray-600">
              You don't have permission to view reports.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <StaffNavigation user={user} />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Reports & Analytics
            </h1>
            <p className="text-gray-600">
              Reports and analytics functionality coming soon...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
