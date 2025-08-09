import ManageServicePointPage from "@/components/modules/manage-service-point/page";
import getServerSession from "@/lib/auth/server";

const page = async () => {
  const session = await getServerSession();
  const userId = session?.session?.userId;

  if (!userId) {
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

  return (
    <div>
      <ManageServicePointPage params={{ restaurantId: userId }} />
    </div>
  );
};

export default page;
