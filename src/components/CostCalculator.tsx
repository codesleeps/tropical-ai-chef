import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calculator,
  DollarSign,
  Users,
  Zap,
  TrendingUp,
  Save,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

export const CostCalculator = () => {
  const [dailyUsers, setDailyUsers] = useState(100);
  const [recipesPerUser, setRecipesPerUser] = useState(3);
  const [openaiCost, setOpenaiCost] = useState(0.006); // per recipe
  const [huggingfaceCost, setHuggingfaceCost] = useState(0.0015); // per recipe
  const [savedCalculations, setSavedCalculations] = useState<any[]>([]);

  const monthlyUsers = dailyUsers * 30;
  const monthlyRecipes = monthlyUsers * recipesPerUser;

  const openaiMonthlyCost = monthlyRecipes * openaiCost;
  const huggingfaceMonthlyCost = monthlyRecipes * huggingfaceCost;
  const localMonthlyCost = 0;

  // Handle saving calculation
  const handleSaveCalculation = () => {
    const calculation = {
      id: Date.now(),
      dailyUsers,
      recipesPerUser,
      monthlyRecipes,
      openaiMonthlyCost,
      huggingfaceMonthlyCost,
      savedAt: new Date().toLocaleDateString(),
    };
    setSavedCalculations((prev) => [calculation, ...prev.slice(0, 4)]);
    toast.success("Calculation saved! 💾", {
      description: `${monthlyRecipes.toLocaleString()} recipes/month scenario saved`,
    });
  };

  // Handle preset scenarios
  const applyPreset = (preset: string) => {
    switch (preset) {
      case "startup":
        setDailyUsers(50);
        setRecipesPerUser(2);
        toast.success("Applied Startup scenario! 🚀");
        break;
      case "growth":
        setDailyUsers(500);
        setRecipesPerUser(4);
        toast.success("Applied Growth scenario! 📈");
        break;
      case "enterprise":
        setDailyUsers(2000);
        setRecipesPerUser(5);
        toast.success("Applied Enterprise scenario! 🏢");
        break;
      default:
        setDailyUsers(100);
        setRecipesPerUser(3);
    }
  };

  const getCostBadge = (cost: number) => {
    if (cost === 0)
      return <Badge className="bg-green-100 text-green-800">FREE</Badge>;
    if (cost < 10)
      return <Badge className="bg-blue-100 text-blue-800">Low</Badge>;
    if (cost < 50)
      return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
    return <Badge className="bg-red-100 text-red-800">High</Badge>;
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-tropical">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold bg-gradient-fresh bg-clip-text text-transparent flex items-center gap-2">
          <Calculator className="w-6 h-6" />
          AI Service Cost Calculator
        </CardTitle>
        <CardDescription className="text-lg">
          Estimate costs for running your AI recipe generator
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Preset Scenarios */}
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              🎯 Quick Scenarios
            </h3>
            <p className="text-sm text-muted-foreground">
              Choose a preset or customize your own
            </p>
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => applyPreset("startup")}
              className="flex items-center gap-2 hover:scale-105 transition-all"
            >
              🚀 Startup (50/day)
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => applyPreset("growth")}
              className="flex items-center gap-2 hover:scale-105 transition-all"
            >
              📈 Growth (500/day)
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => applyPreset("enterprise")}
              className="flex items-center gap-2 hover:scale-105 transition-all"
            >
              🏢 Enterprise (2000/day)
            </Button>
          </div>
        </div>

        {/* Input Controls */}
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              ⚙️ Custom Parameters
            </h3>
            <p className="text-sm text-muted-foreground">
              Adjust the values to match your needs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dailyUsers" className="text-base font-medium">
                Daily Active Users
              </Label>
              <Input
                id="dailyUsers"
                type="number"
                value={dailyUsers}
                onChange={(e) => setDailyUsers(Number(e.target.value))}
                min="1"
                max="10000"
                className="h-12 text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="recipesPerUser" className="text-base font-medium">
                Recipes per User/Day
              </Label>
              <Input
                id="recipesPerUser"
                type="number"
                value={recipesPerUser}
                onChange={(e) => setRecipesPerUser(Number(e.target.value))}
                min="1"
                max="20"
                className="h-12 text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="openaiCost" className="text-base font-medium">
                OpenAI Cost per Recipe ($)
              </Label>
              <Input
                id="openaiCost"
                type="number"
                step="0.001"
                value={openaiCost}
                onChange={(e) => setOpenaiCost(Number(e.target.value))}
                min="0.001"
                max="0.1"
                className="h-12 text-lg"
              />
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              onClick={handleSaveCalculation}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Save className="w-4 h-4" />
              Save This Calculation
            </Button>
          </div>
        </div>

        {/* Usage Summary */}
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              📊 Usage Overview
            </h3>
            <p className="text-sm text-muted-foreground">
              Current scenario breakdown
            </p>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg border border-blue-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <div className="text-2xl font-bold text-blue-600">
                  {monthlyUsers.toLocaleString()}
                </div>
                <div className="text-sm font-medium text-blue-800">
                  Monthly Users
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-green-600">
                  {monthlyRecipes.toLocaleString()}
                </div>
                <div className="text-sm font-medium text-green-800">
                  Monthly Recipes
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-purple-600">
                  {(dailyUsers * recipesPerUser).toLocaleString()}
                </div>
                <div className="text-sm font-medium text-purple-800">
                  Daily Recipes
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cost Comparison */}
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-foreground mb-2">
              💰 Monthly Cost Comparison
            </h3>
            <p className="text-sm text-muted-foreground">
              Compare different AI service costs for your scenario
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Local AI */}
            <Card className="border-green-200 bg-green-50/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  🤖 Local AI
                  {getCostBadge(localMonthlyCost)}
                </CardTitle>
                <CardDescription>Built-in intelligence</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600 mb-2">
                  ${localMonthlyCost.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>✅ Always available</div>
                  <div>✅ No API limits</div>
                  <div>✅ Instant generation</div>
                  <div>✅ Good quality</div>
                </div>
              </CardContent>
            </Card>

            {/* Hugging Face */}
            <Card className="border-blue-200 bg-blue-50/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  🤗 Hugging Face
                  {getCostBadge(huggingfaceMonthlyCost)}
                </CardTitle>
                <CardDescription>Budget AI option</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  ${huggingfaceMonthlyCost.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>💰 Very affordable</div>
                  <div>🌐 Good quality</div>
                  <div>📊 Free tier available</div>
                  <div>⚡ Fast response</div>
                </div>
              </CardContent>
            </Card>

            {/* OpenAI */}
            <Card className="border-purple-200 bg-purple-50/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  🧠 OpenAI
                  {getCostBadge(openaiMonthlyCost)}
                </CardTitle>
                <CardDescription>Premium AI service</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600 mb-2">
                  ${openaiMonthlyCost.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>🌟 Best quality</div>
                  <div>💎 Most creative</div>
                  <div>🔑 API key required</div>
                  <div>📈 Scales with usage</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg border border-blue-200">
          <h3 className="font-semibold mb-3 flex items-center gap-2 text-blue-800">
            <Zap className="w-4 h-4" />
            Recommendations for Giveaway Apps
          </h3>
          <div className="space-y-2 text-sm text-blue-700">
            <div>
              <strong>🎯 For 100-1000 users:</strong> Local AI only (FREE) -
              Perfect for giveaways!
            </div>
            <div>
              <strong>💰 For 1000-5000 users:</strong> Local AI + Hugging Face
              fallback (~$5-15/month)
            </div>
            <div>
              <strong>💎 For 5000+ users:</strong> Local AI + OpenAI for premium
              features (~$50-200/month)
            </div>
            <div>
              <strong>🚀 Best strategy:</strong> Start with Local AI, add
              premium options later
            </div>
          </div>
        </div>

        {/* Cost Breakdown */}
        <div className="space-y-3">
          <h3 className="font-semibold">Detailed Cost Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-medium mb-2">Local AI (Recommended)</div>
              <div className="space-y-1 text-muted-foreground">
                <div>• Setup cost: $0</div>
                <div>• Monthly cost: $0</div>
                <div>• Per recipe: $0</div>
                <div>• Best for: Giveaways, startups</div>
              </div>
            </div>
            <div>
              <div className="font-medium mb-2">External AI Services</div>
              <div className="space-y-1 text-muted-foreground">
                <div>• Hugging Face: ~$0.0015/recipe</div>
                <div>• OpenAI: ~$0.006/recipe</div>
                <div>• 1000 recipes/month: $1.50 - $6</div>
                <div>• 10,000 recipes/month: $15 - $60</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
