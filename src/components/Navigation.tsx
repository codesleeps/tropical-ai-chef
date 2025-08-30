import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import {
  Menu,
  ShoppingCart,
  User,
  Leaf,
  ChefHat,
  ChevronDown,
  Heart,
  LogIn,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAnalytics } from "@/hooks/use-analytics";
import { toast } from "sonner";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartItems, setCartItems] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(3);
  const location = useLocation();
  const { trackEvent } = useAnalytics();

  // Handle login/logout
  const handleAuthAction = () => {
    if (isLoggedIn) {
      setIsLoggedIn(false);
      setCartItems(0);
      setFavoriteCount(0);
      toast.success("Successfully logged out! 👋");
      trackEvent("user_logout", { from_page: location.pathname });
    } else {
      setIsLoggedIn(true);
      setCartItems(2);
      setFavoriteCount(3);
      toast.success("Welcome back! 🌴", {
        description: "You're now logged in to Tropical AI Chef",
      });
      trackEvent("user_login", { from_page: location.pathname });
    }
  };

  // Handle cart action
  const handleCartAction = () => {
    if (!isLoggedIn) {
      toast.info("Please log in to access your cart 🛒", {
        description: "Create an account to save your favorite recipes",
      });
      trackEvent("cart_access_attempted", { authenticated: false });
      return;
    }

    toast.success(`Cart opened! You have ${cartItems} items 🛍️`, {
      description:
        cartItems > 0
          ? "Ready to checkout?"
          : "Add some recipes to get started",
    });
    trackEvent("cart_opened", {
      cart_items: cartItems,
      from_page: location.pathname,
    });
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Recipe Generator", path: "/recipes" },
    { name: "About", path: "/about" },
    { name: "Benefits", path: "/benefits" },
    { name: "Blog", path: "/blog" },
    { name: "Orders", path: "/orders" },
  ];

  const vegetableItems = [
    { name: "Kale", path: "/vegetables/kale" },
    { name: "Cucumber", path: "/vegetables/cucumber" },
    { name: "Spinach", path: "/vegetables/spinach" },
    { name: "Beetroot", path: "/vegetables/beetroot" },
    { name: "Ginger", path: "/vegetables/ginger" },
    { name: "Sorrel (Hibiscus)", path: "/vegetables/sorrel" },
  ];

  const fruitItems = [
    { name: "Apples", path: "/fruits/apples" },
    { name: "Strawberries", path: "/fruits/strawberries" },
    { name: "Blueberries", path: "/fruits/blueberries" },
    { name: "Pomegranate", path: "/fruits/pomegranate" },
    { name: "Raspberries", path: "/fruits/raspberries" },
    { name: "Blackberries", path: "/fruits/blackberries" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex items-center gap-2">
              <ChefHat className="w-6 h-6 text-primary" />
              <Leaf className="w-5 h-5 text-accent" />
            </div>
            <span className="font-bold text-xl bg-gradient-tropical bg-clip-text text-transparent">
              Tropical AI Chef
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`font-medium transition-colors duration-200 hover:text-primary ${
                  isActive(item.path) ? "text-primary" : "text-foreground/70"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            {isLoggedIn && (
              <Button variant="ghost" size="sm" className="relative">
                <Heart className="w-4 h-4 mr-2" />
                Favorites
                {favoriteCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500">
                    {favoriteCount}
                  </Badge>
                )}
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={handleAuthAction}
              className="transition-all hover:scale-105"
            >
              {isLoggedIn ? (
                <>
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </>
              )}
            </Button>

            <Button
              size="sm"
              className="gradient-tropical text-foreground relative transition-all hover:scale-105"
              onClick={handleCartAction}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Cart
              {cartItems > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-accent">
                  {cartItems}
                </Badge>
              )}
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col space-y-4 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`text-lg font-medium transition-colors duration-200 hover:text-primary ${
                      isActive(item.path)
                        ? "text-primary"
                        : "text-foreground/70"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}

                <div className="border-t pt-4 space-y-3">
                  {isLoggedIn && (
                    <Button
                      variant="ghost"
                      className="w-full justify-start relative"
                      onClick={() => {
                        setIsOpen(false);
                        toast.success("Favorites opened! 💖");
                      }}
                    >
                      <Heart className="w-4 h-4 mr-2" />
                      Favorites
                      {favoriteCount > 0 && (
                        <Badge className="ml-auto h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500">
                          {favoriteCount}
                        </Badge>
                      )}
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      setIsOpen(false);
                      handleAuthAction();
                    }}
                  >
                    {isLoggedIn ? (
                      <>
                        <User className="w-4 h-4 mr-2" />
                        Profile & Logout
                      </>
                    ) : (
                      <>
                        <LogIn className="w-4 h-4 mr-2" />
                        Login
                      </>
                    )}
                  </Button>

                  <Button
                    className="w-full gradient-tropical text-foreground relative"
                    onClick={() => {
                      setIsOpen(false);
                      handleCartAction();
                    }}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Cart
                    {cartItems > 0 && (
                      <Badge className="ml-auto h-5 w-5 flex items-center justify-center p-0 text-xs bg-accent">
                        {cartItems}
                      </Badge>
                    )}
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};
