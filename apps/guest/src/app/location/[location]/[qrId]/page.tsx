// import { RestaurantCard } from "@/components/location/resturant-card";
// import Header from "@/components/shared/header";
// import type { Params } from "@/types/pages";
// import db from "@platter/db";
// import { notFound } from "next/navigation";

// export default async function LocationPage({ params }: { params: Params }) {

//     const { qrId } = await params;

//   const locationQR = await db.qRCode.findUnique({
//     where: { id: qrId },
//     include: {
//       location: {
//         include: {
//           users: {
//             select: {
//               id: true,
//               name: true,
//               image: true,
//               cuisine: true,
//               subdomain: true,
//               qrCodes: {
//                 where: {
//                   target: "table",
//                   targetNumber: { not: null }, // Valid filter
//                   locationId: { not: null }, // Correct way to filter non-null location IDs
//                 },
//                 take: 1,
//               },
//             },
//           },
//           table: {
//             where: {
//               qrCodes: {
//                 some: {
//                   AND: [{ id: qrId }, { targetNumber: { not: null } }],
//                 },
//               },
//             },
//             take: 1,
//           },
//         },
//       },
//     },
//   });

//   // Then get the actual values we need
//   const currentTableNumber = locationQR?.targetNumber;
//   const currentLocationId = locationQR?.locationId;

//   if (!currentTableNumber || !currentLocationId) {
//     // Validate required values exist
//     return notFound();
//   }

//   // Now fetch users with matching table numbers
//   const usersWithTableQRCodes = await db.user.findMany({
//     where: {
//       locationId: currentLocationId,
//       qrCodes: {
//         some: {
//           target: "table",
//           targetNumber: currentTableNumber,
//           locationId: currentLocationId,
//         },
//       },
//     },
//     select: {
//       id: true,
//       name: true,
//       image: true,
//       cuisine: true,
//       subdomain: true,
//       qrCodes: {
//         where: {
//           target: "table",
//           targetNumber: currentTableNumber,
//           locationId: currentLocationId,
//         },
//         take: 1,
//       },
//     },
//   });
// console.log(usersWithTableQRCodes);

//   if (!locationQR?.location) {
//     return notFound();
//   }

//   return (
//     <div className="container mx-auto py-8">
//       <Header
//         restaurantName={locationQR.location.name}
//         reviewLink={''}
//       />

//       <div className="text-center mb-8">
//         <h1 className="text-3xl font-bold">{locationQR.location.name}</h1>
//         <p className="text-muted-foreground mt-2">
//           Table {currentTableNumber} • Select a restaurant
//         </p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {usersWithTableQRCodes.map((restaurant) => (
//           <RestaurantCard
//             key={restaurant.id}
//             name={restaurant.name}
//             cuisine={restaurant.cuisine || ""}
//             image={restaurant.image}
//             qrCodeId={restaurant.qrCodes[0]?.id}
//             subdomain={restaurant.subdomain ?? undefined}
//             currentQrId={qrId}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }

import React from 'react'

const page = () => {
  return (
    <div>page</div>
  )
}

export default page