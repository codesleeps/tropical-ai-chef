import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Scale, Shield, FileText, Users, Lock, Eye } from "lucide-react";

const Legal: React.FC = () => {
  const legalDocuments = [
    {
      id: "privacy-policy",
      title: "Privacy Policy",
      description:
        "Learn how we collect, use, and protect your personal information in compliance with GDPR and other privacy regulations.",
      icon: Eye,
      link: "/privacy-policy",
      lastUpdated: "2024-08-29",
      highlights: [
        "GDPR compliant data practices",
        "Transparent data collection policies",
        "User rights and data control",
        "Cookie and tracking information",
      ],
    },
    {
      id: "terms-of-service",
      title: "Terms of Service",
      description:
        "Understand the legal terms and conditions that govern your use of the Tropical AI Chef platform.",
      icon: Scale,
      link: "/terms-of-service",
      lastUpdated: "2024-08-29",
      highlights: [
        "Service usage guidelines",
        "User responsibilities",
        "Intellectual property rights",
        "Limitation of liability",
      ],
    },
  ];

  const complianceFeatures = [
    {
      icon: Shield,
      title: "Privacy-First Design",
      description:
        "Built with privacy as a core principle, minimizing data collection and maximizing user control.",
    },
    {
      icon: Lock,
      title: "Secure by Default",
      description:
        "Comprehensive security measures protect your data with industry-standard encryption and security headers.",
    },
    {
      icon: Users,
      title: "Transparent Practices",
      description:
        "Clear, understandable policies written in plain language so you know exactly how your data is handled.",
    },
    {
      icon: FileText,
      title: "Regular Updates",
      description:
        "Our legal documents are regularly reviewed and updated to reflect current practices and regulations.",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Legal Information - Tropical AI Chef</title>
        <meta
          name="description"
          content="Legal information for Tropical AI Chef including privacy policy, terms of service, and compliance information. Learn about our commitment to privacy and legal transparency."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://tropical-ai-chef.github.io/legal" />

        {/* Open Graph */}
        <meta
          property="og:title"
          content="Legal Information - Tropical AI Chef"
        />
        <meta
          property="og:description"
          content="Legal information and compliance documentation for Tropical AI Chef"
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://tropical-ai-chef.github.io/legal"
        />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta
          name="twitter:title"
          content="Legal Information - Tropical AI Chef"
        />
        <meta
          name="twitter:description"
          content="Legal information and compliance documentation"
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Scale className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Legal Information
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Transparency and compliance documentation
                  </p>
                </div>
              </div>
              <Link
                to="/"
                className="text-amber-600 hover:text-amber-700 transition-colors duration-200 font-medium"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          {/* Introduction */}
          <div className="bg-white rounded-xl shadow-lg p-6 lg:p-8 mb-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Our Commitment to Legal Compliance
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                At Tropical AI Chef, we believe in transparency and responsible
                data practices. Our legal documentation is designed to be clear,
                comprehensive, and compliant with international privacy and data
                protection regulations.
              </p>
            </div>
          </div>

          {/* Legal Documents */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Legal Documents
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {legalDocuments.map((doc) => {
                const IconComponent = doc.icon;
                return (
                  <div
                    key={doc.id}
                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="p-6 lg:p-8">
                      <div className="flex items-start space-x-4 mb-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                            <IconComponent className="h-6 w-6 text-amber-600" />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {doc.title}
                          </h3>
                          <p className="text-gray-600 leading-relaxed">
                            {doc.description}
                          </p>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h4 className="font-medium text-gray-900 mb-3">
                          Key Topics Covered:
                        </h4>
                        <ul className="space-y-2">
                          {doc.highlights.map((highlight, index) => (
                            <li
                              key={index}
                              className="flex items-center text-sm text-gray-600"
                            >
                              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-3 flex-shrink-0"></div>
                              {highlight}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                          Last updated:{" "}
                          {new Date(doc.lastUpdated).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </div>
                        <Link
                          to={doc.link}
                          className="inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors duration-200 font-medium"
                        >
                          Read Full Document
                          <FileText className="ml-2 h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Compliance Features */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Our Compliance Approach
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {complianceFeatures.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-lg p-6 text-center"
                  >
                    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="h-6 w-6 text-emerald-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Contact Information */}
          <section>
            <div className="bg-white rounded-xl shadow-lg p-6 lg:p-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Questions About Our Legal Policies?
                </h2>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto leading-relaxed">
                  We're committed to transparency and are happy to answer any
                  questions about our legal policies, data practices, or
                  compliance measures.
                </p>
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 max-w-md mx-auto">
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-center space-x-2">
                      <span className="font-medium text-emerald-800">
                        Legal Questions:
                      </span>
                      <a
                        href="mailto:legal@tropical-ai-chef.com"
                        className="text-emerald-700 hover:text-emerald-800 underline"
                      >
                        legal@tropical-ai-chef.com
                      </a>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <span className="font-medium text-emerald-800">
                        Privacy Concerns:
                      </span>
                      <a
                        href="mailto:privacy@tropical-ai-chef.com"
                        className="text-emerald-700 hover:text-emerald-800 underline"
                      >
                        privacy@tropical-ai-chef.com
                      </a>
                    </div>
                    <div className="text-emerald-700 font-medium">
                      Response time: Within 48 hours
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <Link
                  to="/privacy-policy"
                  className="hover:text-amber-600 transition-colors duration-200"
                >
                  Privacy Policy
                </Link>
                <span>•</span>
                <Link
                  to="/terms-of-service"
                  className="hover:text-amber-600 transition-colors duration-200"
                >
                  Terms of Service
                </Link>
                <span>•</span>
                <Link
                  to="/"
                  className="hover:text-amber-600 transition-colors duration-200"
                >
                  Home
                </Link>
              </div>
              <p className="text-xs text-gray-400">
                © 2024 Tropical AI Chef. All legal documents regularly updated.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Legal;
