"use client";
import React from 'react';
import { ArrowRight, Check } from 'lucide-react';

export default function RequestAccessPage() {

  const openWhatsApp = () => {
    const phoneNumber = '2348149113328';
    const message = encodeURIComponent('Hello! I would like to request access to RestaurantQR.');
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  const features = [
    "Easy QR code generation for your restaurant",
    "Digital menu management",
    "Customer analytics and insights",
    "Table ordering system",
    "Mobile-friendly interface"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Left Column - Content */}
          <div className="flex flex-col justify-center">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-6">Transform Your Restaurant Experience</h2>
            <p className="text-xl text-gray-600 mb-8">
              RestaurantQR helps you modernize your restaurant with digital menus, 
              contactless ordering, and insightful analytics.
            </p>
            
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">What you'll get:</h3>
              <ul className="space-y-3">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0">
                      <Check className="h-5 w-5" />
                    </div>
                    <p className="ml-3 text-gray-600">{feature}</p>
                  </li>
                ))}
              </ul>
            </div>
            
            <button 
              onClick={openWhatsApp}
              className="flex items-center bg-primary justify-center px-6 py-3 rounded-lg text-white font-medium shadow-md hover:shadow-lg transition-all duration-300 w-full sm:w-auto"
            >
              Request Access Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
          
          {/* Right Column - Image */}
          <div className="flex items-center justify-center">
            <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden ">
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
             
                <h3 className="text-2xl font-bold text-gray-800 mb-2">RestaurantQR</h3>
                <p className="text-gray-600">Scan. Order. Enjoy.</p>
                <div className="mt-3 flex justify-center">
                  <img 
                    src="/assets/table1-qr.png"
                    width={228}
                    height={328} 
                    alt="QR Code Example" 
                    className="rounded-lg shadow-lg bg-white p-2"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Testimonial Section */}
      {/* <section className="py-12 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Trusted by Restaurants Worldwide</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                  <div className="ml-3">
                    <h3 className="font-medium text-gray-900">Restaurant Owner</h3>
                    <p className="text-sm text-gray-500">Fine Dining</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  "RestaurantQR has completely transformed how we manage our restaurant. 
                  Our customers love the digital menu experience!"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to modernize your restaurant?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join hundreds of restaurants already using RestaurantQR to enhance 
            their customer experience and streamline operations.
          </p>
          <button 
            onClick={openWhatsApp}
            className="inline-flex items-center px-8 py-4 rounded-lg bg-primary text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Request Access via WhatsApp
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </section>
    </div>
  );
}