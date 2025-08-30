import { TropicalHero } from "@/components/TropicalHero";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ChefHat,
  Sparkles,
  Heart,
  Star,
  Users,
  Zap,
  Leaf,
  Shield,
  ArrowRight,
  Play,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/recipes");
  };

  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Recipes",
      description:
        "Get personalized juice recipes created by advanced AI that considers your taste preferences and health goals.",
      color: "text-secondary",
    },
    {
      icon: Leaf,
      title: "100% Natural Ingredients",
      description:
        "Only the freshest tropical fruits with no artificial additives, preservatives, or sweeteners.",
      color: "text-accent",
    },
    {
      icon: Heart,
      title: "Health-Focused Blends",
      description:
        "Every recipe is designed to maximize nutritional benefits while delivering incredible taste.",
      color: "text-primary",
    },
    {
      icon: Shield,
      title: "Quality Guaranteed",
      description:
        "Premium sourcing from sustainable farms with rigorous quality control standards.",
      color: "text-secondary",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      location: "Miami, FL",
      rating: 5,
      comment:
        "The AI recipe generator is incredible! It created the perfect detox blend for my morning routine.",
      avatar: "👩‍💼",
    },
    {
      name: "Mike Chen",
      location: "Los Angeles, CA",
      rating: 5,
      comment:
        "Fresh ingredients, amazing flavors, and the delivery is always on time. Highly recommended!",
      avatar: "👨‍💻",
    },
    {
      name: "Emma Rodriguez",
      location: "New York, NY",
      rating: 5,
      comment:
        "Finally found healthy juices that actually taste amazing. The tropical blends are my favorite!",
      avatar: "👩‍🎨",
    },
  ];

  const stats = [
    { number: "50K+", label: "Recipes Created", icon: "🧪" },
    { number: "25+", label: "Tropical Fruits", icon: "🥭" },
    { number: "95%", label: "Customer Satisfaction", icon: "⭐" },
    { number: "24/7", label: "Fresh Delivery", icon: "🚚" },
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-sm ${
          i < rating ? "text-yellow-400" : "text-gray-300"
        }`}
      >
        ⭐
      </span>
    ));
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <TropicalHero onGetStarted={handleGetStarted} />

      {/* Features */}
      <section className="py-20 px-6 bg-muted/30 mt-16">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Features
            </h2>
            <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
              Experience the perfect fusion of cutting-edge AI technology and
              nature's finest tropical fruits
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="shadow-tropical border-0 hover:scale-105 transition-bounce text-center"
              >
                <CardHeader>
                  <feature.icon
                    className={`w-12 h-12 mx-auto mb-4 ${feature.color}`}
                  />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Stats
            </h2>
            <p className="text-sm text-muted-foreground">
              Join our growing community of healthy living enthusiasts
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-foreground/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              How It Works
            </h2>
            <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
              Creating your perfect tropical juice is as easy as 1-2-3
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <Card className="shadow-tropical border-0 relative">
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                1
              </div>
              <CardHeader className="text-center pt-8">
                <div className="text-5xl mb-4">🎯</div>
                <CardTitle className="text-xl text-primary">
                  Choose Your Preferences
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Select your favorite fruits, dietary needs, and wellness
                  goals. Our AI learns your unique taste profile.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="shadow-tropical border-0 relative">
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-secondary-foreground font-bold">
                2
              </div>
              <CardHeader className="text-center pt-8">
                <div className="text-5xl mb-4">🧠</div>
                <CardTitle className="text-xl text-secondary">
                  AI Creates Your Recipe
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Advanced algorithms analyze thousands of combinations to craft
                  the perfect blend just for you.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="shadow-tropical border-0 relative">
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-accent rounded-full flex items-center justify-center text-accent-foreground font-bold">
                3
              </div>
              <CardHeader className="text-center pt-8">
                <div className="text-5xl mb-4">🥤</div>
                <CardTitle className="text-xl text-accent">
                  Enjoy Fresh Delivery
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Get your personalized juices delivered fresh to your door,
                  made with premium tropical fruits.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Link to="/recipes">
              <Button
                size="lg"
                className="gradient-tropical text-foreground font-bold text-lg px-8 py-6 hover:scale-105 transition-bounce shadow-tropical"
              >
                <Play className="w-6 h-6 mr-2" />
                Try Our AI Generator
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Testimonials
            </h2>
            <p className="text-xl text-foreground/70">
              Join thousands of happy customers who've transformed their health
              with our tropical juices
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="shadow-tropical border-0 hover:scale-105 transition-bounce"
              >
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-3xl">{testimonial.avatar}</div>
                    <div>
                      <CardTitle className="text-lg">
                        {testimonial.name}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {testimonial.location}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex justify-center mb-4">
                    {renderStars(testimonial.rating)}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/80 text-center italic">
                    "{testimonial.comment}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Get Started */}
      <section className="py-20 px-6 bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-4 text-6xl">🌟✨🥭</div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Get Started
          </h2>
          <p className="text-xl text-foreground/80 mb-8 max-w-2xl mx-auto">
            Create your first AI-powered tropical juice recipe today and
            discover flavors you never knew existed
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/recipes">
              <Button
                size="lg"
                className="gradient-tropical text-foreground font-bold text-lg px-8 py-6 hover:scale-105 transition-bounce shadow-tropical"
              >
                <ChefHat className="w-6 h-6 mr-2" />
                Create My Recipe
              </Button>
            </Link>
            <Link to="/benefits">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 hover:scale-105 transition-bounce"
              >
                <Heart className="w-6 h-6 mr-2" />
                Learn Health Benefits
              </Button>
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Index;
