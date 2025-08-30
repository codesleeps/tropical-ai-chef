import { useState } from "react";
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
import { Calendar, Clock, User, Search } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const blogPosts = [
    {
      id: 1,
      title:
        "The Ultimate Guide to Dragon Fruit: Nature's Most Exotic Superfruit",
      excerpt:
        "Discover the incredible health benefits and unique flavor profile of dragon fruit, plus 5 amazing juice recipes to try today.",
      author: "Sophie Williams",
      date: "2024-01-15",
      readTime: "8 min read",
      category: "Superfruits",
      image: "🐉",
      tags: ["Dragon Fruit", "Antioxidants", "Recipes"],
    },
    {
      id: 2,
      title: "Morning Energy Boost: 7 Tropical Juice Recipes to Start Your Day",
      excerpt:
        "Transform your mornings with these energizing tropical juice blends that provide sustained energy without the coffee crash.",
      author: "Maria Rodriguez",
      date: "2024-01-12",
      readTime: "6 min read",
      category: "Recipes",
      image: "⚡",
      tags: ["Energy", "Morning", "Breakfast"],
    },
    {
      id: 3,
      title:
        "Detox vs. Cleanse: Understanding the Science Behind Juice Cleanses",
      excerpt:
        "Separate fact from fiction in the world of juice cleanses and learn how to detox your body naturally and safely.",
      author: "James Chen",
      date: "2024-01-10",
      readTime: "10 min read",
      category: "Health",
      image: "🌿",
      tags: ["Detox", "Science", "Health"],
    },
    {
      id: 4,
      title: "Sustainable Sourcing: How We Support Tropical Fruit Farmers",
      excerpt:
        "Learn about our commitment to fair trade and sustainable farming practices that benefit both farmers and the environment.",
      author: "Sophie Williams",
      date: "2024-01-08",
      readTime: "5 min read",
      category: "Sustainability",
      image: "🌱",
      tags: ["Sustainability", "Fair Trade", "Farmers"],
    },
    {
      id: 5,
      title:
        "AI-Powered Nutrition: How Technology is Revolutionizing Healthy Eating",
      excerpt:
        "Explore how artificial intelligence is making personalized nutrition more accessible and effective than ever before.",
      author: "James Chen",
      date: "2024-01-05",
      readTime: "7 min read",
      category: "Technology",
      image: "🤖",
      tags: ["AI", "Technology", "Nutrition"],
    },
    {
      id: 6,
      title: "Tropical Fruits for Skin Health: Beauty from the Inside Out",
      excerpt:
        "Discover which tropical fruits can help you achieve glowing, healthy skin naturally through proper nutrition.",
      author: "Maria Rodriguez",
      date: "2024-01-03",
      readTime: "6 min read",
      category: "Beauty",
      image: "✨",
      tags: ["Skin Health", "Beauty", "Vitamins"],
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

  const filteredPosts = blogPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        {/* Blog Introduction Section */}
        <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/30 via-background/90 to-accent/30" />
          <div className="relative z-10 container mx-auto max-w-4xl text-center px-6">
            <div className="flex justify-center mb-6">
              <div className="flex items-center gap-4 text-6xl">📚✨🌿</div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-sunset bg-clip-text text-transparent leading-tight">
              Tropical
              <br />
              Wellness Blog
            </h1>
            <p className="text-xl md:text-2xl text-foreground/80 mb-8 max-w-3xl mx-auto leading-relaxed">
              Expert insights, delicious recipes, and the latest research on
              tropical nutrition and healthy living.
            </p>

            {/* Search Bar */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/50 w-4 h-4" />
              <Input
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 transition-smooth focus:shadow-glow bg-card/80 backdrop-blur-sm"
              />
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
                  variant="outline"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-smooth"
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
                      <Badge variant="secondary">{post.category}</Badge>
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
                        size="sm"
                        variant="ghost"
                        className="text-primary hover:text-primary-foreground hover:bg-primary"
                      >
                        Read More
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
