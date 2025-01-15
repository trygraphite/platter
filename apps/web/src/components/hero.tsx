import { Button } from "@platter/ui/components/button";
import { QrCode, ArrowRight } from "lucide-react";

export const Hero = () => {
  return (
    <div className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-platter-secondary to-white overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-fade-up">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Transform Guest Experiences with{" "}
              <span className="text-platter-primary">Platter</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              A seamless QR-based system for ordering, reviews, and menu
              exploration
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-platter-primary hover:bg-platter-primary/90"
              >
                Try Platter for Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-platter-primary text-platter-primary hover:bg-platter-primary/10"
              >
                Learn More
              </Button>
            </div>
          </div>
          <div className="mt-16 animate-fade-in delay-300">
            <div className="relative mx-auto w-64 h-64 bg-white rounded-2xl shadow-xl p-4 flex items-center justify-center">
              <QrCode className="w-40 h-40 text-platter-primary animate-pulse" />
              <div className="absolute -right-4 -bottom-4 bg-platter-accent rounded-full p-3">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
