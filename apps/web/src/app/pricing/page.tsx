"use client";
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@platter/ui/components/card';
import { Button } from '@platter/ui/components/button';
import { Badge } from '@platter/ui/components/badge';
import { Check } from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@platter/ui/components/tabs';

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState('monthly');

  const pricingPlans = {
    monthly: [
      {
        name: "Monthly",
        price: "₦50,000",
        description: "Perfect for restaurants just getting started with digital ordering.",
        features: [
          "Unlimited QR table generations",
          "Real-time order system",
          "Order customization",
          "Basic analytics",
          "Email support"
        ],
        buttonText: "Get Started",
        popular: false
      },
      {
        name: "Quarterly",
        price: "₦130,000",
        pricePerMonth: "₦43,333/mo",
        description: "Great value for established restaurants with growing needs.",
        features: [
          "Everything in Monthly plan",
          "Advanced inventory management",
          "Customer loyalty system",
          "Detailed analytics & reports",
          "Priority email & phone support",
          "Custom branding options"
        ],
        buttonText: "Get Started",
        popular: true
      },
      {
        name: "Annual",
        price: "₦400,000",
        pricePerMonth: "₦33,333/mo",
        description: "Best value for serious restaurants committed to digital innovation.",
        features: [
          "Everything in Quarterly plan",
          "Advanced table management",
          "Integration with POS systems",
          "AI-powered recommendations",
          "24/7 premium support",
          "Custom mobile app",
          "Dedicated account manager"
        ],
        buttonText: "Get Started",
        popular: false
      }
    ]
  };

  return (
    <div className=" bg-background">
      {/* Pricing Section */}
      <section id="pricing" className="w-full container-wide py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Simple, transparent pricing
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Choose the plan that works best for your restaurant and start enhancing your customer experience today.
              </p>
            </div>
          </div>
          
          <div className="mx-auto w-full max-w-sm sm:max-w-none mt-8">
           
            
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {pricingPlans.monthly.map((plan, index) => (
                <Card key={index} className={`flex flex-col ${plan.popular ? 'border-primary shadow-lg' : ''}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{plan.name}</CardTitle>
                      {plan.popular && (
                        <Badge variant="default" className="bg-primary text-primary-foreground">
                          Popular
                        </Badge>
                      )}
                    </div>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="flex items-baseline text-2xl font-bold">
                      {plan.price}
                      <span className="ml-1 text-sm font-medium text-muted-foreground">
                        {plan.name === "Monthly" ? "/month" : (plan.name === "Quarterly" ? "/3 months" : "/year")}
                      </span>
                    </div>
                    {plan.pricePerMonth && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {plan.pricePerMonth}
                      </p>
                    )}
                    <ul className="mt-6 space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <Check className="h-4 w-4 text-primary mr-2" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className={`w-full ${plan.popular ? 'bg-primary text-primary-foreground' : ''}`} 
                      variant={plan.popular ? "default" : "outline"}
                    >
                      {plan.buttonText}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
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
                Everything you need to elevate your restaurant's dining experience
              </p>
            </div>
          </div>
          
          <div className="mt-10 overflow-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-4 px-4 text-left font-medium">Features</th>
                  <th className="py-4 px-4 text-center font-medium">Monthly</th>
                  <th className="py-4 px-4 text-center font-medium">Quarterly</th>
                  <th className="py-4 px-4 text-center font-medium">Annual</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-4 px-4 font-medium">Unlimited QR Table Generations</td>
                  <td className="py-4 px-4 text-center"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                  <td className="py-4 px-4 text-center"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                  <td className="py-4 px-4 text-center"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-4 font-medium">Real-time Order System</td>
                  <td className="py-4 px-4 text-center"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                  <td className="py-4 px-4 text-center"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                  <td className="py-4 px-4 text-center"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-4 font-medium">Order Customization</td>
                  <td className="py-4 px-4 text-center"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                  <td className="py-4 px-4 text-center"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                  <td className="py-4 px-4 text-center"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-4 font-medium">Analytics & Reporting</td>
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
                  <td className="py-4 px-4 font-medium">Inventory Management</td>
                  <td className="py-4 px-4 text-center">Basic</td>
                  <td className="py-4 px-4 text-center">Advanced</td>
                  <td className="py-4 px-4 text-center">Advanced</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-4 font-medium">Customer Loyalty System</td>
                  <td className="py-4 px-4 text-center">—</td>
                  <td className="py-4 px-4 text-center"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                  <td className="py-4 px-4 text-center"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-4 font-medium">POS Integration</td>
                  <td className="py-4 px-4 text-center">—</td>
                  <td className="py-4 px-4 text-center">—</td>
                  <td className="py-4 px-4 text-center"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-4 font-medium">AI Recommendations</td>
                  <td className="py-4 px-4 text-center">—</td>
                  <td className="py-4 px-4 text-center">—</td>
                  <td className="py-4 px-4 text-center"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-4 font-medium">Custom Mobile App</td>
                  <td className="py-4 px-4 text-center">—</td>
                  <td className="py-4 px-4 text-center">—</td>
                  <td className="py-4 px-4 text-center"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-medium">Dedicated Account Manager</td>
                  <td className="py-4 px-4 text-center">—</td>
                  <td className="py-4 px-4 text-center">—</td>
                  <td className="py-4 px-4 text-center"><Check className="h-5 w-5 text-primary mx-auto" /></td>
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
                Everything you need to know about our restaurant QR ordering system
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
                  All plans come with a 30-day free trial. You'll only be charged after your trial ends. 
                  You can cancel anytime during the trial period without being charged.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Can I change my plan later?</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Yes, you can upgrade, downgrade, or cancel your plan at any time. 
                  When upgrading, we'll prorate your billing to account for the remaining time on your current plan.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>What payment methods do you accept?</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  We accept all major credit cards, bank transfers, and local payment methods. 
                  For annual plans, we can also provide invoicing options for businesses.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Do you offer custom solutions?</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Yes! For restaurant chains or businesses with specific requirements, we offer custom 
                  enterprise solutions. Contact our sales team to discuss your needs.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}