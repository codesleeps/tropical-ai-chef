import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  Activity,
  AlertTriangle,
  Clock,
  Users,
  Eye,
  Download,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import { useAnalyticsData } from "@/hooks/use-analytics";
import { cn } from "@/lib/utils";
import { env } from "@/config/environment";

interface AnalyticsData {
  events: any[];
  errors: any[];
  metrics: any[];
  consent: any;
}

export const AnalyticsDashboard = () => {
  const { getAnalyticsData, clearAnalyticsData } = useAnalyticsData();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const refreshData = () => {
    const analyticsData = getAnalyticsData();
    setData(analyticsData);
    setLastUpdate(new Date());
  };

  useEffect(() => {
    refreshData();

    // Auto-refresh every 30 seconds in development
    if (env.environment === "development") {
      const interval = setInterval(refreshData, 30000);
      return () => clearInterval(interval);
    }
  }, []);

  const downloadData = () => {
    if (!data) return;

    const exportData = {
      timestamp: new Date().toISOString(),
      ...data,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics-data-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!data) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Loading analytics data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const recentEvents = data.events.slice(-10);
  const recentErrors = data.errors.slice(-5);
  const recentMetrics = data.metrics.slice(-10);

  const eventTypes = data.events.reduce((acc, event) => {
    acc[event.name] = (acc[event.name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const avgPerformanceMetrics = data.metrics.reduce((acc, metric) => {
    if (!acc[metric.name]) {
      acc[metric.name] = { total: 0, count: 0 };
    }
    acc[metric.name].total += metric.value;
    acc[metric.name].count += 1;
    return acc;
  }, {} as Record<string, { total: number; count: number }>);

  const performanceAverages = Object.entries(avgPerformanceMetrics).map(
    ([name, data]) => {
      const typedData = data as { total: number; count: number };
      return {
        name,
        average: Math.round(typedData.total / typedData.count),
      };
    }
  );

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Analytics Dashboard
              </CardTitle>
              <CardDescription>
                Real-time analytics and monitoring data for Tropical AI Chef
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                Last updated: {lastUpdate.toLocaleTimeString()}
              </Badge>
              <Button size="sm" variant="outline" onClick={refreshData}>
                <RefreshCw className="w-3 h-3 mr-1" />
                Refresh
              </Button>
              <Button size="sm" variant="outline" onClick={downloadData}>
                <Download className="w-3 h-3 mr-1" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Events
                </p>
                <p className="text-2xl font-bold">{data.events.length}</p>
              </div>
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Errors
                </p>
                <p className="text-2xl font-bold text-red-500">
                  {data.errors.length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Performance Metrics
                </p>
                <p className="text-2xl font-bold">{data.metrics.length}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Consent Status
                </p>
                <p className="text-2xl font-bold">
                  {data.consent.granted ? (
                    <Badge className="bg-green-500">Granted</Badge>
                  ) : (
                    <Badge variant="secondary">Not Given</Badge>
                  )}
                </p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="events" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="errors">Errors</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Event Types */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Event Types</CardTitle>
                <CardDescription>
                  Distribution of tracked events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(eventTypes).map(([type, count]) => (
                    <div
                      key={type}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm">{type}</span>
                      <Badge variant="outline">{String(count)}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Events */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Events</CardTitle>
                <CardDescription>Last 10 tracked events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {recentEvents.map((event, index) => (
                    <div key={index} className="p-2 bg-muted rounded text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{event.name}</span>
                        <span className="text-muted-foreground">
                          {new Date(event.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      {Object.keys(event.parameters).length > 0 && (
                        <div className="mt-1 text-muted-foreground">
                          {JSON.stringify(event.parameters, null, 2).substring(
                            0,
                            100
                          )}
                          ...
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Performance Averages */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Performance Averages</CardTitle>
                <CardDescription>
                  Average values for key metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {performanceAverages.map((metric) => (
                    <div
                      key={metric.name}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm">
                        {metric.name.replace(/_/g, " ")}
                      </span>
                      <div className="text-right">
                        <span className="font-medium">{metric.average}ms</span>
                        <div className="text-xs text-muted-foreground">
                          {metric.name.includes("paint") &&
                            metric.average < 2500 && (
                              <Badge className="bg-green-500 text-xs">
                                Good
                              </Badge>
                            )}
                          {metric.name.includes("paint") &&
                            metric.average >= 2500 && (
                              <Badge className="bg-yellow-500 text-xs">
                                Needs Improvement
                              </Badge>
                            )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Metrics</CardTitle>
                <CardDescription>
                  Last 10 performance measurements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {recentMetrics.map((metric, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-muted rounded text-sm"
                    >
                      <span>{metric.name.replace(/_/g, " ")}</span>
                      <div className="text-right">
                        <span className="font-medium">{metric.value}ms</span>
                        <div className="text-xs text-muted-foreground">
                          {new Date(metric.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="errors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Error Log
              </CardTitle>
              <CardDescription>Recent errors and exceptions</CardDescription>
            </CardHeader>
            <CardContent>
              {recentErrors.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {recentErrors.map((error, index) => (
                    <div
                      key={index}
                      className="p-3 border border-red-200 rounded-lg bg-red-50 dark:bg-red-950"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-red-800 dark:text-red-200">
                            {error.message}
                          </p>
                          <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                            {new Date(error.timestamp).toLocaleString()}
                          </p>
                          {error.stack && (
                            <details className="mt-2">
                              <summary className="text-xs cursor-pointer text-red-700 dark:text-red-300">
                                Stack Trace
                              </summary>
                              <pre className="text-xs mt-1 bg-red-100 dark:bg-red-900 p-2 rounded overflow-x-auto">
                                {error.stack.substring(0, 500)}...
                              </pre>
                            </details>
                          )}
                        </div>
                        <Badge variant="destructive" className="text-xs">
                          Error
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No errors recorded</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Analytics Status</CardTitle>
                <CardDescription>
                  Current configuration and status
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Environment</span>
                  <Badge>{env.environment}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>App Version</span>
                  <Badge variant="outline">{env.appVersion}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Consent Given</span>
                  <Badge
                    className={
                      data.consent.granted ? "bg-green-500" : "bg-gray-500"
                    }
                  >
                    {data.consent.granted ? "Yes" : "No"}
                  </Badge>
                </div>
                {data.consent.timestamp && (
                  <div className="flex items-center justify-between">
                    <span>Consent Date</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(data.consent.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Data Management</CardTitle>
                <CardDescription>
                  Clear or export analytics data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  onClick={clearAnalyticsData}
                  className="w-full"
                  disabled={env.environment !== "development"}
                >
                  Clear All Data
                </Button>
                <Button
                  variant="outline"
                  onClick={downloadData}
                  className="w-full"
                >
                  Export Data
                </Button>
                <p className="text-xs text-muted-foreground">
                  Data clearing is only available in development mode for
                  safety.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
