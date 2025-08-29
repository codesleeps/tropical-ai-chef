import React from "react";
import { Link } from "react-router-dom";
import { ChefHat, Leaf, Mail, Globe, Shield, FileText } from "lucide-react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Platform",
      links: [
        { name: "Recipe Generator", path: "/recipes" },
        { name: "About Us", path: "/about" },
        { name: "Health Benefits", path: "/benefits" },
        { name: "Blog", path: "/blog" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Legal Overview", path: "/legal", icon: FileText },
        { name: "Privacy Policy", path: "/privacy-policy", icon: Shield },
        { name: "Terms of Service", path: "/terms-of-service", icon: Globe },
      ],
    },
    {
      title: "Contact",
      links: [
        {
          name: "General Inquiries",
          path: "mailto:info@tropical-ai-chef.com",
          external: true,
          icon: Mail,
        },
        {
          name: "Legal Questions",
          path: "mailto:legal@tropical-ai-chef.com",
          external: true,
          icon: FileText,
        },
        {
          name: "Privacy Concerns",
          path: "mailto:privacy@tropical-ai-chef.com",
          external: true,
          icon: Shield,
        },
      ],
    },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex items-center gap-2">
                <ChefHat className="w-6 h-6 text-amber-500" />
                <Leaf className="w-5 h-5 text-emerald-500" />
              </div>
              <span className="font-bold text-xl text-white">
                Tropical AI Chef
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              AI-powered tropical recipe generation with a focus on health,
              sustainability, and delicious flavors. Privacy-first and
              GDPR-compliant by design.
            </p>
            <div className="flex items-center space-x-2 text-sm text-emerald-400">
              <Shield className="w-4 h-4" />
              <span>Privacy-First Platform</span>
            </div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-white mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => {
                  const IconComponent = link.icon;
                  const linkContent = (
                    <div className="flex items-center space-x-2 text-sm text-gray-400 hover:text-white transition-colors duration-200">
                      {IconComponent && <IconComponent className="w-4 h-4" />}
                      <span>{link.name}</span>
                    </div>
                  );

                  return (
                    <li key={link.name}>
                      {link.external ? (
                        <a href={link.path} className="block">
                          {linkContent}
                        </a>
                      ) : (
                        <Link to={link.path} className="block">
                          {linkContent}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="text-sm text-gray-400">
            © {currentYear} Tropical AI Chef. All rights reserved.
          </div>

          <div className="flex items-center space-x-6 text-sm text-gray-400">
            <Link
              to="/privacy-policy"
              className="hover:text-white transition-colors duration-200"
            >
              Privacy
            </Link>
            <span>•</span>
            <Link
              to="/terms-of-service"
              className="hover:text-white transition-colors duration-200"
            >
              Terms
            </Link>
            <span>•</span>
            <Link
              to="/legal"
              className="hover:text-white transition-colors duration-200"
            >
              Legal
            </Link>
          </div>
        </div>

        {/* Compliance Notice */}
        <div className="mt-6 pt-6 border-t border-gray-800">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-300">
                <p className="font-medium text-white mb-1">
                  Privacy & Compliance Commitment
                </p>
                <p className="text-gray-400 leading-relaxed">
                  We are committed to protecting your privacy and maintaining
                  compliance with GDPR, CCPA, and other applicable data
                  protection regulations. Our platform is designed with
                  privacy-first principles and transparent data practices.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
export { Footer };
