import { useEffect } from "react";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BarChart3, Shield, AlertTriangle, Info } from "lucide-react";
import { env } from "@/config/environment";

const Analytics = () => {
  useEffect(() => {
    document.title = "Analytics Dashboard - Tropical AI Chef";
  }, []);

  // Only show in development environment
  if (env.environment !== "development") {
    return (
      <div className="min-h-screen bg-gradient-tropical flex items-center justify-center p-6">
        <Card className="max-w-md">
          <CardHeader className="text-center">
            <Shield className="w-12 h-12 mx-auto text-red-500 mb-4" />
            <CardTitle>Access Restricted</CardTitle>
            <CardDescription>
              Analytics dashboard is only available in development mode
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                For security reasons, this analytics dashboard is not accessible
                in production environments.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <BarChart3 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Analytics Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                Real-time monitoring and analytics for Tropical AI Chef
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge className="bg-blue-500">Development Mode</Badge>
            <Badge variant="outline">Real-time Data</Badge>
            <Badge variant="outline">Privacy Compliant</Badge>
          </div>
        </div>

        {/* Development Notice */}
        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Development Environment:</strong> This dashboard shows
            real-time analytics data collected during development. In
            production, analytics are privacy-compliant and require user
            consent.
          </AlertDescription>
        </Alert>

        {/* Analytics Dashboard Component */}
        <AnalyticsDashboard />

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            Analytics data is collected anonymously and helps improve the
            Tropical AI Chef experience.
          </p>
          <p className="mt-1">
            All data collection follows GDPR guidelines and respects user
            privacy preferences.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
