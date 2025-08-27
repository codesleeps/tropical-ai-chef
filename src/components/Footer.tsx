import { Link } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="gradient-tropical border-t">
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
            <p className="text-sm text-white/80 mb-4">
              AI-powered tropical juice recipes for a healthier, more delicious lifestyle.
            </p>
            <div className="flex gap-3">
              <Facebook className="w-5 h-5 text-white/70 hover:text-white cursor-pointer" />
              <Twitter className="w-5 h-5 text-white/70 hover:text-white cursor-pointer" />
              <Instagram className="w-5 h-5 text-white/70 hover:text-white cursor-pointer" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold mb-4 text-white">Quick Links</h3>
            <div className="space-y-2 text-sm">
              <Link to="/recipes" className="block text-white/80 hover:text-white">Recipe Generator</Link>
              <Link to="/about" className="block text-white/80 hover:text-white">About Us</Link>
              <Link to="/benefits" className="block text-white/80 hover:text-white">Health Benefits</Link>
              <Link to="/blog" className="block text-white/80 hover:text-white">Blog</Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold mb-4 text-white">Support</h3>
            <div className="space-y-2 text-sm">
              <Link to="/orders" className="block text-white/80 hover:text-white">Track Orders</Link>
              <a href="#" className="block text-white/80 hover:text-white">Help Center</a>
              <a href="#" className="block text-white/80 hover:text-white">Contact Us</a>
              <a href="#" className="block text-white/80 hover:text-white">FAQ</a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold mb-4 text-white">Contact</h3>
            <div className="space-y-2 text-sm text-white/80">
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
        
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-white/80">
          <p>&copy; 2024 Fresh Tropical Juices. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
            <a href="#" className="hover:text-white">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};