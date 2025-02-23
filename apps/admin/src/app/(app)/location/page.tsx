import { LocationAdmin } from "@/components/location/LocationAdmin";
import { LocationUser } from "@/components/location/LocationUser";
import getServerSession from "@/lib/auth/server";
import db from "@platter/db";

export default async function LocationsPage() {
  const user = await getServerSession();

  if (!user?.user) {
    return <div>Unauthorized</div>;
  }

  const [userData, locations] = await Promise.all([
    db.user.findUnique({
      where: { id: user.user.id },
      select: { role: true },
    }),
    db.location.findMany({
      include: { users: true },
    }),
  ]);

  const restaurants =
    userData?.role === "ADMIN"
      ? await db.user.findMany({
          where: { role: "RESTAURANT" },
        })
      : [];

  return (
    <div className="container mx-auto py-8">
      {userData?.role === "ADMIN" && (
        <LocationAdmin restaurants={restaurants} />
      )}
      <LocationUser initialLocations={locations} />
    </div>
  );
}