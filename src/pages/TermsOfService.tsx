import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  Scale,
  Shield,
  Users,
  Globe,
  AlertTriangle,
  FileText,
} from "lucide-react";

const TermsOfService: React.FC = () => {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const ScrollToSection = ({
    id,
    children,
  }: {
    id: string;
    children: React.ReactNode;
  }) => (
    <a
      href={`#${id}`}
      className="text-amber-600 hover:text-amber-700 transition-colors duration-200 underline"
      onClick={(e) => {
        e.preventDefault();
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }}
    >
      {children}
    </a>
  );

  return (
    <>
      <Helmet>
        <title>Terms of Service - Tropical AI Chef</title>
        <meta
          name="description"
          content="Terms of Service for Tropical AI Chef. Learn about our service terms, user responsibilities, and legal agreements for using our AI-powered recipe generation platform."
        />
        <meta name="robots" content="index, follow" />
        <link
          rel="canonical"
          href="https://tropical-ai-chef.github.io/terms-of-service"
        />

        {/* Open Graph */}
        <meta
          property="og:title"
          content="Terms of Service - Tropical AI Chef"
        />
        <meta
          property="og:description"
          content="Terms of Service for Tropical AI Chef platform"
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://tropical-ai-chef.github.io/terms-of-service"
        />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta
          name="twitter:title"
          content="Terms of Service - Tropical AI Chef"
        />
        <meta
          name="twitter:description"
          content="Terms of Service for Tropical AI Chef platform"
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Scale className="h-8 w-8 text-amber-600" />
                <h1 className="text-2xl font-bold text-gray-900">
                  Terms of Service
                </h1>
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
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          {/* Introduction */}
          <div className="bg-white rounded-xl shadow-lg p-6 lg:p-8 mb-8">
            <div className="flex items-start space-x-4 mb-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-amber-600" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Welcome to Tropical AI Chef
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  These Terms of Service ("Terms") govern your use of the
                  Tropical AI Chef platform and services. By accessing or using
                  our service, you agree to be bound by these Terms.
                </p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-800">
                <strong>Last Updated:</strong> {currentDate}
              </p>
            </div>
          </div>

          {/* Table of Contents */}
          <div className="bg-white rounded-xl shadow-lg p-6 lg:p-8 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Globe className="h-5 w-5 mr-2 text-amber-600" />
              Table of Contents
            </h2>
            <nav className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { id: "definitions", title: "1. Definitions" },
                { id: "acceptance", title: "2. Acceptance of Terms" },
                { id: "service-description", title: "3. Service Description" },
                { id: "user-accounts", title: "4. User Accounts" },
                { id: "acceptable-use", title: "5. Acceptable Use Policy" },
                {
                  id: "intellectual-property",
                  title: "6. Intellectual Property",
                },
                { id: "user-content", title: "7. User Content" },
                { id: "privacy", title: "8. Privacy and Data Protection" },
                { id: "disclaimers", title: "9. Disclaimers" },
                {
                  id: "limitation-liability",
                  title: "10. Limitation of Liability",
                },
                { id: "indemnification", title: "11. Indemnification" },
                { id: "termination", title: "12. Termination" },
                { id: "modifications", title: "13. Modifications to Terms" },
                { id: "governing-law", title: "14. Governing Law" },
                { id: "dispute-resolution", title: "15. Dispute Resolution" },
                { id: "contact", title: "16. Contact Information" },
              ].map((item) => (
                <ScrollToSection key={item.id} id={item.id}>
                  {item.title}
                </ScrollToSection>
              ))}
            </nav>
          </div>

          {/* Terms Sections */}
          <div className="space-y-8">
            {/* 1. Definitions */}
            <section
              id="definitions"
              className="bg-white rounded-xl shadow-lg p-6 lg:p-8"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 font-bold text-sm mr-3">
                  1
                </span>
                Definitions
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <div>
                  <strong className="text-gray-900">"Service"</strong> refers to
                  the Tropical AI Chef platform, including the website, web
                  application, and all related services provided by us.
                </div>
                <div>
                  <strong className="text-gray-900">"User" or "You"</strong>{" "}
                  refers to any individual or entity that accesses or uses our
                  Service.
                </div>
                <div>
                  <strong className="text-gray-900">"Content"</strong> refers to
                  all text, data, information, recipes, images, and other
                  materials available through the Service.
                </div>
                <div>
                  <strong className="text-gray-900">
                    "AI-Generated Content"
                  </strong>{" "}
                  refers to recipes, cooking instructions, and related content
                  generated by our artificial intelligence systems.
                </div>
              </div>
            </section>

            {/* 2. Acceptance of Terms */}
            <section
              id="acceptance"
              className="bg-white rounded-xl shadow-lg p-6 lg:p-8"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 font-bold text-sm mr-3">
                  2
                </span>
                Acceptance of Terms
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  By accessing, browsing, or using the Tropical AI Chef Service,
                  you acknowledge that you have read, understood, and agree to
                  be bound by these Terms and our Privacy Policy.
                </p>
                <p>
                  If you do not agree to these Terms, you must not access or use
                  our Service. You must be at least 13 years old to use our
                  Service.
                </p>
                <p>
                  These Terms constitute a legally binding agreement between you
                  and Tropical AI Chef.
                </p>
              </div>
            </section>

            {/* 3. Service Description */}
            <section
              id="service-description"
              className="bg-white rounded-xl shadow-lg p-6 lg:p-8"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 font-bold text-sm mr-3">
                  3
                </span>
                Service Description
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Tropical AI Chef is an AI-powered platform that generates
                  personalized tropical recipes based on user preferences,
                  dietary restrictions, and available ingredients.
                </p>
                <p>Our Service includes:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>AI-generated recipe recommendations</li>
                  <li>Nutritional information and health benefits</li>
                  <li>Cooking instructions and ingredient lists</li>
                  <li>Dietary preference customization</li>
                  <li>Recipe saving and sharing features</li>
                </ul>
                <p>
                  We reserve the right to modify, suspend, or discontinue any
                  aspect of the Service at any time without prior notice.
                </p>
              </div>
            </section>

            {/* 4. User Accounts */}
            <section
              id="user-accounts"
              className="bg-white rounded-xl shadow-lg p-6 lg:p-8"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 font-bold text-sm mr-3">
                  4
                </span>
                User Accounts
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Currently, Tropical AI Chef operates without requiring user
                  account registration. All features are accessible without
                  creating an account.
                </p>
                <p>
                  Should we implement user accounts in the future, you will be
                  responsible for:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    Maintaining the confidentiality of your account credentials
                  </li>
                  <li>All activities that occur under your account</li>
                  <li>Immediately notifying us of any unauthorized use</li>
                  <li>Providing accurate and current information</li>
                </ul>
              </div>
            </section>

            {/* 5. Acceptable Use Policy */}
            <section
              id="acceptable-use"
              className="bg-white rounded-xl shadow-lg p-6 lg:p-8"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 font-bold text-sm mr-3">
                  5
                </span>
                Acceptable Use Policy
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  You agree to use the Service only for lawful purposes and in
                  accordance with these Terms. You agree NOT to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    Use the Service for any illegal or unauthorized purpose
                  </li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Interfere with or disrupt the Service or servers</li>
                  <li>
                    Use automated systems to access the Service without
                    permission
                  </li>
                  <li>
                    Share content that is harmful, offensive, or violates
                    others' rights
                  </li>
                  <li>Misrepresent your identity or affiliation</li>
                  <li>Violate any applicable laws or regulations</li>
                </ul>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-red-800 text-sm">
                    <strong>Important:</strong> Violation of these terms may
                    result in immediate termination of your access to the
                    Service and potential legal action.
                  </p>
                </div>
              </div>
            </section>

            {/* 6. Intellectual Property */}
            <section
              id="intellectual-property"
              className="bg-white rounded-xl shadow-lg p-6 lg:p-8"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 font-bold text-sm mr-3">
                  6
                </span>
                Intellectual Property Rights
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  The Service and its original content, features, and
                  functionality are owned by Tropical AI Chef and are protected
                  by international copyright, trademark, patent, trade secret,
                  and other intellectual property laws.
                </p>
                <p>
                  AI-generated recipes are provided for your personal,
                  non-commercial use. You may save, print, and share recipes for
                  personal purposes, but you may not:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Republish or redistribute our content commercially</li>
                  <li>Claim ownership of AI-generated recipes</li>
                  <li>Remove copyright or proprietary notices</li>
                  <li>Use our content to train competing AI models</li>
                </ul>
              </div>
            </section>

            {/* 7. User Content */}
            <section
              id="user-content"
              className="bg-white rounded-xl shadow-lg p-6 lg:p-8"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 font-bold text-sm mr-3">
                  7
                </span>
                User Content
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Currently, our Service does not collect or store
                  user-generated content beyond temporary session data for
                  recipe generation.
                </p>
                <p>
                  Should we implement content sharing features in the future:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>You retain ownership of content you create</li>
                  <li>
                    You grant us a license to use, display, and distribute your
                    content within the Service
                  </li>
                  <li>
                    You are responsible for ensuring your content doesn't
                    violate others' rights
                  </li>
                  <li>
                    We reserve the right to remove content that violates these
                    Terms
                  </li>
                </ul>
              </div>
            </section>

            {/* 8. Privacy and Data Protection */}
            <section
              id="privacy"
              className="bg-white rounded-xl shadow-lg p-6 lg:p-8"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 font-bold text-sm mr-3">
                  8
                </span>
                Privacy and Data Protection
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Your privacy is important to us. Our collection, use, and
                  protection of your personal information is governed by our{" "}
                  <Link
                    to="/privacy-policy"
                    className="text-amber-600 hover:text-amber-700 underline"
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>
                <p>
                  By using the Service, you consent to the collection and use of
                  information in accordance with our Privacy Policy.
                </p>
                <p>
                  We implement appropriate technical and organizational measures
                  to protect your personal data against unauthorized access,
                  alteration, disclosure, or destruction.
                </p>
              </div>
            </section>

            {/* 9. Disclaimers */}
            <section
              id="disclaimers"
              className="bg-white rounded-xl shadow-lg p-6 lg:p-8"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 font-bold text-sm mr-3">
                  9
                </span>
                Disclaimers
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 text-sm font-medium">
                    IMPORTANT DISCLAIMER: AI-generated recipes are provided for
                    informational purposes only.
                  </p>
                </div>
                <p>
                  <strong className="text-gray-900">Food Safety:</strong> Always
                  ensure proper food safety practices. Verify cooking
                  temperatures, ingredient freshness, and follow safe food
                  handling procedures.
                </p>
                <p>
                  <strong className="text-gray-900">
                    Allergies & Dietary Restrictions:
                  </strong>{" "}
                  Always check ingredient lists carefully. We cannot guarantee
                  that recipes are safe for specific allergies or dietary
                  restrictions.
                </p>
                <p>
                  <strong className="text-gray-900">
                    Nutritional Information:
                  </strong>{" "}
                  Nutritional data is approximate and should not be relied upon
                  for medical or dietary decisions. Consult healthcare
                  professionals for specific nutritional needs.
                </p>
                <p>
                  <strong className="text-gray-900">
                    Service Availability:
                  </strong>{" "}
                  The Service is provided "as is" without warranties of any
                  kind. We do not guarantee uninterrupted or error-free
                  operation.
                </p>
              </div>
            </section>

            {/* 10. Limitation of Liability */}
            <section
              id="limitation-liability"
              className="bg-white rounded-xl shadow-lg p-6 lg:p-8"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 font-bold text-sm mr-3">
                  10
                </span>
                Limitation of Liability
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  To the maximum extent permitted by law, Tropical AI Chef shall
                  not be liable for any indirect, incidental, special,
                  consequential, or punitive damages, including but not limited
                  to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    Loss of profits, data, use, goodwill, or other intangible
                    losses
                  </li>
                  <li>
                    Damages resulting from use of or inability to use the
                    Service
                  </li>
                  <li>Food-related incidents or allergic reactions</li>
                  <li>Any damages caused by AI-generated content</li>
                </ul>
                <p>
                  Our total liability for any claims arising from these Terms or
                  the Service shall not exceed the amount you paid us, if any,
                  for using the Service.
                </p>
              </div>
            </section>

            {/* 11. Indemnification */}
            <section
              id="indemnification"
              className="bg-white rounded-xl shadow-lg p-6 lg:p-8"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 font-bold text-sm mr-3">
                  11
                </span>
                Indemnification
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  You agree to defend, indemnify, and hold harmless Tropical AI
                  Chef, its officers, directors, employees, and agents from and
                  against any and all claims, damages, obligations, losses,
                  liabilities, costs, or debt, and expenses (including
                  attorney's fees) arising from:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Your use of and access to the Service</li>
                  <li>Your violation of any term of these Terms</li>
                  <li>Your violation of any third-party right</li>
                  <li>Any content you submit or share through the Service</li>
                </ul>
              </div>
            </section>

            {/* 12. Termination */}
            <section
              id="termination"
              className="bg-white rounded-xl shadow-lg p-6 lg:p-8"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 font-bold text-sm mr-3">
                  12
                </span>
                Termination
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  We may terminate or suspend your access to the Service
                  immediately, without prior notice or liability, for any
                  reason, including breach of these Terms.
                </p>
                <p>
                  Upon termination, your right to use the Service will cease
                  immediately. All provisions of these Terms which by their
                  nature should survive termination shall survive.
                </p>
                <p>You may stop using the Service at any time.</p>
              </div>
            </section>

            {/* 13. Modifications to Terms */}
            <section
              id="modifications"
              className="bg-white rounded-xl shadow-lg p-6 lg:p-8"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 font-bold text-sm mr-3">
                  13
                </span>
                Modifications to Terms
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  We reserve the right to modify or replace these Terms at any
                  time at our sole discretion. If a revision is material, we
                  will try to provide at least 30 days notice prior to any new
                  terms taking effect.
                </p>
                <p>
                  What constitutes a material change will be determined at our
                  sole discretion. By continuing to access or use our Service
                  after those revisions become effective, you agree to be bound
                  by the revised terms.
                </p>
              </div>
            </section>

            {/* 14. Governing Law */}
            <section
              id="governing-law"
              className="bg-white rounded-xl shadow-lg p-6 lg:p-8"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 font-bold text-sm mr-3">
                  14
                </span>
                Governing Law
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  These Terms shall be interpreted and governed by the laws of
                  the jurisdiction in which Tropical AI Chef operates, without
                  regard to its conflict of law provisions.
                </p>
                <p>
                  Our failure to enforce any right or provision of these Terms
                  will not be considered a waiver of those rights.
                </p>
              </div>
            </section>

            {/* 15. Dispute Resolution */}
            <section
              id="dispute-resolution"
              className="bg-white rounded-xl shadow-lg p-6 lg:p-8"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 font-bold text-sm mr-3">
                  15
                </span>
                Dispute Resolution
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  In the event of any dispute arising out of or in connection
                  with these Terms, we encourage you to first contact us
                  directly to seek a resolution.
                </p>
                <p>
                  If we cannot resolve the dispute through direct communication,
                  any legal action or proceeding arising under these Terms will
                  be brought exclusively in the courts of competent
                  jurisdiction.
                </p>
              </div>
            </section>

            {/* 16. Contact Information */}
            <section
              id="contact"
              className="bg-white rounded-xl shadow-lg p-6 lg:p-8"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 font-bold text-sm mr-3">
                  16
                </span>
                Contact Information
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  If you have any questions about these Terms of Service, please
                  contact us:
                </p>
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong className="text-emerald-800">Email:</strong>{" "}
                      <a
                        href="mailto:legal@tropical-ai-chef.com"
                        className="text-emerald-700 hover:text-emerald-800 underline"
                      >
                        legal@tropical-ai-chef.com
                      </a>
                    </p>
                    <p>
                      <strong className="text-emerald-800">Project:</strong>{" "}
                      Tropical AI Chef
                    </p>
                    <p>
                      <strong className="text-emerald-800">
                        Response Time:
                      </strong>{" "}
                      We aim to respond within 48 hours
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Footer */}
          <footer className="mt-12 pt-8 border-t border-gray-200 text-center">
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
              <Link
                to="/privacy-policy"
                className="hover:text-amber-600 transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <span>•</span>
              <Link
                to="/"
                className="hover:text-amber-600 transition-colors duration-200"
              >
                Home
              </Link>
              <span>•</span>
              <Link
                to="/about"
                className="hover:text-amber-600 transition-colors duration-200"
              >
                About
              </Link>
            </div>
            <p className="mt-4 text-xs text-gray-400">
              © 2024 Tropical AI Chef. These terms are effective as of{" "}
              {currentDate}.
            </p>
          </footer>
        </main>
      </div>
    </>
  );
};

export default TermsOfService;
