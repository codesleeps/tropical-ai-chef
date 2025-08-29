import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Shield, Eye, Cookie, Lock, Mail, Calendar } from "lucide-react";
import { env } from "@/config/environment";

const PrivacyPolicy = () => {
  useEffect(() => {
    document.title = "Privacy Policy - Tropical AI Chef";
  }, []);

  const lastUpdated = "December 2024";
  const effectiveDate = "December 2024";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Privacy Policy
            </h1>
          </div>

          <p className="text-lg text-muted-foreground mb-6">
            Your privacy is our priority. We are committed to protecting your
            personal information and being transparent about our data practices.
          </p>

          <div className="flex flex-wrap gap-2 justify-center">
            <Badge className="bg-green-500 flex items-center gap-1">
              <Shield className="w-3 h-3" />
              GDPR Compliant
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Updated {lastUpdated}
            </Badge>
            <Badge variant="outline">Privacy-First Design</Badge>
          </div>
        </div>

        {/* Legal Document */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Privacy Policy for Tropical AI Chef
            </CardTitle>
            <CardDescription>
              Effective Date: {effectiveDate} | Last Updated: {lastUpdated}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8 prose dark:prose-invert max-w-none">
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">
                Welcome to Tropical AI Chef ("we," "our," or "us"). This Privacy
                Policy explains how we collect, use, disclose, and safeguard
                your information when you visit our website and use our
                AI-powered recipe generation service. Please read this policy
                carefully to understand our practices regarding your personal
                data.
              </p>
            </section>

            <Separator />

            {/* Information We Collect */}
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Cookie className="w-6 h-6" />
                2. Information We Collect
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    2.1 Anonymous Usage Data
                  </h3>
                  <p className="text-muted-foreground">
                    We collect anonymous, aggregated data about how you use our
                    service, including:
                  </p>
                  <ul className="list-disc pl-6 mt-2 text-muted-foreground space-y-1">
                    <li>
                      Recipe generation patterns (fruit choices, styles, AI
                      service preferences)
                    </li>
                    <li>Page views and navigation patterns</li>
                    <li>
                      Performance metrics (page load times, interaction
                      responses)
                    </li>
                    <li>Error reports for improving service reliability</li>
                    <li>Device and browser information for compatibility</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    2.2 Technical Information
                  </h3>
                  <p className="text-muted-foreground">
                    Our service automatically collects certain technical
                    information:
                  </p>
                  <ul className="list-disc pl-6 mt-2 text-muted-foreground space-y-1">
                    <li>IP address (anonymized for privacy)</li>
                    <li>Browser type and version</li>
                    <li>Operating system</li>
                    <li>Session duration and timestamps</li>
                    <li>Referral source (how you found our site)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    2.3 Cookies and Local Storage
                  </h3>
                  <p className="text-muted-foreground">
                    We use cookies and browser storage to enhance your
                    experience:
                  </p>
                  <ul className="list-disc pl-6 mt-2 text-muted-foreground space-y-1">
                    <li>
                      <strong>Essential Cookies:</strong> Required for basic
                      functionality
                    </li>
                    <li>
                      <strong>Analytics Cookies:</strong> Help us understand
                      usage patterns (optional)
                    </li>
                    <li>
                      <strong>Preference Storage:</strong> Remember your recipe
                      and AI service preferences
                    </li>
                    <li>
                      <strong>Session Storage:</strong> Maintain your session
                      and prevent data loss
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <Separator />

            {/* How We Use Information */}
            <section>
              <h2 className="text-2xl font-bold mb-4">
                3. How We Use Your Information
              </h2>
              <p className="text-muted-foreground mb-4">
                We use the collected information for the following purposes:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>
                  <strong>Service Provision:</strong> Generate personalized
                  recipe recommendations
                </li>
                <li>
                  <strong>Performance Optimization:</strong> Improve page load
                  times and user experience
                </li>
                <li>
                  <strong>Analytics:</strong> Understand usage patterns to
                  enhance our service
                </li>
                <li>
                  <strong>Error Monitoring:</strong> Identify and fix technical
                  issues
                </li>
                <li>
                  <strong>Security:</strong> Protect against abuse and ensure
                  service integrity
                </li>
                <li>
                  <strong>Feature Development:</strong> Develop new features
                  based on user needs
                </li>
              </ul>
            </section>

            <Separator />

            {/* Data Sharing */}
            <section>
              <h2 className="text-2xl font-bold mb-4">
                4. Data Sharing and Disclosure
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    4.1 Third-Party Services
                  </h3>
                  <p className="text-muted-foreground">
                    We may share anonymized data with the following third-party
                    services:
                  </p>
                  <ul className="list-disc pl-6 mt-2 text-muted-foreground space-y-1">
                    <li>
                      <strong>Google Analytics:</strong> Anonymous usage
                      statistics (only with your consent)
                    </li>
                    <li>
                      <strong>AI Service Providers:</strong> Recipe generation
                      requests (no personal data)
                    </li>
                    <li>
                      <strong>CDN Providers:</strong> Content delivery and
                      performance optimization
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    4.2 Legal Requirements
                  </h3>
                  <p className="text-muted-foreground">
                    We may disclose information if required by law, such as:
                  </p>
                  <ul className="list-disc pl-6 mt-2 text-muted-foreground space-y-1">
                    <li>
                      Compliance with legal process or government requests
                    </li>
                    <li>Protection of our rights, property, or safety</li>
                    <li>Investigation of potential violations of our terms</li>
                  </ul>
                </div>
              </div>
            </section>

            <Separator />

            {/* Data Security */}
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Lock className="w-6 h-6" />
                5. Data Security
              </h2>
              <p className="text-muted-foreground mb-4">
                We implement industry-standard security measures to protect your
                information:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>
                  <strong>Encryption:</strong> All data transmission uses
                  HTTPS/TLS encryption
                </li>
                <li>
                  <strong>Data Minimization:</strong> We collect only necessary
                  information
                </li>
                <li>
                  <strong>Access Controls:</strong> Strict access controls for
                  any stored data
                </li>
                <li>
                  <strong>Security Headers:</strong> Content Security Policy and
                  other protective measures
                </li>
                <li>
                  <strong>Regular Updates:</strong> Security patches and updates
                  applied promptly
                </li>
                <li>
                  <strong>Anonymization:</strong> Personal identifiers are
                  removed from analytics data
                </li>
              </ul>
            </section>

            <Separator />

            {/* Your Rights */}
            <section>
              <h2 className="text-2xl font-bold mb-4">
                6. Your Privacy Rights
              </h2>
              <p className="text-muted-foreground mb-4">
                Under GDPR and other privacy laws, you have the following
                rights:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>
                  <strong>Consent Withdrawal:</strong> Withdraw consent for
                  analytics at any time
                </li>
                <li>
                  <strong>Data Access:</strong> Request information about data
                  we hold
                </li>
                <li>
                  <strong>Data Portability:</strong> Export your data in a
                  standard format
                </li>
                <li>
                  <strong>Data Deletion:</strong> Request deletion of your
                  information
                </li>
                <li>
                  <strong>Data Correction:</strong> Request correction of
                  inaccurate data
                </li>
                <li>
                  <strong>Processing Objection:</strong> Object to certain data
                  processing activities
                </li>
              </ul>

              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <p className="text-blue-800 dark:text-blue-200 text-sm">
                  <strong>Note:</strong> Since our service primarily uses
                  anonymous data, many of these rights are automatically
                  fulfilled through our privacy-by-design approach.
                </p>
              </div>
            </section>

            <Separator />

            {/* Cookie Management */}
            <section>
              <h2 className="text-2xl font-bold mb-4">
                7. Managing Your Preferences
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    7.1 Cookie Preferences
                  </h3>
                  <p className="text-muted-foreground">
                    You can manage your cookie preferences through:
                  </p>
                  <ul className="list-disc pl-6 mt-2 text-muted-foreground space-y-1">
                    <li>Our consent banner (appears on first visit)</li>
                    <li>Browser settings to block or delete cookies</li>
                    <li>Browser "Do Not Track" settings (we respect these)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    7.2 Analytics Opt-Out
                  </h3>
                  <p className="text-muted-foreground">
                    You can opt out of analytics tracking by:
                  </p>
                  <ul className="list-disc pl-6 mt-2 text-muted-foreground space-y-1">
                    <li>Declining analytics cookies in our consent banner</li>
                    <li>Enabling "Do Not Track" in your browser</li>
                    <li>Using ad blockers that block analytics scripts</li>
                  </ul>
                </div>
              </div>
            </section>

            <Separator />

            {/* Children's Privacy */}
            <section>
              <h2 className="text-2xl font-bold mb-4">8. Children's Privacy</h2>
              <p className="text-muted-foreground">
                Our service is not directed to children under 13 years of age.
                We do not knowingly collect personal information from children
                under 13. If you are a parent or guardian and believe your child
                has provided us with personal information, please contact us
                immediately so we can take appropriate action.
              </p>
            </section>

            <Separator />

            {/* International Users */}
            <section>
              <h2 className="text-2xl font-bold mb-4">
                9. International Users
              </h2>
              <p className="text-muted-foreground">
                Our service is hosted on global content delivery networks. By
                using our service, you consent to the transfer of your
                information to countries that may have different data protection
                laws than your country of residence. We ensure appropriate
                safeguards are in place for international data transfers.
              </p>
            </section>

            <Separator />

            {/* Changes to Policy */}
            <section>
              <h2 className="text-2xl font-bold mb-4">
                10. Changes to This Policy
              </h2>
              <p className="text-muted-foreground">
                We may update this Privacy Policy from time to time. When we
                make changes, we will:
              </p>
              <ul className="list-disc pl-6 mt-2 text-muted-foreground space-y-1">
                <li>
                  Update the "Last Updated" date at the top of this policy
                </li>
                <li>Notify users of significant changes through our website</li>
                <li>Provide a prominent notice for material changes</li>
                <li>Obtain new consent where required by law</li>
              </ul>
            </section>

            <Separator />

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Mail className="w-6 h-6" />
                11. Contact Us
              </h2>
              <p className="text-muted-foreground mb-4">
                If you have any questions about this Privacy Policy or our data
                practices, please contact us:
              </p>

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <p className="font-medium mb-2">Tropical AI Chef Team</p>
                <p className="text-muted-foreground text-sm space-y-1">
                  <span className="block">
                    GitHub:{" "}
                    <a
                      href="https://github.com/yourusername/tropical-ai-chef"
                      className="text-blue-600 hover:underline"
                    >
                      tropical-ai-chef repository
                    </a>
                  </span>
                  <span className="block">Website: {env.baseUrl}</span>
                  <span className="block">
                    Response Time: We aim to respond within 48 hours
                  </span>
                </p>
              </div>
            </section>

            {/* Footer */}
            <div className="mt-12 pt-6 border-t text-center text-sm text-muted-foreground">
              <p>
                This Privacy Policy was last updated on {lastUpdated} and is
                effective as of {effectiveDate}.
              </p>
              <p className="mt-2">
                © {new Date().getFullYear()} Tropical AI Chef. All rights
                reserved.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
