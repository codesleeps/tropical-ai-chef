import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, ShoppingCart, User, Leaf, ChefHat, ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Recipe Generator', path: '/recipes' },
    { name: 'About', path: '/about' },
    { name: 'Benefits', path: '/benefits' },
    { name: 'Blog', path: '/blog' },
    { name: 'Orders', path: '/orders' },
  ];

  const vegetableItems = [
    { name: 'Kale', path: '/vegetables/kale' },
    { name: 'Cucumber', path: '/vegetables/cucumber' },
    { name: 'Spinach', path: '/vegetables/spinach' },
    { name: 'Beetroot', path: '/vegetables/beetroot' },
    { name: 'Ginger', path: '/vegetables/ginger' },
    { name: 'Sorrel (Hibiscus)', path: '/vegetables/sorrel' },
  ];

  const fruitItems = [
    { name: 'Apples', path: '/fruits/apples' },
    { name: 'Strawberries', path: '/fruits/strawberries' },
    { name: 'Blueberries', path: '/fruits/blueberries' },
    { name: 'Pomegranate', path: '/fruits/pomegranate' },
    { name: 'Raspberries', path: '/fruits/raspberries' },
    { name: 'Blackberries', path: '/fruits/blackberries' },
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
          <div className="flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`font-medium transition-smooth hover:text-primary ${
                  isActive(item.path) 
                    ? 'text-primary' 
                    : 'text-foreground/70'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <User className="w-4 h-4 mr-2" />
              Login
            </Button>
            <Button size="sm" className="gradient-tropical text-foreground">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Cart
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
                    className={`text-lg font-medium transition-smooth hover:text-primary ${
                      isActive(item.path) 
                        ? 'text-primary' 
                        : 'text-foreground/70'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                
                {/* Vegetables Section in Mobile Menu */}
                <div className="border-t pt-4">
                  <h3 className="font-medium text-lg mb-3 text-foreground/70">Vegetables</h3>
                  <div className="space-y-2">
                    {vegetableItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                        className="block text-base font-medium transition-smooth hover:text-primary text-foreground/70"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
                
                {/* Fruits Section in Mobile Menu */}
                <div className="border-t pt-4">
                  <h3 className="font-medium text-lg mb-3 text-foreground/70">Fruits</h3>
                  <div className="space-y-2">
                    {fruitItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                        className="block text-base font-medium transition-smooth hover:text-primary text-foreground/70"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <Button variant="ghost" className="w-full justify-start">
                    <User className="w-4 h-4 mr-2" />
                    Login
                  </Button>
                  <Button className="w-full gradient-tropical text-foreground">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Cart
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