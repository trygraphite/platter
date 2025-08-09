import { BarChart, Clock, CreditCard, Settings, Smile } from "lucide-react";

export function Features() {
  return (
    <section className="section bg-gray-50">
      <div className="container-wide">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Take more orders in less time!
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Transform your ordering experience today with our digital QR menu
            solution.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
          {features.map((feature) => (
            <div
              key={feature.name}
              className="relative bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="absolute -top-4 left-4">
                <div className="inline-flex items-center justify-center rounded-lg bg-primary p-3 shadow-lg">
                  <feature.icon
                    className="h-6 w-6 text-white"
                    aria-hidden="true"
                  />
                </div>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">
                {feature.name}
              </h3>
              <p className="mt-2 text-base text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center">
          <p className="text-gray-600 text-lg max-w-2xl text-center">
            Get started in minutes - create your free QR code menu and watch
            your business transform. Your customers will thank you for it.
          </p>
          <a
            href="/request"
            className="mt-8 inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Create Free QR Code Menu
          </a>
          <p className="mt-3 text-sm text-gray-500">
            No credit card required • Instant setup • One month free!
          </p>
        </div>
      </div>
    </section>
  );
}

const features = [
  {
    name: "Take more orders in less time",
    description:
      "Increase table turnover rates by up to 30% with instant QR code ordering. No more waiting for waiters.",
    icon: Clock,
  },
  {
    name: "Eliminate frustrating wait times",
    description:
      "Customers can browse and order at their own pace, removing queues and reducing frustration.",
    icon: Smile,
  },
  {
    name: "Let customers order at their own pace",
    description:
      "Give customers the freedom to explore the menu and order whenever they're ready, no pressure.",
    icon: Settings,
  },
  {
    name: "Boost customer satisfaction",
    description:
      "Deliver a modern dining experience with digital menus, leading to higher customer satisfaction scores.",
    icon: CreditCard,
  },
  {
    name: "Streamline your operations",
    description:
      "Integrate orders directly to your kitchen display system, reducing errors and improving efficiency.",
    icon: Settings,
  },
  {
    name: "Track performance metrics",
    description:
      "Access real-time analytics on your most popular items, revenue, and customer behavior.",
    icon: BarChart,
  },
];
