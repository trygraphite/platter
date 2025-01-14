import { QrCode, Send, ThumbsUp } from "lucide-react";

const steps = [
  {
    icon: QrCode,
    title: "Scan the QR Code",
    description: "Guests scan the QR code at their table",
  },
  {
    icon: Send,
    title: "Place Orders or Submit Feedback",
    description: "Easily order, review, or provide feedback with a few clicks",
  },
  {
    icon: ThumbsUp,
    title: "Enjoy Effortless Service",
    description: "Streamlined communication ensures a smooth dining experience",
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative group p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="absolute -top-8 left-1/2 -translate-x-1/2">
                <div className="w-16 h-16 bg-platter-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <step.icon className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="mt-8 text-center">
                <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};