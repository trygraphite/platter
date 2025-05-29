import { Card, CardContent } from "@platter/ui/components/card";


export function Comparison() {
  return (
    <section className="section bg-gray-50">
      <div className="container-wide">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Traditional Way vs Platter Way
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            See how Platter's QR menu system transforms the customer experience compared to traditional ordering methods
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
          <Card className="overflow-hidden border-red-200">
            <div className="bg-red-100 p-4 border-b border-red-200">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-red-500 p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Traditional Way</h3>
              </div>
              <div className="bg-red-50 mt-3 p-2 rounded-md flex justify-between items-center">
                <span className="text-sm font-medium">Counter 1</span>
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">Very Busy</span>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex flex-col gap-3">
                  {traditionalWayItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                      <div>
                        <span className="text-sm font-medium text-gray-900">{item.label}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-900">{item.value}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 space-y-2">
                  {traditionalWayCustomers.map((customer) => (
                    <div key={customer.id} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-md">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-900">{customer.label}</span>
                      </div>
                      <div>
                        <span className="text-sm text-red-500 font-medium">{customer.waitTime}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500">Average Wait Time:</span>
                    <span className="text-lg font-bold text-red-500">25 mins</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm font-medium text-gray-500">Customer Satisfaction:</span>
                    <span className="text-lg font-bold text-red-500">65%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-primary-200">
            <div className="bg-primary-100 p-4 border-b border-primary-200">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Platter Way</h3>
              </div>
              <div className="bg-green-50 mt-3 p-2 rounded-md flex justify-between items-center">
                <span className="text-sm font-medium">Self-Service</span>
                <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">Available</span>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex flex-col gap-3">
                  {platterWayItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                      <div>
                        <span className="text-sm font-medium text-gray-900">{item.label}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-900">{item.value}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500">Average Wait Time:</span>
                    <span className="text-lg font-bold text-green-500">0 mins</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm font-medium text-gray-500">Customer Satisfaction:</span>
                    <span className="text-lg font-bold text-green-500">95%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get started in minutes - create your free QR code menu and watch your business transform. Your customers will thank you for it.
          </p>
          <a
            href="/request"
            className="mt-8 inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Create Free QR Code Menu
          </a>
        </div>
      </div>
    </section>
  );
}

const traditionalWayItems = [
  { id: 'trad-item-1', label: 'Processing Order', value: '$24.99' },
  { id: 'trad-item-2', label: 'Counter Service', value: '' },
  { id: 'trad-item-3', label: 'Extended Wait Time', value: '' },
];

const traditionalWayCustomers = [
  { id: 'trad-cust-1', label: 'Customer #1', waitTime: 'Waiting 5 mins' },
  { id: 'trad-cust-2', label: 'Customer #2', waitTime: 'Waiting 10 mins' },
  { id: 'trad-cust-3', label: 'Customer #3', waitTime: 'Waiting 15 mins' },
  { id: 'trad-cust-4', label: 'Customer #4', waitTime: 'Waiting 20 mins' },
  { id: 'trad-cust-5', label: 'Customer #5', waitTime: 'Waiting 25 mins' },
];

const platterWayItems = [
  { id: 'plat-item-1', label: 'Scan & Place Order', value: '' },
  { id: 'plat-item-2', label: 'Ordering via phone', value: '' },
  { id: 'plat-item-3', label: 'No waiting required', value: '' },
  { id: 'plat-item-4', label: 'Order instantly processed', value: '' },
];
