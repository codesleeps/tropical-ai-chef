import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Shield,
  Cookie,
  BarChart3,
  AlertTriangle,
  Settings,
  X,
} from "lucide-react";
import { useAnalyticsConsent } from "@/hooks/use-analytics";
import { cn } from "@/lib/utils";

interface ConsentPreferences {
  analytics: boolean;
  performance: boolean;
  functional: boolean;
}

export const ConsentBanner = () => {
  const { hasConsent, giveConsent, revokeConsent } = useAnalyticsConsent();
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<ConsentPreferences>({
    analytics: false,
    performance: true, // Essential for app functionality
    functional: true, // Essential for app functionality
  });

  useEffect(() => {
    // Show banner if no consent decision has been made
    const timer = setTimeout(() => {
      if (!hasConsent && !sessionStorage.getItem("consent_banner_dismissed")) {
        setShowBanner(true);
      }
    }, 2000); // Show after 2 seconds

    return () => clearTimeout(timer);
  }, [hasConsent]);

  const handleAcceptAll = () => {
    setPreferences({
      analytics: true,
      performance: true,
      functional: true,
    });
    giveConsent();
    setShowBanner(false);
  };

  const handleRejectAll = () => {
    setPreferences({
      analytics: false,
      performance: true, // Keep essential cookies
      functional: true, // Keep essential cookies
    });
    revokeConsent();
    setShowBanner(false);
    sessionStorage.setItem("consent_banner_dismissed", "true");
  };

  const handleSavePreferences = () => {
    if (preferences.analytics) {
      giveConsent();
    } else {
      revokeConsent();
    }
    setShowBanner(false);
    setShowSettings(false);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    sessionStorage.setItem("consent_banner_dismissed", "true");
  };

  if (!showBanner) {
    return null;
  }

  return (
    <>
      {/* Consent Banner */}
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 p-4 transform transition-transform duration-300",
          showBanner ? "translate-y-0" : "translate-y-full"
        )}
      >
        <Card className="mx-auto max-w-4xl shadow-2xl border-2 border-primary/20 bg-background/95 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Cookie className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Privacy & Analytics</CardTitle>
                  <CardDescription className="text-sm">
                    We value your privacy and want to be transparent about our
                    data practices.
                  </CardDescription>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                className="p-1 h-auto"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground leading-relaxed">
              <p>
                This website uses cookies and analytics to improve your
                experience and help us understand how the application is used.
                We only collect anonymous usage data and never store personal
                information.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Privacy Compliant
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <BarChart3 className="w-3 h-3" />
                Anonymous Analytics
              </Badge>
              <Badge variant="outline">GDPR Compliant</Badge>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                onClick={handleAcceptAll}
                className="gradient-tropical text-foreground font-semibold flex-1 sm:flex-none"
              >
                Accept All
              </Button>

              <Button
                variant="outline"
                onClick={handleRejectAll}
                className="flex-1 sm:flex-none"
              >
                Reject Analytics
              </Button>

              <Dialog open={showSettings} onOpenChange={setShowSettings}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 flex-1 sm:flex-none"
                  >
                    <Settings className="w-4 h-4" />
                    Customize
                  </Button>
                </DialogTrigger>

                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      Privacy Preferences
                    </DialogTitle>
                    <DialogDescription>
                      Choose which types of cookies and tracking you're
                      comfortable with.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-6">
                    {/* Essential Cookies */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label className="font-medium">
                            Essential Cookies
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            Required for the website to function properly
                          </p>
                        </div>
                        <Switch
                          checked={true}
                          disabled
                          className="data-[state=checked]:bg-green-500"
                        />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        Always Active
                      </Badge>
                    </div>

                    {/* Performance Cookies */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label className="font-medium">
                            Performance Cookies
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            Help us understand how visitors interact with our
                            website
                          </p>
                        </div>
                        <Switch
                          checked={preferences.performance}
                          onCheckedChange={(checked) =>
                            setPreferences((prev) => ({
                              ...prev,
                              performance: checked,
                            }))
                          }
                        />
                      </div>
                    </div>

                    {/* Analytics Cookies */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label className="font-medium">
                            Analytics Cookies
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            Anonymous usage statistics to improve our service
                          </p>
                        </div>
                        <Switch
                          checked={preferences.analytics}
                          onCheckedChange={(checked) =>
                            setPreferences((prev) => ({
                              ...prev,
                              analytics: checked,
                            }))
                          }
                        />
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                        <div className="text-xs text-blue-800 dark:text-blue-200">
                          <p className="font-medium mb-1">
                            Your Privacy Matters
                          </p>
                          <p>
                            All analytics data is anonymous and helps us improve
                            the recipe generation experience. You can change
                            these preferences at any time.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        onClick={handleSavePreferences}
                        className="flex-1"
                      >
                        Save Preferences
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowSettings(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Backdrop */}
      {showBanner && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={handleDismiss}
        />
      )}
    </>
  );
};

export default ConsentBanner;
