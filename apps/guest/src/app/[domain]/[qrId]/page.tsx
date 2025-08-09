import { EnhancedQRView } from "@/components/qr-comps/enhanced-qr-view";
import Header from "@/components/shared/header";
import type { Params } from "@/types/pages";
import db from "@platter/db";
import { notFound } from "next/navigation";

async function Page({ params }: { params: Params }): Promise<JSX.Element> {
  const { qrId } = await params;

  // Use qrId to fetch data from the database
  const restaurantDetails = await db.qRCode.findUnique({
    where: {
      id: qrId,
    },
    include: {
      table: {
        select: {
          id: true,
          number: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          description: true,
          image: true,
          icon: true,
          cuisine: true,
          openingHours: true,
          closingHours: true,
          googleReviewLink: true,
          address: true,
          city: true,
          state: true,
          zipCode: true,
          phone: true,
          email: true,
          website: true,
          seatingCapacity: true,
        },
      },
    },
  });

  // Check if restaurantDetails AND user exists
  if (!restaurantDetails || !restaurantDetails.user) {
    return notFound();
  }

  // Now TypeScript knows that user exists
  const { user } = restaurantDetails;

  // Configure page using restaurantDetails
  const pageConfig = {
    title:
      restaurantDetails.target === "table"
        ? `${user.name} Table ${restaurantDetails.targetNumber}`
        : restaurantDetails.target === "menu"
          ? "Restaurant Menu"
          : user.name,
    description: user.description || `Welcome to ${user.name}`,
    restaurantInfo: {
      name: user.name,
      icon: user.icon,
      image: user.image,
      cuisine: user.cuisine,
      openingHours: user.openingHours || undefined,
      closingHours: user.closingHours || undefined,
      googleReviewLink: user.googleReviewLink || undefined,
      address: user.address || undefined,
      city: user.city || undefined,
      state: user.state || undefined,
      zipCode: user.zipCode || undefined,
      phone: user.phone || undefined,
      email: user.email || undefined,
      website: user.website || undefined,
      seatingCapacity: user.seatingCapacity || undefined,
      // Additional field for backward compatibility
      hours:
        user.openingHours && user.closingHours
          ? `${user.openingHours} - ${user.closingHours}`
          : undefined,
    },
    buttons: [
      {
        label: "Restaurant Menu",
        href: "/menu",
        variant: "default" as const,
      },
      {
        label: "View Orders",
        href: "/orders",
        variant: "outline" as const,
      },
      {
        label: "Submit Review",
        href: "/review",
        variant: "secondary" as const,
      },
      {
        label: "Submit Complaint",
        href: "/complaint",
        variant: "secondary" as const,
      },
    ],
  };

  return (
    <>
      <Header restaurantName={user.name} reviewLink={user.googleReviewLink} />
      <EnhancedQRView
        qrId={qrId}
        config={pageConfig}
        userId={user.id}
        tableNumber={restaurantDetails.targetNumber}
      />
    </>
  );
}

export default Page;
