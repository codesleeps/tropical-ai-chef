import { Link } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🥭</span>
              <span className="font-bold text-lg bg-gradient-tropical bg-clip-text text-transparent">
                Fresh Tropical Juices
              </span>
            </div>
            <p className="text-sm text-foreground/70 mb-4">
              AI-powered tropical juice recipes for a healthier, more delicious lifestyle.
            </p>
            <div className="flex gap-3">
              <Facebook className="w-5 h-5 text-foreground/60 hover:text-primary cursor-pointer" />
              <Twitter className="w-5 h-5 text-foreground/60 hover:text-primary cursor-pointer" />
              <Instagram className="w-5 h-5 text-foreground/60 hover:text-primary cursor-pointer" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold mb-4">Quick Links</h3>
            <div className="space-y-2 text-sm">
              <Link to="/recipes" className="block text-foreground/70 hover:text-primary">Recipe Generator</Link>
              <Link to="/about" className="block text-foreground/70 hover:text-primary">About Us</Link>
              <Link to="/benefits" className="block text-foreground/70 hover:text-primary">Health Benefits</Link>
              <Link to="/blog" className="block text-foreground/70 hover:text-primary">Blog</Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold mb-4">Support</h3>
            <div className="space-y-2 text-sm">
              <Link to="/orders" className="block text-foreground/70 hover:text-primary">Track Orders</Link>
              <a href="#" className="block text-foreground/70 hover:text-primary">Help Center</a>
              <a href="#" className="block text-foreground/70 hover:text-primary">Contact Us</a>
              <a href="#" className="block text-foreground/70 hover:text-primary">FAQ</a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold mb-4">Contact</h3>
            <div className="space-y-2 text-sm text-foreground/70">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>hello@freshtropicaljuices.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>1-800-TROPICAL</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Miami, FL</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-foreground/70">
          <p>&copy; 2024 Fresh Tropical Juices. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-primary">Privacy Policy</a>
            <a href="#" className="hover:text-primary">Terms of Service</a>
            <a href="#" className="hover:text-primary">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};