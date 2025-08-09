"use client";
import { Badge } from "@platter/ui/components/badge";
import { Button } from "@platter/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@platter/ui/components/card";
import { Switch } from "@platter/ui/components/switch";
import { Check, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);

  const pricingPlans = [
    {
      name: "Free",
      monthlyPrice: 0,
      annualPrice: 0,
      description: "Perfect for small cafes and food trucks getting started.",
      features: {
        included: [
          "Up to 5 QR table generations",
          "Basic order system",
          "Simple menu management",
          "Email support",
          "Basic order notifications",
        ],
        excluded: [
          "Real-time analytics",
          "Customer management",
          "Inventory tracking",
          "Custom branding",
          "Phone support",
        ],
      },
      buttonText: "Get Started Free",
      popular: false,
      highlight: false,
    },
    {
      name: "Pro",
      monthlyPrice: 50000,
      annualPrice: 35000, // 30% discount
      description: "Ideal for growing restaurants with moderate traffic.",
      features: {
        included: [
          "Up to 50 QR table generations",
          "Real-time order system",
          "Order customization",
          "Basic analytics & reports",
          "Customer order history",
          "Email & phone support",
          "Basic inventory alerts",
          "Order status notifications",
        ],
        excluded: [
          "Advanced analytics",
          "Loyalty program",
          "AI Order recommendations",
          "Custom branding",
          "Priority support",
        ],
      },
      buttonText: "Start Pro Plan",
      popular: true,
      highlight: true,
    },
    {
      name: "Advanced",
      monthlyPrice: 80000,
      annualPrice: 56000, // 30% discount
      description: "Complete solution for established restaurants and chains.",
      features: {
        included: [
          "Unlimited QR table generations",
          "Advanced order management",
          "Complete analytics dashboard",
          "Customer loyalty program",
          "Advanced inventory management",
          "Custom branding & themes",
          "24/7 priority support",
          "AI-powered recommendations",
          "Multi-location management",
          "Advanced reporting suite",
          "Staff management tools",
          "Dedicated account manager",
        ],
        excluded: [],
      },
      buttonText: "Go Advanced",
      popular: false,
      highlight: false,
    },
  ];

  const formatPrice = (price: number) => {
    if (price === 0) return "Free";
    return `₦${price.toLocaleString()}`;
  };

  const calculateSavings = (monthlyPrice: number) => {
    if (monthlyPrice === 0) return 0;
    const annualTotal = monthlyPrice * 12;
    const discountedAnnual = monthlyPrice * 0.7 * 12;
    return annualTotal - discountedAnnual;
  };

  return (
    <div className=" bg-background">
      {/* Pricing Section */}
      <section id="pricing" className="w-full py-12 md:py-24">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-foreground">
                Simple, transparent pricing
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Choose the plan that works best for your restaurant and start
                enhancing your customer experience today.
              </p>
            </div>
          </div>

          {/* Billing Toggle */}
          <div className="flex justify-center items-center space-x-4 mt-8">
            <span
              className={`text-sm font-medium ${!isAnnual ? "text-foreground" : "text-muted-foreground"}`}
            >
              Monthly
            </span>
            <Switch checked={isAnnual} onCheckedChange={setIsAnnual} />
            <span
              className={`text-sm font-medium ${isAnnual ? "text-foreground" : "text-muted-foreground"}`}
            >
              Annual
            </span>
            {isAnnual && <Badge className="ml-2">Save 30%</Badge>}
          </div>

          <div className="mx-auto w-full max-w-sm sm:max-w-none mt-8">
            <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-3 lg:gap-8">
              {pricingPlans.map((plan, index) => (
                <Card
                  key={index}
                  className={`flex flex-col ${plan.highlight ? "border-primary shadow-xl ring-1 ring-primary" : "shadow-sm"} relative`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge>Most Popular</Badge>
                    </div>
                  )}

                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-gray-900">
                        {plan.name}
                      </CardTitle>
                    </div>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="flex-1">
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold text-foreground">
                        {formatPrice(
                          isAnnual ? plan.annualPrice : plan.monthlyPrice,
                        )}
                      </span>
                      {plan.monthlyPrice > 0 && (
                        <span className="ml-2 text-sm font-medium text-muted-foreground">
                          /{isAnnual ? "month" : "month"}
                        </span>
                      )}
                    </div>

                    {isAnnual && plan.monthlyPrice > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-muted-foreground">
                          Billed annually (₦
                          {(
                            (isAnnual ? plan.annualPrice : plan.monthlyPrice) *
                            12
                          ).toLocaleString()}
                          /year)
                        </p>
                        <p className="text-sm text-green-600 font-medium">
                          Save ₦
                          {calculateSavings(plan.monthlyPrice).toLocaleString()}{" "}
                          per year
                        </p>
                      </div>
                    )}

                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-foreground mb-3">
                        What's included:
                      </h4>
                      <ul className="space-y-2">
                        {plan.features.included.map((feature, featureIndex) => (
                          <li
                            key={`included-${featureIndex}`}
                            className="flex items-start"
                          >
                            <Check className="h-4 w-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-foreground">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>

                      {plan.features.excluded.length > 0 && (
                        <div className="mt-4">
                          <ul className="space-y-2">
                            {plan.features.excluded
                              .slice(0, 3)
                              .map((feature, featureIndex) => (
                                <li
                                  key={`excluded-${featureIndex}`}
                                  className="flex items-start"
                                >
                                  <X className="h-4 w-4 text-muted-foreground mr-3 mt-0.5 flex-shrink-0" />
                                  <span className="text-sm text-muted-foreground">
                                    {feature}
                                  </span>
                                </li>
                              ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>

                  <CardFooter>
                    <Link href="/request" className="w-full">
                      <Button
                        variant={
                          plan.highlight
                            ? "default"
                            : plan.name === "Free"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {plan.buttonText}
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-sm text-muted-foreground">
              All plans include a 14-day free trial. No credit card required.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="w-full py-12 md:py-24 bg-muted/50">
        <div className="container-wide px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Compare all features
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Everything you need to elevate your restaurant's dining
                experience
              </p>
            </div>
          </div>

          <div className="mt-10 overflow-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-4 px-4 text-left font-medium">Features</th>
                  <th className="py-4 px-4 text-center font-medium">Monthly</th>
                  <th className="py-4 px-4 text-center font-medium">
                    Quarterly
                  </th>
                  <th className="py-4 px-4 text-center font-medium">Annual</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-4 px-4 font-medium">
                    Unlimited QR Table Generations
                  </td>
                  <td className="py-4 px-4 text-center">
                    <Check className="h-5 w-5 text-primary mx-auto" />
                  </td>
                  <td className="py-4 px-4 text-center">
                    <Check className="h-5 w-5 text-primary mx-auto" />
                  </td>
                  <td className="py-4 px-4 text-center">
                    <Check className="h-5 w-5 text-primary mx-auto" />
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-4 font-medium">
                    Real-time Order System
                  </td>
                  <td className="py-4 px-4 text-center">
                    <Check className="h-5 w-5 text-primary mx-auto" />
                  </td>
                  <td className="py-4 px-4 text-center">
                    <Check className="h-5 w-5 text-primary mx-auto" />
                  </td>
                  <td className="py-4 px-4 text-center">
                    <Check className="h-5 w-5 text-primary mx-auto" />
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-4 font-medium">Order Customization</td>
                  <td className="py-4 px-4 text-center">
                    <Check className="h-5 w-5 text-primary mx-auto" />
                  </td>
                  <td className="py-4 px-4 text-center">
                    <Check className="h-5 w-5 text-primary mx-auto" />
                  </td>
                  <td className="py-4 px-4 text-center">
                    <Check className="h-5 w-5 text-primary mx-auto" />
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-4 font-medium">
                    Analytics & Reporting
                  </td>
                  <td className="py-4 px-4 text-center">Basic</td>
                  <td className="py-4 px-4 text-center">Detailed</td>
                  <td className="py-4 px-4 text-center">Advanced</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-4 font-medium">Customer Support</td>
                  <td className="py-4 px-4 text-center">Email</td>
                  <td className="py-4 px-4 text-center">Email & Phone</td>
                  <td className="py-4 px-4 text-center">24/7 Premium</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-4 font-medium">
                    Inventory Management
                  </td>
                  <td className="py-4 px-4 text-center">Basic</td>
                  <td className="py-4 px-4 text-center">Advanced</td>
                  <td className="py-4 px-4 text-center">Advanced</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-4 font-medium">
                    Customer Loyalty System
                  </td>
                  <td className="py-4 px-4 text-center">—</td>
                  <td className="py-4 px-4 text-center">
                    <Check className="h-5 w-5 text-primary mx-auto" />
                  </td>
                  <td className="py-4 px-4 text-center">
                    <Check className="h-5 w-5 text-primary mx-auto" />
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-4 font-medium">Custom Branding</td>
                  <td className="py-4 px-4 text-center">—</td>
                  <td className="py-4 px-4 text-center">
                    <Check className="h-5 w-5 text-primary mx-auto" />
                  </td>
                  <td className="py-4 px-4 text-center">
                    <Check className="h-5 w-5 text-primary mx-auto" />
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-4 font-medium">AI Recommendations</td>
                  <td className="py-4 px-4 text-center">—</td>
                  <td className="py-4 px-4 text-center">—</td>
                  <td className="py-4 px-4 text-center">
                    <Check className="h-5 w-5 text-primary mx-auto" />
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-4 font-medium">Custom Mobile App</td>
                  <td className="py-4 px-4 text-center">—</td>
                  <td className="py-4 px-4 text-center">—</td>
                  <td className="py-4 px-4 text-center">
                    <Check className="h-5 w-5 text-primary mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-medium">
                    Dedicated Account Manager
                  </td>
                  <td className="py-4 px-4 text-center">—</td>
                  <td className="py-4 px-4 text-center">—</td>
                  <td className="py-4 px-4 text-center">
                    <Check className="h-5 w-5 text-primary mx-auto" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full py-12 md:py-24">
        <div className="container-wide px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Frequently Asked Questions
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Everything you need to know about our restaurant QR ordering
                system
              </p>
            </div>
          </div>

          <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-2 mt-10">
            <Card>
              <CardHeader>
                <CardTitle>How does the trial work?</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  All plans come with a 30-day free trial. You'll only be
                  charged after your trial ends. You can cancel anytime during
                  the trial period without being charged.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Can I change my plan later?</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Yes, you can upgrade, downgrade, or cancel your plan at any
                  time. When upgrading, we'll prorate your billing to account
                  for the remaining time on your current plan.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>What payment methods do you accept?</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  We accept all major credit cards, bank transfers, and local
                  payment methods. For annual plans, we can also provide
                  invoicing options for businesses.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Do you offer custom solutions?</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Yes! For restaurant chains or businesses with specific
                  requirements, we offer custom enterprise solutions. Contact
                  our sales team to discuss your needs.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
