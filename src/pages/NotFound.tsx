import { useLocation, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import {
  ChefHat,
  Home,
  ArrowLeft,
  Search,
  Compass,
  RefreshCw,
} from "lucide-react";
import { Input } from "@/components/ui/input";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [autoRedirect, setAutoRedirect] = useState(true);

  // Common pages that users might be looking for
  const commonPages = [
    {
      name: "Recipe Generator",
      path: "/recipes",
      icon: ChefHat,
      description: "Create AI-powered tropical juice recipes",
    },
    {
      name: "About Us",
      path: "/about",
      icon: Compass,
      description: "Learn about our mission and story",
    },
    {
      name: "Health Benefits",
      path: "/benefits",
      icon: RefreshCw,
      description: "Discover the power of tropical fruits",
    },
    {
      name: "Blog",
      path: "/blog",
      icon: Search,
      description: "Read our latest articles and tips",
    },
  ];

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );

    // Auto-redirect countdown
    if (autoRedirect && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (autoRedirect && countdown === 0) {
      navigate("/");
    }
  }, [location.pathname, countdown, autoRedirect, navigate]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Simple search logic - redirect to relevant pages based on keywords
      const query = searchQuery.toLowerCase();
      if (query.includes("recipe") || query.includes("generate")) {
        navigate("/recipes");
      } else if (query.includes("about") || query.includes("story")) {
        navigate("/about");
      } else if (query.includes("benefit") || query.includes("health")) {
        navigate("/benefits");
      } else if (query.includes("blog") || query.includes("article")) {
        navigate("/blog");
      } else {
        navigate("/");
      }
    }
  };

  const handleStayOnPage = () => {
    setAutoRedirect(false);
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="w-full max-w-4xl text-center space-y-8">
          {/* 404 Hero */}
          <div className="space-y-6">
            <div className="text-9xl md:text-[12rem] font-bold bg-gradient-tropical bg-clip-text text-transparent opacity-20">
              404
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-sunset bg-clip-text text-transparent">
                Oops! Page Not Found
              </h1>
              <p className="text-xl md:text-2xl text-foreground/70 max-w-2xl mx-auto">
                The page you're looking for seems to have drifted away like a
                tropical breeze.
              </p>
              <p className="text-base text-foreground/60">
                Requested path:{" "}
                <code className="bg-muted px-2 py-1 rounded text-sm">
                  {location.pathname}
                </code>
              </p>
            </div>
          </div>

          {/* Auto-redirect notice */}
          {autoRedirect && countdown > 0 && (
            <Card className="mx-auto max-w-md bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <p className="text-sm text-foreground/70">
                  Redirecting to home page in{" "}
                  <span className="font-bold text-primary">{countdown}</span>{" "}
                  seconds...
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleStayOnPage}
                  className="mt-2 text-xs"
                >
                  Cancel redirect
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Search */}
          <Card className="mx-auto max-w-md">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 justify-center">
                <Search className="w-5 h-5" />
                Looking for something specific?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="flex gap-2">
                <Input
                  placeholder="Search our site..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" size="sm">
                  Search
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Quick Navigation */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground/80">
              Popular Destinations
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {commonPages.map((page) => (
                <Card
                  key={page.path}
                  className="hover:scale-105 transition-bounce cursor-pointer shadow-tropical"
                  onClick={() => navigate(page.path)}
                >
                  <CardHeader className="text-center pb-2">
                    <page.icon className="w-8 h-8 mx-auto text-primary mb-2" />
                    <CardTitle className="text-lg">{page.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center text-sm">
                      {page.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate("/")}
              className="gradient-tropical text-foreground font-bold"
              size="lg"
            >
              <Home className="w-5 h-5 mr-2" />
              Go to Homepage
            </Button>
            <Button onClick={() => navigate(-1)} variant="outline" size="lg">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Go Back
            </Button>
          </div>

          {/* Helpful Info */}
          <Card className="mx-auto max-w-lg bg-muted/30">
            <CardContent className="pt-6">
              <p className="text-sm text-foreground/60">
                <strong>Need help?</strong> If you believe this is an error,
                please contact our support team or try refreshing the page.
                We're always here to help you find what you need!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default NotFound;
