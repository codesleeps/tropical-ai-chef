import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { CostCalculator } from "@/components/CostCalculator";
import { Calculator } from "lucide-react";

const CostCalculatorPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <Navigation />
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 gradient-fresh bg-clip-text text-transparent flex items-center justify-center gap-2">
            <Calculator className="w-6 h-6" />
            AI Service Cost Calculator
          </h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            Understand the costs of running AI-powered recipe generation at
            scale. Perfect for developers and businesses planning to deploy
            similar apps.
          </p>
        </div>
        <CostCalculator />
      </div>
      <Footer />
    </div>
  );
};

export default CostCalculatorPage;