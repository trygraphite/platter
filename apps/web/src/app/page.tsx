import { Comparison } from "@/components/comparison";
import { Features } from "@/components/features";
import { FeaturesOverview } from "@/components/features-overview";
import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Hero />
      <Features />
      <HowItWorks />
      <Comparison />
      <FeaturesOverview />
      {/* <CTASection />
      <Footer /> */}
    </div>
  );
};

export default Index;
