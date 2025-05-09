import { QRCodeView } from "@/components/qr-comps/qrview";
import Header from "@/components/shared/header";
import type { Params } from "@/types/pages";
import db from "@platter/db";
import { notFound } from "next/navigation";

async function Page({ params }: { params: Params }) {
  const { qrId } = await params;
  // console.log(qrId);

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
      id: user.id,
      name: user.name,
      cuisine: user.cuisine,
      hours:
        user.openingHours && user.closingHours
          ? `${user.openingHours} - ${user.closingHours}`
          : undefined,
      icon: user.icon,
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
      <Header restaurantName={user.name} reviewLink={user.googleReivewLink} />
      <QRCodeView qrId={qrId} config={pageConfig} />
    </>
  );
}

export default Page;