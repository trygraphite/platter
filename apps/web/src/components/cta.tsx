import Link from "next/link";

export function CTASection() {
  return (
    <section className="gradient-bg py-16">
      <div className="container-wide text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Ready to get started?
        </h2>
        <p className="mt-4 text-lg text-white opacity-90">
          Create a free account today.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/request"
            className="inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-base font-medium text-primary shadow-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary"
          >
            Create Free Account
          </Link>
          <a
            href="https://wa.me/+123456789?text=I%20need%20assistance%20with%20my%20platter%20account!"
            className="inline-flex items-center justify-center rounded-md bg-transparent border border-white px-6 py-3 text-base font-medium text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white"
          >
            Need help?
          </a>
        </div>
      </div>
    </section>
  );
}
