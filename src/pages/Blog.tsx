import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, User, Search, ArrowRight } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import heroImage from "@/assets/tropical-hero.jpg";

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category");

  const blogPosts = [
    // Superfruits Category
    {
      id: 1,
      title:
        "The Ultimate Guide to Dragon Fruit: Nature's Most Exotic Superfruit",
      slug: "dragon-fruit-guide",
      excerpt:
        "Discover the incredible health benefits and unique flavor profile of dragon fruit, plus 5 amazing juice recipes to try today.",
      author: "Sophie Williams",
      date: "2025-01-15",
      readTime: "8 min read",
      category: "Superfruits",
      image: "🐉",
      tags: ["Dragon Fruit", "Antioxidants", "Recipes", "Superfood"],
    },
    {
      id: 2,
      title:
        "Acai Berries: The Amazonian Superfruit Taking the World by Storm",
      slug: "acai-berries",
      excerpt:
        "Learn about the powerful antioxidants in acai and how this Brazilian berry can boost your immune system and energy levels.",
      author: "Maria Rodriguez",
      date: "2025-02-20",
      readTime: "6 min read",
      category: "Superfruits",
      image: "🫐",
      tags: ["Acai", "Antioxidants", "Amazon", "Superfood"],
    },
    {
      id: 3,
      title:
        "Mangosteen: The Queen of Tropical Fruits",
      slug: "mangosteen-queen",
      excerpt:
        "Explore the anti-inflammatory properties of mangosteen and why it's considered one of the most nutritious tropical fruits.",
      author: "James Chen",
      date: "2025-03-10",
      readTime: "7 min read",
      category: "Superfruits",
      image: "🥭",
      tags: ["Mangosteen", "Anti-inflammatory", "Vitamins"],
    },
    // Recipes Category
    {
      id: 4,
      title: "Morning Energy Boost: 7 Tropical Juice Recipes to Start Your Day",
      slug: "morning-energy-boost",
      excerpt:
        "Transform your mornings with these energizing tropical juice blends that provide sustained energy without the coffee crash.",
      author: "Maria Rodriguez",
      date: "2025-01-12",
      readTime: "6 min read",
      category: "Recipes",
      image: "⚡",
      tags: ["Energy", "Morning", "Breakfast", "Recipes"],
    },
    {
      id: 5,
      title:
        "Tropical Smoothie Bowl Recipes: Instagram-Worthy Breakfast Ideas",
      slug: "tropical-smoothie-bowls",
      excerpt:
        "Create beautiful and nutritious smoothie bowls at home with these easy tropical fruit combinations.",
      author: "Sophie Williams",
      date: "2025-02-05",
      readTime: "5 min read",
      category: "Recipes",
      image: "🥣",
      tags: ["Smoothie Bowl", "Breakfast", "Recipes", "Instagram"],
    },
    {
      id: 6,
      title:
        "Detox Cleanse Recipes: 3-Day Tropical Juice Reset",
      slug: "detox-cleanse-recipes",
      excerpt:
        "A complete guide to doing a juice cleanse with tropical fruits to reset your system naturally.",
      author: "James Chen",
      date: "2025-03-01",
      readTime: "10 min read",
      category: "Recipes",
      image: "🥤",
      tags: ["Detox", "Cleanse", "Recipes", "Reset"],
    },
    // Health Category
    {
      id: 7,
      title:
        "Detox vs. Cleanse: Understanding the Science Behind Juice Cleanses",
      slug: "detox-vs-cleanse",
      excerpt:
        "Separate fact from fiction in the world of juice cleanses and learn how to detox your body naturally and safely.",
      author: "James Chen",
      date: "2025-01-10",
      readTime: "10 min read",
      category: "Health",
      image: "🌿",
      tags: ["Detox", "Science", "Health", "Cleansing"],
    },
    {
      id: 8,
      title:
        "Heart Health and Tropical Fruits: What the Latest Research Shows",
      slug: "heart-health-tropical",
      excerpt:
        "Discover how tropical fruits can support cardiovascular health and lower risk of heart disease.",
      author: "Dr. Emily Santos",
      date: "2025-02-15",
      readTime: "8 min read",
      category: "Health",
      image: "❤️",
      tags: ["Heart Health", "Cardiovascular", "Research", "Vitamins"],
    },
    {
      id: 9,
      title:
        "Boost Your Immune System with These Tropical Powerhouses",
      slug: "immune-system-boost",
      excerpt:
        "Learn which tropical fruits are packed with vitamin C and immune-boosting nutrients.",
      author: "Maria Rodriguez",
      date: "2025-03-05",
      readTime: "6 min read",
      category: "Health",
      image: "🛡️",
      tags: ["Immune System", "Vitamin C", "Health", "Nutrition"],
    },
    // Sustainability Category
    {
      id: 10,
      title: "Sustainable Sourcing: How We Support Tropical Fruit Farmers",
      slug: "sustainable-sourcing",
      excerpt:
        "Learn about our commitment to fair trade and sustainable farming practices that benefit both farmers and the environment.",
      author: "Sophie Williams",
      date: "2025-01-08",
      readTime: "5 min read",
      category: "Sustainability",
      image: "🌱",
      tags: ["Sustainability", "Fair Trade", "Farmers", "Environment"],
    },
    {
      id: 11,
      title:
        "The Future of Tropical Agriculture: Regenerative Farming Practices",
      slug: "regenerative-farming",
      excerpt:
        "How regenerative agriculture is transforming tropical fruit farming and combating climate change.",
      author: "Carlos Mendez",
      date: "2025-02-28",
      readTime: "7 min read",
      category: "Sustainability",
      image: "🌍",
      tags: ["Regenerative", "Agriculture", "Climate", "Farming"],
    },
    {
      id: 12,
      title:
        "Zero-Waste Tropical Juicing: Tips for an Eco-Friendly Kitchen",
      slug: "zero-waste-juicing",
      excerpt:
        "Reduce food waste with these creative tips for using every part of tropical fruits in your kitchen.",
      author: "Ana Costa",
      date: "2025-03-12",
      readTime: "4 min read",
      category: "Sustainability",
      image: "♻️",
      tags: ["Zero Waste", "Eco-Friendly", "Tips", "Kitchen"],
    },
    // Technology Category
    {
      id: 13,
      title:
        "AI-Powered Nutrition: How Technology is Revolutionizing Healthy Eating",
      slug: "ai-powered-nutrition",
      excerpt:
        "Explore how artificial intelligence is making personalized nutrition more accessible and effective than ever before.",
      author: "James Chen",
      date: "2025-01-05",
      readTime: "7 min read",
      category: "Technology",
      image: "🤖",
      tags: ["AI", "Technology", "Nutrition", "Personalization"],
    },
    {
      id: 14,
      title:
        "Smart Kitchen Gadgets Every Health Enthusiast Needs in 2025",
      slug: "smart-kitchen-gadgets",
      excerpt:
        "From AI-powered juicers to smart fridges, discover the latest technology for healthy living.",
      author: "Tech Team",
      date: "2025-02-10",
      readTime: "6 min read",
      category: "Technology",
      image: "📱",
      tags: ["Smart Gadgets", "Technology", "Kitchen", "Innovation"],
    },
    {
      id: 15,
      title:
        "Blockchain Tracking: Ensuring Transparency in Your Juice",
      slug: "blockchain-tracking",
      excerpt:
        "How we're using blockchain technology to trace tropical fruits from farm to glass.",
      author: "Digital Team",
      date: "2025-03-08",
      readTime: "5 min read",
      category: "Technology",
      image: "🔗",
      tags: ["Blockchain", "Transparency", "Tracking", "Supply Chain"],
    },
    // Beauty Category
    {
      id: 16,
      title: "Tropical Fruits for Skin Health: Beauty from the Inside Out",
      slug: "skin-health-tropical",
      excerpt:
        "Discover which tropical fruits can help you achieve glowing, healthy skin naturally through proper nutrition.",
      author: "Maria Rodriguez",
      date: "2025-01-03",
      readTime: "6 min read",
      category: "Beauty",
      image: "✨",
      tags: ["Skin Health", "Beauty", "Vitamins", "Natural"],
    },
    {
      id: 17,
      title:
        "DIY Tropical Face Masks: Natural Beauty Treatments at Home",
      slug: "diy-face-masks",
      excerpt:
        "Create effective face masks using tropical fruits for glowing, healthy skin.",
      author: "Beauty Team",
      date: "2025-02-22",
      readTime: "5 min read",
      category: "Beauty",
      image: "🧴",
      tags: ["DIY", "Face Mask", "Natural", "Home Remedies"],
    },
    {
      id: 18,
      title:
        "Hair Health Secrets: Tropical Fruits for Stronger, Shinier Hair",
      slug: "hair-health-secrets",
      excerpt:
        "Learn which tropical fruits promote hair growth and overall hair health from the inside out.",
      author: "Sophie Williams",
      date: "2025-03-15",
      readTime: "4 min read",
      category: "Beauty",
      image: "💇‍♀️",
      tags: ["Hair Health", "Beauty", "Nutrition", "Growth"],
    },
  ];

  const categories = [
    "All",
    "Recipes",
    "Health",
    "Superfruits",
    "Technology",
    "Sustainability",
    "Beauty",
  ];

  const filteredPosts = useMemo(() => {
    let posts = blogPosts;
    
    // Filter by category from URL if present
    if (selectedCategory && selectedCategory !== "All") {
      posts = posts.filter(post => post.category === selectedCategory);
    }
    
    if (!searchTerm.trim()) return posts;
    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
  }, [searchTerm, selectedCategory]);

  const handleCategoryClick = (category: string) => {
    if (category === "All") {
      setSearchParams({});
    } else {
      setSearchParams({ category });
    }
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        {/* Blog Introduction Section */}
        <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${heroImage})` }}
          >
            <div className="absolute inset-0 bg-black/60 bg-gradient-to-br from-secondary/30 via-background/90 to-accent/30" />
          </div>
          <div className="relative z-10 container mx-auto max-w-4xl text-center px-6">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent drop-shadow-xl">
              Benefits
            </h1>
            <p className="text-xl md:text-2xl text-foreground/80 mb-8 max-w-3xl mx-auto leading-relaxed">
              Expert insights, delicious recipes, and the latest research on
              tropical nutrition and healthy living.
            </p>

            {/* Search Bar */}
            <div className="max-w-md mx-auto relative">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/50 w-4 h-4" />
                  <Input
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                    }}
                    className="pl-10 transition-smooth focus:shadow-glow bg-card/80 backdrop-blur-sm"
                  />
                </div>
                <Button 
                  onClick={() => {
                    // Search is automatic via onChange, this button is for accessibility
                  }}
                  className="gradient-tropical"
                >
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="px-6 pb-8">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2 text-secondary">
                Categories
              </h2>
              <p className="text-sm text-muted-foreground">
                Find articles that match your interests
              </p>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-smooth"
                  onClick={() => handleCategoryClick(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </section>

        {/* Articles */}
        <section className="px-6 pb-16">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-2 text-secondary">
                Articles
              </h2>
              <p className="text-sm text-muted-foreground">
                Expert knowledge and delicious recipes for your wellness journey
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <Card
                  key={post.id}
                  className="shadow-tropical border-0 hover:scale-105 transition-bounce cursor-pointer"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-3">
                      <Badge 
                        variant="secondary" 
                        className="cursor-pointer hover:bg-secondary/80"
                        onClick={() => handleCategoryClick(post.category)}
                      >
                        {post.category}
                      </Badge>
                      <div className="text-3xl">{post.image}</div>
                    </div>
                    <CardTitle className="text-lg leading-tight hover:text-primary transition-smooth">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-xs text-foreground/60 mb-4">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {post.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(post.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-foreground/60">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </div>
                      <Button
                        asChild
                        size="sm"
                        variant="ghost"
                        className="text-primary hover:text-primary-foreground hover:bg-primary"
                      >
                        <Link to={`/blog/${post.slug}`}>
                          Read More <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {post.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-16 px-6 bg-muted/30">
          <div className="container mx-auto max-w-2xl text-center">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2 bg-gradient-fresh bg-clip-text text-transparent">
                Newsletter
              </h2>
              <p className="text-foreground/70 mb-4">
                Get the latest articles, recipes, and wellness tips delivered to
                your inbox weekly.
              </p>
            </div>
            <div className="flex gap-4 max-w-md mx-auto">
              <Input placeholder="Enter your email" className="flex-1" />
              <Button className="gradient-tropical text-foreground">
                Subscribe
              </Button>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Blog;
