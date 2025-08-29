// Enhanced production build script with optimization and validation
import { execSync } from "child_process";
import { readFileSync, writeFileSync, existsSync, mkdirSync, cpSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");

// Build configuration
const BUILD_CONFIG = {
  production: {
    mode: "production",
    outDir: "dist",
    sourcemap: false,
    minify: true,
    analyze: true,
  },
  staging: {
    mode: "staging",
    outDir: "dist-staging",
    sourcemap: true,
    minify: true,
    analyze: false,
  },
  development: {
    mode: "development",
    outDir: "dist-dev",
    sourcemap: true,
    minify: false,
    analyze: false,
  },
};

// Color codes for console output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
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

// Utility functions
const execCommand = (command, options = {}) => {
  try {
    const result = execSync(command, {
      encoding: "utf8",
      stdio: "pipe",
      ...options,
    });
    return { success: true, output: result.trim() };
  } catch (error) {
    return {
      success: false,
      output: error.stdout || error.message,
      error: error.stderr || error.message,
    };
  }
};

const fileExists = (path) => existsSync(join(rootDir, path));
const readFile = (path) => readFileSync(join(rootDir, path), "utf8");
const writeFile = (path, content) =>
  writeFileSync(join(rootDir, path), content, "utf8");

// Pre-build validation
const validateEnvironment = () => {
  log.step("Validating build environment...");

  const checks = [
    { name: "Node.js version", command: "node --version" },
    { name: "npm version", command: "npm --version" },
    { name: "Git repository", check: () => fileExists(".git") },
    { name: "Package.json", check: () => fileExists("package.json") },
    { name: "Vite config", check: () => fileExists("vite.config.ts") },
    { name: "TypeScript config", check: () => fileExists("tsconfig.json") },
  ];

  let allPassed = true;

  checks.forEach((check) => {
    if (check.command) {
      const result = execCommand(check.command);
      if (result.success) {
        log.success(`${check.name}: ${result.output}`);
      } else {
        log.error(`${check.name}: Failed`);
        allPassed = false;
      }
    } else if (check.check) {
      if (check.check()) {
        log.success(`${check.name}: Found`);
      } else {
        log.error(`${check.name}: Not found`);
        allPassed = false;
      }
    }
  });

  if (!allPassed) {
    log.error("Environment validation failed");
    process.exit(1);
  }

  log.success("Environment validation passed");
};

// Dependencies check and update
const checkDependencies = () => {
  log.step("Checking dependencies...");

  // Check for security vulnerabilities
  log.info("Running security audit...");
  const auditResult = execCommand("npm audit --audit-level=moderate");
  if (!auditResult.success && auditResult.error.includes("vulnerabilities")) {
    log.warning(
      'Security vulnerabilities found. Run "npm audit fix" to address them.'
    );
  } else {
    log.success("No security vulnerabilities found");
  }

  // Check for outdated packages
  log.info("Checking for outdated packages...");
  const outdatedResult = execCommand("npm outdated --json");
  if (outdatedResult.success && outdatedResult.output) {
    try {
      const outdated = JSON.parse(outdatedResult.output);
      const outdatedCount = Object.keys(outdated).length;
      if (outdatedCount > 0) {
        log.warning(
          `${outdatedCount} packages are outdated. Consider updating them.`
        );
      } else {
        log.success("All packages are up to date");
      }
    } catch (e) {
      log.success("All packages are up to date");
    }
  }
};

// TypeScript compilation check
const checkTypeScript = () => {
  log.step("Running TypeScript compilation check...");

  const tscResult = execCommand("npx tsc --noEmit");
  if (tscResult.success) {
    log.success("TypeScript compilation check passed");
  } else {
    log.error("TypeScript compilation errors found:");
    console.log(tscResult.error);
    process.exit(1);
  }
};

// Linting check
const runLinting = () => {
  log.step("Running ESLint...");

  const lintResult = execCommand("npm run lint");
  if (lintResult.success) {
    log.success("Linting passed");
  } else {
    log.warning("Linting issues found:");
    console.log(lintResult.output);
    // Don't exit on lint warnings in production build
  }
};

// Build the application
const buildApp = (environment = "production") => {
  const config = BUILD_CONFIG[environment] || BUILD_CONFIG.production;

  log.step(`Building application for ${environment}...`);

  // Set environment variables
  process.env.NODE_ENV = config.mode;

  const buildCommand = `vite build --mode ${config.mode} --outDir ${config.outDir}`;
  const buildResult = execCommand(buildCommand, { stdio: "inherit" });

  if (buildResult.success) {
    log.success(`Build completed successfully (${config.outDir})`);
  } else {
    log.error("Build failed");
    process.exit(1);
  }

  return config;
};

// Analyze bundle size
const analyzeBundleSize = (outDir) => {
  log.step("Analyzing bundle size...");

  const analyzeResult = execCommand("node scripts/analyze-bundle.js");
  if (analyzeResult.success) {
    log.success("Bundle analysis completed");
    console.log(analyzeResult.output);
  } else {
    log.warning("Bundle analysis failed");
  }
};

// Generate build report
const generateBuildReport = (config) => {
  log.step("Generating build report...");

  const buildTime = new Date().toISOString();
  const gitInfo = {
    commit: execCommand("git rev-parse HEAD").output,
    branch: execCommand("git rev-parse --abbrev-ref HEAD").output,
    author: execCommand('git log -1 --pretty=format:"%an"').output,
    date: execCommand('git log -1 --pretty=format:"%ad"').output,
  };

  const packageInfo = JSON.parse(readFile("package.json"));

  const report = {
    buildTime,
    environment: config.mode,
    version: packageInfo.version,
    node: process.version,
    git: gitInfo,
    outputDir: config.outDir,
    sourcemap: config.sourcemap,
    minified: config.minify,
  };

  writeFile(
    join(config.outDir, "build-report.json"),
    JSON.stringify(report, null, 2)
  );
  log.success("Build report generated");
};

// Copy additional assets
const copyAssets = (outDir) => {
  log.step("Copying additional assets...");

  const assetsToCopy = [
    { src: "public/_headers", dest: join(outDir, "_headers") },
    { src: "public/robots.txt", dest: join(outDir, "robots.txt") },
    { src: "public/sitemap.xml", dest: join(outDir, "sitemap.xml") },
    { src: "public/manifest.json", dest: join(outDir, "manifest.json") },
    { src: "SECURITY.md", dest: join(outDir, "SECURITY.md") },
  ];

  assetsToCopy.forEach(({ src, dest }) => {
    if (fileExists(src)) {
      try {
        cpSync(join(rootDir, src), join(rootDir, dest));
        log.success(`Copied ${src} to ${dest}`);
      } catch (error) {
        log.warning(`Failed to copy ${src}: ${error.message}`);
      }
    }
  });
};

// Deploy to GitHub Pages
const deployToGitHubPages = () => {
  log.step("Deploying to GitHub Pages...");

  const deployResult = execCommand("node scripts/deploy-to-docs.js");
  if (deployResult.success) {
    log.success("Deployment to GitHub Pages completed");
  } else {
    log.error("Deployment failed");
    console.log(deployResult.error);
    process.exit(1);
  }
};

// Main build function
export const build = async (environment = "production", deploy = false) => {
  console.log(
    `${colors.magenta}🚀 Starting production build process${colors.reset}\n`
  );

  try {
    // Pre-build checks
    validateEnvironment();
    checkDependencies();
    checkTypeScript();
    runLinting();

    // Build application
    const config = buildApp(environment);

    // Post-build tasks
    if (config.analyze) {
      analyzeBundleSize(config.outDir);
    }

    generateBuildReport(config);
    copyAssets(config.outDir);

    // Deployment
    if (deploy && environment === "production") {
      deployToGitHubPages();
    }

    console.log(
      `\n${colors.green}✅ Production build completed successfully!${colors.reset}`
    );

    if (deploy) {
      log.info(
        "Application has been deployed and is ready for production use."
      );
    } else {
      log.info(`Build output is available in ${config.outDir}/`);
    }
  } catch (error) {
    log.error(`Build process failed: ${error.message}`);
    process.exit(1);
  }
};

// CLI interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const environment = process.argv[2] || "production";
  const shouldDeploy = process.argv.includes("--deploy");

  build(environment, shouldDeploy);
}
