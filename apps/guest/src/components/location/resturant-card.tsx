import { Button } from "@platter/ui/components/button";
import Image from "next/image";
import Link from "next/link";

export function RestaurantCard({
  name,
  cuisine,
  image,
  qrCodeId,
  subdomain,
  currentQrId,
}: {
  name: string;
  cuisine: string;
  image?: string | null;
  qrCodeId?: string;
  subdomain?: string | null;
  currentQrId: string;
}) {
  const getRestaurantUrl = () => {
    if (!subdomain || !qrCodeId) return "#";

    const isProduction = process.env.NODE_ENV === "production";
    const protocol = isProduction ? "https" : "http";

    // Clean up base domain by removing protocol and trailing slashes
    const rawBaseDomain = process.env.BASE_DOMAIN || "localhost:3000";
    const cleanBaseDomain = rawBaseDomain
      .replace(/^(https?:\/\/)/, "") // Remove existing protocol
      .replace(/\/$/, ""); // Remove trailing slash

    return `${protocol}://${subdomain}.${cleanBaseDomain}/${qrCodeId}`;
  };

  return (
    <div className="border rounded-lg p-6 flex flex-col gap-4">
      <div className="flex items-center gap-4">
        {image && (
          <Image
            src={image}
            alt={name}
            width={64}
            height={64}
            className="rounded-full"
          />
        )}
        <div>
          <h3 className="text-xl font-semibold">{name}</h3>
          <p className="text-sm text-muted-foreground">{cuisine}</p>
        </div>
      </div>

      {qrCodeId && subdomain && (
        <Button asChild className="w-full">
          <Link href={getRestaurantUrl()}>View Menu</Link>
        </Button>
      )}
    </div>
  );
}
