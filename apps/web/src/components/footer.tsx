import Link from "next/link";
import Image from "next/image";
import { Separator } from "@platter/ui/components/separator";

export function Footer() {
  return (
    <footer className="bg-gray-900 py-12 md:py-16">
      <div className="container-wide">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">QR Menu Guides</h3>
            <ul className="space-y-3">
              {qrMenuGuides.map((item) => (
                <li key={item.title}>
                  <Link href={item.href} className="text-gray-400 hover:text-white transition-colors">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Restaurant Tech</h3>
            <ul className="space-y-3">
              {restaurantTech.map((item) => (
                <li key={item.title}>
                  <Link href={item.href} className="text-gray-400 hover:text-white transition-colors">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Success Stories</h3>
            <ul className="space-y-3">
              {successStories.map((item) => (
                <li key={item.title}>
                  <Link href={item.href} className="text-gray-400 hover:text-white transition-colors">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Free Resources</h3>
            <ul className="space-y-3">
              {freeResources.map((item) => (
                <li key={item.title}>
                  <Link href={item.href} className="text-gray-400 hover:text-white transition-colors">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-gray-800" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Image src="/logo.png" alt="Platter Logo" width={40} height={40} className="rounded-full bg-primary" />
            <span className="font-bold text-xl text-white">Platter</span>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/contact" className="text-sm text-gray-400 hover:text-white transition-colors">
              Contact
            </Link>
            <Link href="/pricing" className="text-sm text-gray-400 hover:text-white transition-colors">
              Pricing
            </Link>
            <Link href="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-gray-400 hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/gdpr" className="text-sm text-gray-400 hover:text-white transition-colors">
              GDPR Compliance
            </Link>
            <Link href="/security" className="text-sm text-gray-400 hover:text-white transition-colors">
              Security
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Platter. All rights reserved.</p>
          <p className="mt-4 max-w-3xl mx-auto">
            Platter provides free QR code menu systems and waiter apps for restaurants worldwide. Our complete digital menu solution helps restaurants increase efficiency, reduce wait times, and boost revenue. Create your free QR code menu today and join thousands of successful restaurants across the globe.
          </p>
        </div>
      </div>
    </footer>
  );
}

const qrMenuGuides = [
  { title: 'Benefits of QR Code Menus', href: '/benefits' },
  { title: 'ROI of Digital Menus', href: '/roi' },
  { title: 'QR Menu Best Practices', href: '/best-practices' },
  { title: 'Contactless Ordering Guide', href: '/contactless-ordering' },
];

const restaurantTech = [
  { title: 'POS vs QR Ordering', href: '/pos-vs-qr' },
  { title: 'Mobile Ordering Trends 2025', href: '/trends-2025' },
  { title: 'Restaurant Automation Guide', href: '/automation' },
  { title: 'Digital Restaurant Guide', href: '/digital-restaurant' },
];

const successStories = [
  { title: '25% Revenue Increase Case Study', href: '/case-study-revenue' },
  { title: 'Wait Time Reduction Story', href: '/case-study-wait-time' },
  { title: 'Staff Efficiency Case Study', href: '/case-study-efficiency' },
  { title: 'Restaurant Success Stories', href: '/success-stories' },
];

const freeResources = [
  { title: 'Free Menu Templates', href: '/templates' },
  { title: 'Free QR Code Generator', href: '/qr-generator' },
  { title: 'Menu Cost Calculator', href: '/calculator' },
  { title: 'Restaurant Tech Guide', href: '/tech-guide' },
];
