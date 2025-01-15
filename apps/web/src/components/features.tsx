"use client";
import { useState } from "react";

import {
  QrCode,
  ShoppingCart,
  MessageSquare,
  BarChart,
  Settings,
  Bell,
} from "lucide-react";
import { Button } from "@platter/ui/components/button";

const features = {
  guests: [
    {
      icon: QrCode,
      title: "Instant Menu Access",
      description: "Scan and browse the menu instantly on your device",
    },
    {
      icon: ShoppingCart,
      title: "Easy Ordering",
      description: "Place orders seamlessly with just a few taps",
    },
    {
      icon: MessageSquare,
      title: "Quick Feedback",
      description: "Share your experience effortlessly",
    },
  ],
  admins: [
    {
      icon: Bell,
      title: "Real-time Tracking",
      description: "Monitor orders and feedback in real-time",
    },
    {
      icon: BarChart,
      title: "Analytics Dashboard",
      description: "Gain insights with comprehensive analytics",
    },
    {
      icon: Settings,
      title: "Easy Management",
      description: "Manage feedback and complaints efficiently",
    },
  ],
};

export const Features = () => {
  const [activeTab, setActiveTab] = useState<"guests" | "admins">("guests");

  return (
    <section className="py-20 bg-platter-secondary">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-8">Features</h2>
        <div className="flex justify-center gap-4 mb-12">
          <Button
            variant={activeTab === "guests" ? "default" : "outline"}
            onClick={() => setActiveTab("guests")}
            className={activeTab === "guests" ? "bg-platter-primary" : ""}
          >
            For Guests
          </Button>
          <Button
            variant={activeTab === "admins" ? "default" : "outline"}
            onClick={() => setActiveTab("admins")}
            className={activeTab === "admins" ? "bg-platter-primary" : ""}
          >
            For Admins
          </Button>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {features[activeTab].map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <feature.icon className="w-12 h-12 text-platter-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
