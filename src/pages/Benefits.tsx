import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Zap, Shield, Leaf, Brain, Sparkles } from 'lucide-react';

const Benefits = () => {
  const benefits = [
    {
      icon: Heart,
      title: "Heart Health",
      description: "Rich in antioxidants and potassium that support cardiovascular wellness",
      fruits: ["Mango", "Passion Fruit", "Kiwi"],
      color: "text-red-500"
    },
    {
      icon: Zap,
      title: "Natural Energy",
      description: "Natural sugars and vitamins provide sustained energy without crashes",
      fruits: ["Pineapple", "Dragon Fruit", "Papaya"],
      color: "text-yellow-500"
    },
    {
      icon: Shield,
      title: "Immune Boost",
      description: "High vitamin C content strengthens your body's natural defenses",
      fruits: ["Guava", "Kiwi", "Passion Fruit"],
      color: "text-blue-500"
    },
    {
      icon: Leaf,
      title: "Detoxification",
      description: "Natural enzymes help cleanse and detoxify your system",
      fruits: ["Pineapple", "Papaya", "Coconut"],
      color: "text-green-500"
    },
    {
      icon: Brain,
      title: "Mental Clarity",
      description: "B-vitamins and natural compounds support cognitive function",
      fruits: ["Dragon Fruit", "Mango", "Coconut"],
      color: "text-purple-500"
    },
    {
      icon: Sparkles,
      title: "Skin Health",
      description: "Vitamins A, C, and E promote healthy, glowing skin",
      fruits: ["Papaya", "Mango", "Passion Fruit"],
      color: "text-pink-500"
    }
  ];

  const nutritionFacts = [
    { nutrient: "Vitamin C", amount: "150-300%", daily: "Daily Value", benefit: "Immune support & collagen production" },
    { nutrient: "Fiber", amount: "8-12g", daily: "Per serving", benefit: "Digestive health & satiety" },
    { nutrient: "Potassium", amount: "600-900mg", daily: "Per serving", benefit: "Heart health & muscle function" },
    { nutrient: "Antioxidants", amount: "High", daily: "Content", benefit: "Cellular protection & anti-aging" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-sunset bg-clip-text text-transparent">
            Health Benefits
          </h1>
          <p className="text-xl text-foreground/70 mb-8 leading-relaxed">
            Discover the incredible health benefits of tropical fruits and how our AI-crafted 
            recipes can transform your wellness journey.
          </p>
          <div className="flex justify-center gap-4 text-4xl mb-8">
            🥭🍍🥝🐉🧡
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-secondary">
            Why Tropical Fruits Are Superfoods
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="shadow-tropical border-0 hover:scale-105 transition-bounce">
                <CardHeader className="text-center">
                  <benefit.icon className={`w-12 h-12 mx-auto mb-4 ${benefit.color}`} />
                  <CardTitle className="text-xl">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-base mb-4">
                    {benefit.description}
                  </CardDescription>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {benefit.fruits.map((fruit, fruitIndex) => (
                      <Badge key={fruitIndex} variant="secondary" className="text-xs">
                        {fruit}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Nutrition Facts */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-fresh bg-clip-text text-transparent">
            Nutritional Powerhouse
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {nutritionFacts.map((fact, index) => (
              <Card key={index} className="shadow-tropical border-0">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-lg text-primary">{fact.nutrient}</h3>
                    <div className="text-right">
                      <div className="font-bold text-xl text-secondary">{fact.amount}</div>
                      <div className="text-sm text-foreground/70">{fact.daily}</div>
                    </div>
                  </div>
                  <p className="text-foreground/80">{fact.benefit}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Juice Styles Benefits */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-secondary">
            Targeted Wellness Solutions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="shadow-tropical border-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
              <CardHeader className="text-center">
                <div className="text-4xl mb-4">🌿</div>
                <CardTitle className="text-xl text-accent">Detox Cleanse</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Flush out toxins naturally</li>
                  <li>• Support liver function</li>
                  <li>• Boost metabolism</li>
                  <li>• Improve digestion</li>
                  <li>• Enhance skin clarity</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-tropical border-0 bg-gradient-to-br from-yellow-50 to-orange-100 dark:from-yellow-950 dark:to-orange-900">
              <CardHeader className="text-center">
                <div className="text-4xl mb-4">⚡</div>
                <CardTitle className="text-xl text-primary">Energy Boost</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Sustained natural energy</li>
                  <li>• Enhanced mental focus</li>
                  <li>• Pre-workout fuel</li>
                  <li>• Reduce fatigue</li>
                  <li>• Improve athletic performance</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-tropical border-0 bg-gradient-to-br from-pink-50 to-purple-100 dark:from-pink-950 dark:to-purple-900">
              <CardHeader className="text-center">
                <div className="text-4xl mb-4">🥤</div>
                <CardTitle className="text-xl text-secondary">Creamy Smoothie</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Complete meal replacement</li>
                  <li>• Protein and fiber rich</li>
                  <li>• Long-lasting satiety</li>
                  <li>• Weight management</li>
                  <li>• Muscle recovery</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Benefits;