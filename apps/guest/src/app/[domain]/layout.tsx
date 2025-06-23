import type { Metadata, ResolvingMetadata } from "next";
import "@/styles/guest.css";
import db from "@platter/db";
import { siteConfig } from "@/lib/siteConfig";


interface SubdomainLayoutProps {
  children: React.ReactNode;
  params: {
    domain?: string;
  };
}

export async function generateMetadata(
  { params }: SubdomainLayoutProps,
): Promise<Metadata> {
  
  const { domain } = await params;
  
  if (!domain) {
    // Return default metadata if subdomain is missing
    return {
      title: "PlatterNG",
      description: "Food ordering platform",
    };
  }
  
  let userData;
  try {
    userData = await db.user.findUnique({
      where: { 
        subdomain: domain 
      },
      select: {
        id: true,
        name: true,
        image: true,
        icon: true,
        description: true,
        cuisine: true,
        openingHours: true,
        closingHours: true,
        address: true,
        city: true,
        state: true,
        zipCode: true,
        phone: true,
        website: true,
        googleReviewLink: true
      }
    });
    
  } catch (error) {
    // Continue with default values
  }
  
  const name = userData?.name || 'Restaurant';
  const logo = userData?.icon || userData?.image;
  const description = userData?.description || `Order food, track your meal, and leave reviews at ${name}.`;
  
  // Base URL construction
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? `https://${domain}.${process.env.BASE_DOMAIN || 'platterng.com'}`
    : `http://${domain}.localhost:3001`;
  
  // Generate the Open Graph image URL
  const ogImageUrl = `${siteConfig.ogImage}`;
  
  const metadata = {
    title: {
      default: `${name} | PlatterNG`,
      template: `%s | ${name} - PlatterNG`,
    },
    description,
    keywords: ['restaurant', 'food ordering', 'dining', name, 'menu', 'reviews', userData?.cuisine].filter(Boolean),
    authors: [{ name: 'PlatterNG' }],
    metadataBase: new URL(baseUrl),
    themeColor: '#000000',
    icons: {
      icon: logo || '/favicon.ico',
      apple: logo || '/apple-icon.png',
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: baseUrl,
      title: `${name} | PlatterNG`,
      description,
      siteName: `${name} on PlatterNG`,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${name} - PlatterNG`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${name} | PlatterNG`,
      description,
      images: [ogImageUrl],
      creator: '@platterng',
    },
  };

  return metadata;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
  params: {
    domain?: string;
  };
}): React.ReactElement {
  
  return (
   <main>{children}</main>
  );
}