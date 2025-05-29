"use client";
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@platter/ui/components/card';
import { Button } from '@platter/ui/components/button';
import { Input } from '@platter/ui/components/input';
import { Textarea } from '@platter/ui/components/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@platter/ui/components/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@platter/ui/components/select';
import { Alert, AlertDescription, AlertTitle } from '@platter/ui/components/alert';
import { Phone, Mail, MessageSquare, MapPin, Clock, CheckCircle2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@platter/ui/components/tabs';

export default function ContactPage() {
  const [formStatus, setFormStatus] = useState({ type: '', message: '' });
  const [activeTab, setActiveTab] = useState('inquiry');

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    },
  });

  const handleSubmit = (data: any) => {
    // Here you would typically connect to your API or email service
    console.log('Form submitted:', data);
    
    // Simulate form submission
    setFormStatus({
      type: 'success',
      message: 'Thank you for your message! We will get back to you soon.'
    });
    
    // Reset form
    form.reset();
    
    // Clear success message after 5 seconds
    setTimeout(() => {
      setFormStatus({ type: '', message: '' });
    }, 5000);
  };

  const openWhatsApp = () => {
    const phoneNumber = '2348149113328';
    const message = encodeURIComponent('Hello! I have a question about RestaurantQR.');
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="  bg-background">
      {/* Hero Section */}
      <section className="w-full  py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
        <div className="container container-wide px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Get in Touch</h1>
              <p className="max-w-[700px] text-muted-foreground md:text-xl">
                Have questions about our restaurant QR ordering system? We're here to help!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info and Form */}
      <section className="w-full py-12 container-wide md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-10 lg:grid-cols-2">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                <p className="text-muted-foreground mb-8">
                  Reach out to us using any of the following methods. For faster response, 
                  we recommend contacting us via WhatsApp.
                </p>
              </div>

              <div className="grid gap-6">
                <Card>
                  <CardHeader className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">WhatsApp (Faster Response)</CardTitle>
                        <CardDescription>Message us for immediate assistance</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="font-medium">+234 81 49113328</p>
                    <Button 
                      variant="outline" 
                      className="mt-3 w-full sm:w-auto"
                      onClick={openWhatsApp}
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Start WhatsApp Chat
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Email</CardTitle>
                        <CardDescription>Send us a message anytime</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="font-medium">support@restaurantqr.com</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      We aim to respond within 24 hours
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Business Hours</CardTitle>
                        <CardDescription>When you can reach our support team</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="font-medium">Monday - Friday</p>
                        <p className="text-sm text-muted-foreground">9:00 AM - 6:00 PM</p>
                      </div>
                      <div>
                        <p className="font-medium">Saturday</p>
                        <p className="text-sm text-muted-foreground">10:00 AM - 4:00 PM</p>
                      </div>
                      <div className="col-span-2 mt-2">
                        <p className="font-medium">Sunday</p>
                        <p className="text-sm text-muted-foreground">Closed</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
              <Card>
                <CardContent className="p-6">

                  {formStatus.type === 'success' && (
                    <Alert className="mb-6 bg-green-50 border-green-200">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <AlertTitle>Success!</AlertTitle>
                      <AlertDescription>
                        {formStatus.message}
                      </AlertDescription>
                    </Alert>
                  )}

                  {formStatus.type === 'error' && (
                    <Alert className="mb-6 bg-red-50 border-red-200" variant="destructive">
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>
                        {formStatus.message}
                      </AlertDescription>
                    </Alert>
                  )}

                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Your name"
                                  {...field}
                                  required
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="your.email@example.com"
                                  {...field}
                                  required
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid gap-4 sm:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number (Optional)</FormLabel>
                              <FormControl>
                                <Input
                                  type="tel"
                                  placeholder="+234 000 0000000"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="subject"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Subject</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a subject" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="general">General Inquiry</SelectItem>
                                  <SelectItem value="pricing">Pricing Question</SelectItem>
                                  <SelectItem value="demo">Request Demo</SelectItem>
                                  <SelectItem value="technical">Technical Support</SelectItem>
                                  <SelectItem value="feedback">Feedback</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="How can we help you?"
                                className="min-h-32"
                                {...field}
                                required
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" className="w-full">Send Message</Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full py-12 md:py-24 bg-muted/50">
        <div className="container-wide px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter">Common Questions</h2>
              <p className="max-w-[700px] text-muted-foreground md:text-lg">
                Find quick answers to frequently asked questions about our contact and support
              </p>
            </div>
          </div>
          
          <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-2 mt-10">
            <Card>
              <CardHeader>
                <CardTitle>What is your typical response time?</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  We aim to respond to all inquiries within 24 hours on business days. 
                  For faster support, we recommend contacting us via WhatsApp at +234 81 49113328.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Can I schedule a demo of the restaurant QR system?</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Yes! You can request a demo through our contact form or by sending a direct message 
                  on WhatsApp. Our team will arrange a convenient time to walk you through all the features.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Do you offer technical support for existing customers?</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Absolutely. Existing customers can reach out through any of our contact channels. 
                  Premium support is available for customers on higher-tier plans.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>I'm interested in custom features. Who should I talk to?</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  For custom feature requests and enterprise solutions, please indicate this in your message. 
                  Our solutions team will contact you to discuss your specific requirements and provide a custom quote.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}