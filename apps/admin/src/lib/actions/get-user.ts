"use server";
import db from "@platter/db";
import getServerSession from "../auth/server";

export async function getCurrentUserDetails() {
  const session = await getServerSession();
  if (!session?.user) return null;

  return db.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      locationId: true,
      // Add other fields 
    },
  });
}