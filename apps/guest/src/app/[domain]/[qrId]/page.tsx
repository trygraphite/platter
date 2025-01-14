import { QRCodeView } from "@/components/qr-comps/qrview";
import Header from "@/components/shared/header";
import { Params } from "@/types/pages";
import db from "@platter/db";
import { notFound } from "next/navigation";



async function Page({ params }: { params: Params }) {

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
          cuisine: true,
          openingHours: true,
          closingHours: true,
        },
      },
    },
  });

  if (!restaurantDetails) {
    return notFound();
  }

  // Configure page using restaurantDetails
  const pageConfig = {
    title: restaurantDetails.target === "table" 
      ? `${restaurantDetails.user.name } Table ${restaurantDetails.targetNumber }  `
      : restaurantDetails.target === "menu"
        ? "Restaurant Menu"
        : restaurantDetails.user.name,
    description: restaurantDetails.user.description || `Welcome to ${restaurantDetails.user.name}`,
    restaurantInfo: {
      name: restaurantDetails.user.name,
      cuisine: restaurantDetails.user.cuisine,
      hours: restaurantDetails.user.openingHours && restaurantDetails.user.closingHours
        ? `${restaurantDetails.user.openingHours} - ${restaurantDetails.user.closingHours}`
        : undefined,
      image: restaurantDetails.user.image,
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

  return <>
        <Header 
          restaurantName={restaurantDetails.user.name} 
          reviewLink="" 
        />
        <QRCodeView qrId={qrId} config={pageConfig} />;
  </>
}

export default Page;