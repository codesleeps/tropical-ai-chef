// Deployment monitoring and health check script
import { execSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");

// Configuration
const MONITOR_CONFIG = {
  url: process.env.DEPLOY_URL || "https://your-app.github.io",
  timeout: 30000,
  retries: 3,
  checkInterval: 5000, // 5 seconds
  healthEndpoints: [
    "/",
    "/about",
    "/recipes",
    "/benefits",
    "/manifest.json",
    "/robots.txt",
    "/sitemap.xml",
  ],
  performanceThresholds: {
    responseTime: 2000, // 2 seconds
    firstContentfulPaint: 2500,
    largestContentfulPaint: 4000,
    cumulativeLayoutShift: 0.1,
  },
};

// Utilities
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  step: (msg) =>
    console.log(
      `${colors.cyan}▶${colors.reset} ${colors.bright}${msg}${colors.reset}`
    ),
};

// HTTP request with timeout
const fetchWithTimeout = async (url, timeout = MONITOR_CONFIG.timeout) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const startTime = Date.now();
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Tropical-AI-Chef-Monitor/1.0",
      },
    });
    const endTime = Date.now();

    clearTimeout(timeoutId);

    return {
      success: true,
      status: response.status,
      statusText: response.statusText,
      responseTime: endTime - startTime,
      headers: Object.fromEntries(response.headers.entries()),
      url: response.url,
    };
  } catch (error) {
    clearTimeout(timeoutId);
    return {
      success: false,
      error: error.message,
      url,
    };
  }
};

// Check deployment health
const checkDeploymentHealth = async () => {
  log.step("Checking deployment health...");

  const results = [];
  let allHealthy = true;

  for (const endpoint of MONITOR_CONFIG.healthEndpoints) {
    const url = `${MONITOR_CONFIG.url}${endpoint}`;

    log.info(`Checking ${endpoint}...`);

    let success = false;
    let lastError = null;

    // Retry logic
    for (let attempt = 1; attempt <= MONITOR_CONFIG.retries; attempt++) {
      const result = await fetchWithTimeout(url);

      if (result.success && result.status >= 200 && result.status < 400) {
        success = true;
        results.push({
          endpoint,
          url,
          status: result.status,
          responseTime: result.responseTime,
          attempt,
          headers: result.headers,
        });
        log.success(
          `${endpoint} - ${result.status} (${result.responseTime}ms)`
        );
        break;
      } else {
        lastError =
          result.error || `HTTP ${result.status}: ${result.statusText}`;
        if (attempt < MONITOR_CONFIG.retries) {
          log.warning(`${endpoint} - Attempt ${attempt} failed, retrying...`);
          await new Promise((resolve) =>
            setTimeout(resolve, MONITOR_CONFIG.checkInterval)
          );
        }
      }
    }

    if (!success) {
      allHealthy = false;
      log.error(
        `${endpoint} - All ${MONITOR_CONFIG.retries} attempts failed: ${lastError}`
      );
      results.push({
        endpoint,
        url,
        error: lastError,
        failed: true,
      });
    }
  }

  return { healthy: allHealthy, results };
};

// Check security headers
const checkSecurityHeaders = async () => {
  log.step("Checking security headers...");

  const requiredHeaders = [
    "x-frame-options",
    "x-content-type-options",
    "x-xss-protection",
    "referrer-policy",
    "content-security-policy",
  ];

  const result = await fetchWithTimeout(MONITOR_CONFIG.url);

  if (!result.success) {
    log.error("Failed to fetch headers for security check");
    return { passed: false, error: result.error };
  }

  const missingHeaders = [];
  const presentHeaders = [];

  requiredHeaders.forEach((header) => {
    if (result.headers[header]) {
      presentHeaders.push(header);
      log.success(`${header}: ${result.headers[header]}`);
    } else {
      missingHeaders.push(header);
      log.warning(`${header}: Missing`);
    }
  });

  const passed = missingHeaders.length === 0;

  return {
    passed,
    presentHeaders,
    missingHeaders,
    allHeaders: result.headers,
  };
};

// Performance check using simple metrics
const checkPerformance = async () => {
  log.step("Running basic performance checks...");

  const startTime = Date.now();
  const result = await fetchWithTimeout(MONITOR_CONFIG.url);
  const endTime = Date.now();

  if (!result.success) {
    log.error("Performance check failed - site unreachable");
    return { passed: false, error: result.error };
  }

  const responseTime = endTime - startTime;
  const passed =
    responseTime <= MONITOR_CONFIG.performanceThresholds.responseTime;

  if (passed) {
    log.success(
      `Response time: ${responseTime}ms (< ${MONITOR_CONFIG.performanceThresholds.responseTime}ms)`
    );
  } else {
    log.warning(
      `Response time: ${responseTime}ms (> ${MONITOR_CONFIG.performanceThresholds.responseTime}ms)`
    );
  }

  // Check for gzip/compression
  const contentEncoding = result.headers["content-encoding"];
  const compressionEnabled =
    contentEncoding &&
    (contentEncoding.includes("gzip") || contentEncoding.includes("br"));

  if (compressionEnabled) {
    log.success(`Compression enabled: ${contentEncoding}`);
  } else {
    log.warning("Compression not detected");
  }

  return {
    passed,
    responseTime,
    compressionEnabled,
    contentEncoding,
    headers: result.headers,
  };
};

// Check PWA features
const checkPWAFeatures = async () => {
  log.step("Checking PWA features...");

  const checks = [
    { name: "Web App Manifest", endpoint: "/manifest.json" },
    { name: "Service Worker", endpoint: "/sw.js" },
    { name: "Robots.txt", endpoint: "/robots.txt" },
    { name: "Sitemap", endpoint: "/sitemap.xml" },
  ];

  const results = {};

  for (const check of checks) {
    const url = `${MONITOR_CONFIG.url}${check.endpoint}`;
    const result = await fetchWithTimeout(url);

    results[check.name] = {
      available: result.success && result.status === 200,
      status: result.status,
      error: result.error,
    };

    if (results[check.name].available) {
      log.success(`${check.name}: Available`);
    } else {
      log.warning(
        `${check.name}: Not available (${result.status || result.error})`
      );
    }
  }

  return results;
};

// Generate deployment report
const generateDeploymentReport = (
  healthCheck,
  securityCheck,
  performanceCheck,
  pwaCheck
) => {
  const timestamp = new Date().toISOString();
  const report = {
    timestamp,
    url: MONITOR_CONFIG.url,
    overall: {
      healthy:
        healthCheck.healthy && securityCheck.passed && performanceCheck.passed,
      score: calculateOverallScore(
        healthCheck,
        securityCheck,
        performanceCheck,
        pwaCheck
      ),
    },
    health: healthCheck,
    security: securityCheck,
    performance: performanceCheck,
    pwa: pwaCheck,
    recommendations: generateRecommendations(
      healthCheck,
      securityCheck,
      performanceCheck,
      pwaCheck
    ),
  };

  // Save report
  const reportPath = join(rootDir, "deployment-report.json");
  writeFileSync(reportPath, JSON.stringify(report, null, 2));

  return report;
};

// Calculate overall deployment score
const calculateOverallScore = (health, security, performance, pwa) => {
  let score = 0;

  // Health score (40%)
  const healthyEndpoints = health.results.filter((r) => !r.failed).length;
  const healthScore = (healthyEndpoints / health.results.length) * 40;
  score += healthScore;

  // Security score (30%)
  const securityScore = security.passed
    ? 30
    : (security.presentHeaders.length / 5) * 30;
  score += securityScore;

  // Performance score (20%)
  const performanceScore = performance.passed ? 20 : 10;
  score += performanceScore;

  // PWA features score (10%)
  const pwaAvailable = Object.values(pwa).filter(
    (feature) => feature.available
  ).length;
  const pwaScore = (pwaAvailable / Object.keys(pwa).length) * 10;
  score += pwaScore;

  return Math.round(score);
};

// Generate recommendations
const generateRecommendations = (health, security, performance, pwa) => {
  const recommendations = [];

  // Health recommendations
  const failedEndpoints = health.results.filter((r) => r.failed);
  if (failedEndpoints.length > 0) {
    recommendations.push({
      category: "Health",
      priority: "High",
      message: `Fix ${
        failedEndpoints.length
      } failed endpoint(s): ${failedEndpoints
        .map((e) => e.endpoint)
        .join(", ")}`,
    });
  }

  // Security recommendations
  if (!security.passed) {
    recommendations.push({
      category: "Security",
      priority: "High",
      message: `Add missing security headers: ${security.missingHeaders.join(
        ", "
      )}`,
    });
  }

  // Performance recommendations
  if (!performance.passed) {
    recommendations.push({
      category: "Performance",
      priority: "Medium",
      message: `Improve response time (currently ${performance.responseTime}ms, target < ${MONITOR_CONFIG.performanceThresholds.responseTime}ms)`,
    });
  }

  if (!performance.compressionEnabled) {
    recommendations.push({
      category: "Performance",
      priority: "Medium",
      message: "Enable gzip/brotli compression for better performance",
    });
  }

  // PWA recommendations
  const unavailablePWAFeatures = Object.entries(pwa).filter(
    ([name, feature]) => !feature.available
  );
  if (unavailablePWAFeatures.length > 0) {
    recommendations.push({
      category: "PWA",
      priority: "Low",
      message: `Consider adding PWA features: ${unavailablePWAFeatures
        .map(([name]) => name)
        .join(", ")}`,
    });
  }

  return recommendations;
};

// Main monitoring function
export const monitorDeployment = async () => {
  console.log(
    `${colors.cyan}🔍 Starting deployment monitoring${colors.reset}\n`
  );

  try {
    // Run all checks
    const [healthCheck, securityCheck, performanceCheck, pwaCheck] =
      await Promise.all([
        checkDeploymentHealth(),
        checkSecurityHeaders(),
        checkPerformance(),
        checkPWAFeatures(),
      ]);

    // Generate report
    const report = generateDeploymentReport(
      healthCheck,
      securityCheck,
      performanceCheck,
      pwaCheck
    );

    // Display summary
    console.log(`\n${colors.cyan}📊 Deployment Summary${colors.reset}`);
    console.log(`Overall Score: ${report.overall.score}/100`);
    console.log(
      `Status: ${report.overall.healthy ? "✅ Healthy" : "❌ Issues Found"}`
    );

    if (report.recommendations.length > 0) {
      console.log(`\n${colors.yellow}📝 Recommendations:${colors.reset}`);
      report.recommendations.forEach((rec) => {
        console.log(
          `  ${
            rec.priority === "High"
              ? "🔴"
              : rec.priority === "Medium"
              ? "🟡"
              : "🟢"
          } ${rec.category}: ${rec.message}`
        );
      });
    }

    log.success("Deployment monitoring completed");
    log.info("Full report saved to deployment-report.json");

    return report;
  } catch (error) {
    log.error(`Monitoring failed: ${error.message}`);
    process.exit(1);
  }
};

// CLI interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const url = process.argv[2];
  if (url) {
    MONITOR_CONFIG.url = url;
  }

  monitorDeployment();
}
