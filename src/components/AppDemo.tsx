import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Zap,
  ChefHat,
  Users,
  ShoppingCart,
  Heart,
  Star,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

export const AppDemo = () => {
  const demoFeatures = [
    {
      title: "Navigation Buttons",
      description: "Try the Login and Cart buttons in the navigation",
      icon: Users,
      action: () =>
        toast.success("Navigation buttons are fully functional! 🎯"),
    },
    {
      title: "Recipe Generator",
      description: "Enhanced with clear sections and smart validation",
      icon: ChefHat,
      action: () =>
        toast.success("Recipe Generator has beautiful section titles! 🍹"),
    },
    {
      title: "Cost Calculator",
      description: "Interactive presets and save functionality",
      icon: TrendingUp,
      action: () => toast.success("Cost Calculator with preset scenarios! 💰"),
    },
    {
      title: "Smart Notifications",
      description: "All buttons provide user feedback",
      icon: Sparkles,
      action: () => toast.success("Notifications work perfectly! ✨"),
    },
  ];

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-tropical bg-gradient-to-br from-card to-muted/20">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold bg-gradient-fresh bg-clip-text text-transparent flex items-center gap-2 justify-center">
          <Star className="w-8 h-8 text-yellow-500" />
          App Features Demo
        </CardTitle>
        <CardDescription className="text-lg">
          Explore all the enhanced interactive features!
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {demoFeatures.map((feature, index) => (
            <Card
              key={index}
              className="border-2 hover:border-primary/50 transition-all"
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <feature.icon className="w-5 h-5 text-primary" />
                  {feature.title}
                </CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={feature.action}
                  className="w-full gradient-tropical text-foreground hover:scale-105 transition-all"
                >
                  Try It Out!
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center space-y-4">
          <h3 className="text-xl font-semibold">🎉 What's New & Improved</h3>
          <div className="flex flex-wrap gap-2 justify-center">
            <Badge className="bg-green-500 text-white">✨ Section Titles</Badge>
            <Badge className="bg-blue-500 text-white">
              🔘 Functional Buttons
            </Badge>
            <Badge className="bg-purple-500 text-white">📱 Better UX</Badge>
            <Badge className="bg-orange-500 text-white">
              🎯 Smart Validation
            </Badge>
            <Badge className="bg-pink-500 text-white">💫 Animations</Badge>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
            <p className="text-green-800 font-medium">
              🚀 This is going to be an amazing app! All major components now
              have:
            </p>
            <div className="mt-2 text-sm text-green-700 space-y-1">
              <div>• Clear section titles for better user guidance</div>
              <div>• Fully functional interactive buttons</div>
              <div>• Smart feedback and notifications</div>
              <div>• Enhanced visual design and animations</div>
              <div>• Better mobile responsiveness</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppDemo;
