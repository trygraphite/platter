import { Card, CardContent } from "@platter/ui/components/card";
import { QrCode, Smartphone, Users } from "lucide-react";

export function FeaturesOverview() {
  return (
    <section className="section bg-white">
      <div className="container-wide">
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-widest text-primary font-semibold">
            Free Features
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything included in your free QR code menu
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Create your free digital menu QR code today and get access to all
            premium features, completely free.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="border-gray-200 hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="rounded-lg bg-primary-50 p-3 mb-4">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Waiter app, take orders from customers
              </h3>
              <p className="text-lg text-gray-600">
                Get a powerful waiter app free with your QR menu system. Take
                orders digitally, manage tables, and boost service efficiency.
              </p>

              <div className="space-y-6 mt-4">
                {waiterAppFeatures.map((feature) => (
                  <div key={feature.title} className="flex gap-4">
                    <div className="rounded-lg bg-primary-50 p-2 h-fit">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">
                        {feature.title}
                      </h4>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <a
                  href="/request"
                  className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  Get Free Waiter App
                </a>
              </div>
            </div>

            <div className="bg-gray-100 rounded-xl p-6 flex justify-center">
              {/* Waiter App Mockup */}
              <div className="w-64 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                <div className="bg-gray-50 p-3 border-b border-gray-200">
                  <h3 className="text-sm font-medium text-center">
                    Waiter App
                  </h3>
                </div>
                <div className="p-4 space-y-4">
                  {waiterAppOrders.map((order) => (
                    <div
                      key={order.table}
                      className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-xs">
                            {order.table}
                          </div>
                          <span className="text-sm font-medium">
                            Table {order.tableNumber}
                          </span>
                        </div>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                          New
                        </span>
                      </div>

                      <div className="space-y-1">
                        {order.items.map((item) => (
                          <div
                            key={`${order.table}-${item}`}
                            className="text-xs text-gray-600"
                          >
                            {item}
                          </div>
                        ))}
                      </div>

                      <div className="mt-2 pt-2 border-t border-gray-200 flex justify-between">
                        <span className="text-xs text-gray-500">Total:</span>
                        <span className="text-xs font-medium">
                          {order.total}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const features = [
  {
    title: "Free QR Code Menu Creator",
    description:
      "Generate beautiful, interactive digital menus with QR codes instantly. Perfect for contactless dining.",
    icon: QrCode,
  },
  {
    title: "Digital Ordering System",
    description:
      "Let customers browse your menu and order directly from their phones. Reduce wait times and increase efficiency.",
    icon: Smartphone,
  },
  {
    title: "Staff Management Tools",
    description:
      "Get instant order notifications and manage your staff efficiently. Everything you need in one free platform.",
    icon: Users,
  },
];

const waiterAppFeatures = [
  {
    title: "Digital Order Taking",
    description:
      "Take orders directly from customers or use the waiter app for table service. Instant order transmission to kitchen, reducing errors by 95%.",
    icon: Smartphone,
  },
  {
    title: "Real-time Notifications",
    description:
      "Stay informed with instant alerts for new orders, kitchen updates, and table service requests. Custom alert settings for different staff roles.",
    icon: QrCode,
  },
  {
    title: "Order Management",
    description:
      "Track and manage orders efficiently from a single dashboard. Monitor status, handle modifications, and access order history.",
    icon: Users,
  },
];

const waiterAppOrders = [
  {
    table: "T4",
    tableNumber: "4",
    items: ["Grilled Salmon x1", "Caesar Salad x2"],
    total: "$45.00",
  },
  {
    table: "T8",
    tableNumber: "8",
    items: ["Grilled Salmon x1", "Caesar Salad x2"],
    total: "$45.00",
  },
  {
    table: "T12",
    tableNumber: "12",
    items: ["Grilled Salmon x1", "Caesar Salad x2"],
    total: "$45.00",
  },
];
