import { Button } from "@platter/ui/components/button";
import Image from "next/image";
import Link from "next/link";

export function HowItWorks() {
  return (
    <section className="section bg-white">
      <div className="container-wide">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Free QR Code Menu System - Transform your restaurant with our
            digital menu solution in three simple steps
          </p>
        </div>

        <div className="mt-12">
          {steps.map((step, index) => (
            <div key={step.title} className="relative mb-24 lg:mb-32 last:mb-0">
              <div
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
              >
                <div
                  className={`flex flex-col gap-6 ${index % 2 === 1 ? "lg:items-end lg:text-right" : ""}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary">
                      <span className="text-xl font-bold border p-2 px-4 border-primary rounded-full">
                        {index + 1}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-lg text-gray-600 max-w-lg">
                    {step.description}
                  </p>
                  <ul className="mt-2 space-y-2">
                    {step.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <svg
                          className="h-5 w-5 flex-none text-primary"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div
                  className={`relative ${index % 2 === 1 ? "lg:order-first" : ""}`}
                >
                  <div className="relative z-10 flex justify-center">
                    {/* Illustration or mock UI for each step */}
                    <div
                      className={`w-full max-w-[400px] ${step.illustrationClass}`}
                    >
                      {step.illustration}
                    </div>
                  </div>
                </div>
              </div>

              {/* Connector lines between steps (except for the last step) */}
              {index < steps.length - 1 && (
                <div className="absolute h-16 w-px bg-gray-200 left-1/2 -translate-x-1/2 -bottom-16" />
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center">
          <Link href="/request">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary-600 text-white font-medium px-8"
            >
              Create Free QR Code Menu
            </Button>
          </Link>
          <p className="mt-3 text-sm text-gray-500 text-center">
            No credit card required • Instant setup • One month free!
          </p>
        </div>
      </div>
    </section>
  );
}

const steps = [
  {
    title: "Scan & Open Menu",
    description:
      "Customers scan the QR code with their phone camera to instantly view your digital menu",
    features: [
      "Instant menu access",
      "No app download required",
      "Works on all smartphones",
      "Multiple languages support",
    ],
    illustrationClass: "",
    illustration: (
      <Image
        src="/assets/table1-qr.png"
        alt="Guest app interface"
        width={500}
        height={700}
        className="rounded-lg shadow-lg"
      />
    ),
  },
  {
    title: "Order & Checkout",
    description:
      "Customers select items and pay using their preferred payment method",
    features: [
      "Easy item selection",
      "Multiple payment options",
      "Secure transactions",
      "Order customization",
    ],
    illustrationClass: "",
    illustration: (
      <Image
        src="/assets/guestapp.png"
        alt="QR code at table"
        width={500}
        height={700}
        className="rounded-lg shadow-lg"
      />
    ),
  },
  {
    title: "Receive Orders",
    description:
      "Get instant notifications and manage orders through your restaurant dashboard",
    features: [
      "Real-time notifications",
      "Order management",
      "Kitchen display system",
      "Sales analytics",
    ],
    illustrationClass: "bg-white p-4 rounded-xl shadow-md",
    illustration: (
      <div className="flex flex-col items-center">
        <div className="w-full bg-gray-50 rounded-lg p-4">
          <div className="border-b border-gray-200 pb-3">
            <h3 className="text-lg font-semibold">Restaurant Dashboard</h3>
          </div>
          <div className="grid grid-cols-2 gap-3 py-3">
            <div className="bg-white p-2 rounded-md shadow-sm">
              <p className="text-xs text-gray-500">Today's Orders</p>
              <p className="text-lg font-semibold">156</p>
              <p className="text-xs text-green-500">+12.5% from yesterday</p>
            </div>
            <div className="bg-white p-2 rounded-md shadow-sm">
              <p className="text-xs text-gray-500">Customers</p>
              <p className="text-lg font-semibold">284</p>
              <p className="text-xs text-green-500">+5.3% from yesterday</p>
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium">Recent Orders</p>
              <p className="text-xs text-primary">View All</p>
            </div>
            <div className="bg-white p-2 rounded-md shadow-sm mb-2">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white text-xs">
                  T1
                </div>
                <div>
                  <p className="text-xs font-medium">Table 1</p>
                  <p className="text-xs text-gray-500">2 items · $45.00</p>
                </div>
                <div className="ml-auto">
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                    New
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-white p-2 rounded-md shadow-sm">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center text-white text-xs">
                  T2
                </div>
                <div>
                  <p className="text-xs font-medium">Table 2</p>
                  <p className="text-xs text-gray-500">2 items · $45.00</p>
                </div>
                <div className="ml-auto">
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                    New
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
];
