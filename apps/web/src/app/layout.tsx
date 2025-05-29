import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import ClientBody from "./Clientbody";
import { CTASection } from "@/components/cta";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { siteConfig } from "@/lib/siteConfig";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: {
      default: siteConfig.defaultTitle,
      template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    keywords: siteConfig.keywords,
    authors: [{ name: siteConfig.creator }],
    creator: siteConfig.creator,
    openGraph: {
      type: "website",
      locale: "en_NG",
      url: siteConfig.url,
      title: siteConfig.defaultTitle,
      description: siteConfig.description,
      siteName: siteConfig.name,
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: siteConfig.defaultTitle,
      description: siteConfig.description,
      images: [siteConfig.ogImage],
      creator: siteConfig.links.twitter,
    },
    robots: {
      index: true,
      follow: true,
    },
    metadataBase: new URL(siteConfig.url),
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientBody>
          <Navbar />
          {children}
          <CTASection />
          <Footer />
        </ClientBody>
      </body>
    </html>
  );
}