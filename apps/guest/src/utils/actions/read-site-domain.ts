"use server";

import db from "@platter/db";

export const runtime = "edge";

export const readSiteDomain = async (domain: string) => {
  const data = await db.user.findUnique({
    where: {
      subdomain: domain,
    },
    select: {
      subdomain: true,
    },
  });
 return data;
};
