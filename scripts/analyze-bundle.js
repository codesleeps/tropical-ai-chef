#!/usr/bin/env node

// Bundle Analysis Script for Tropical AI Chef
// Analyzes build output and provides optimization recommendations

import { readFileSync, readdirSync, statSync } from "fs";
import { join, extname, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DIST_DIR = join(__dirname, "../dist");
const ASSETS_DIR = join(DIST_DIR, "assets");

// Size thresholds (in KB)
const THRESHOLDS = {
  JS_CHUNK: 250,
  CSS_CHUNK: 50,
  IMAGE: 100,
  TOTAL_JS: 1000,
  TOTAL_CSS: 200,
};

class BundleAnalyzer {
  constructor() {
    this.results = {
      js: [],
      css: [],
      images: [],
      other: [],
      totalSizes: {
        js: 0,
        css: 0,
        images: 0,
        other: 0,
        total: 0,
      },
      warnings: [],
      recommendations: [],
    };
  }

  analyze() {
    console.log("🔍 Analyzing bundle...\n");

    if (!this.distExists()) {
      console.error('❌ No dist folder found. Run "npm run build" first.');
      process.exit(1);
    }

    this.analyzeFiles(DIST_DIR);
    this.generateRecommendations();
    this.printReport();
  }

  distExists() {
    try {
      return statSync(DIST_DIR).isDirectory();
    } catch {
      return false;
    }
  }

  analyzeFiles(dir, basePath = "") {
    const files = readdirSync(dir);

    files.forEach((file) => {
      const filePath = join(dir, file);
      const relativePath = join(basePath, file);
      const stats = statSync(filePath);

      if (stats.isDirectory()) {
        this.analyzeFiles(filePath, relativePath);
        return;
      }

      const size = stats.size;
      const sizeKB = Math.round((size / 1024) * 100) / 100;
      const extension = extname(file).toLowerCase();

      const fileInfo = {
        name: file,
        path: relativePath,
        size: sizeKB,
        gzipEstimate: Math.round(sizeKB * 0.3 * 100) / 100, // Rough gzip estimate
      };

      // Categorize files
      if (extension === ".js") {
        this.results.js.push(fileInfo);
        this.results.totalSizes.js += sizeKB;
      } else if (extension === ".css") {
        this.results.css.push(fileInfo);
        this.results.totalSizes.css += sizeKB;
      } else if (
        [".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp"].includes(extension)
      ) {
        this.results.images.push(fileInfo);
        this.results.totalSizes.images += sizeKB;
      } else {
        this.results.other.push(fileInfo);
        this.results.totalSizes.other += sizeKB;
      }

      this.results.totalSizes.total += sizeKB;

      // Check for size warnings
      this.checkFileSize(fileInfo, extension);
    });
  }

  checkFileSize(fileInfo, extension) {
    if (extension === ".js" && fileInfo.size > THRESHOLDS.JS_CHUNK) {
      this.results.warnings.push(
        `⚠️  Large JS chunk: ${fileInfo.name} (${fileInfo.size}KB)`
      );
    }
    if (extension === ".css" && fileInfo.size > THRESHOLDS.CSS_CHUNK) {
      this.results.warnings.push(
        `⚠️  Large CSS chunk: ${fileInfo.name} (${fileInfo.size}KB)`
      );
    }
    if (
      [".png", ".jpg", ".jpeg", ".gif"].includes(extension) &&
      fileInfo.size > THRESHOLDS.IMAGE
    ) {
      this.results.warnings.push(
        `⚠️  Large image: ${fileInfo.name} (${fileInfo.size}KB)`
      );
    }
  }

  generateRecommendations() {
    const { totalSizes } = this.results;

    // JS bundle recommendations
    if (totalSizes.js > THRESHOLDS.TOTAL_JS) {
      this.results.recommendations.push(
        "📦 Consider code splitting - JS bundle is large",
        "🔄 Enable tree shaking to remove unused code",
        "⚡ Use dynamic imports for non-critical components"
      );
    }

    // CSS recommendations
    if (totalSizes.css > THRESHOLDS.TOTAL_CSS) {
      this.results.recommendations.push(
        "🎨 Consider CSS code splitting",
        "🗜️ Enable CSS minification and purging"
      );
    }

    // Image recommendations
    if (totalSizes.images > 500) {
      this.results.recommendations.push(
        "🖼️ Optimize images with WebP format",
        "📱 Use responsive images with different sizes",
        "💾 Consider lazy loading for below-the-fold images"
      );
    }

    // General recommendations
    if (totalSizes.total > 2000) {
      this.results.recommendations.push(
        "🚀 Enable gzip/brotli compression on server",
        "📄 Implement service worker for caching",
        "⚡ Use preload hints for critical resources"
      );
    }

    // Analyze chunk composition
    this.analyzeChunkComposition();
  }

  analyzeChunkComposition() {
    const jsFiles = this.results.js.sort((a, b) => b.size - a.size);

    if (jsFiles.length > 0) {
      const largestChunk = jsFiles[0];
      if (largestChunk.size > THRESHOLDS.JS_CHUNK) {
        this.results.recommendations.push(
          `🎯 Split large chunk: ${largestChunk.name} (${largestChunk.size}KB)`
        );
      }
    }

    // Check for vendor vs app code ratio
    const vendorChunks = jsFiles.filter((f) => f.name.includes("vendor"));
    const appChunks = jsFiles.filter(
      (f) => !f.name.includes("vendor") && !f.name.includes("index")
    );

    const vendorSize = vendorChunks.reduce((sum, f) => sum + f.size, 0);
    const appSize = appChunks.reduce((sum, f) => sum + f.size, 0);

    if (vendorSize > appSize * 2) {
      this.results.recommendations.push(
        "📚 Vendor bundle is large - consider splitting into smaller chunks"
      );
    }
  }

  printReport() {
    console.log("📊 Bundle Analysis Report");
    console.log("═".repeat(50));

    // Summary
    console.log("\n📋 Summary:");
    console.log(`Total size: ${this.results.totalSizes.total.toFixed(2)}KB`);
    console.log(`JavaScript: ${this.results.totalSizes.js.toFixed(2)}KB`);
    console.log(`CSS: ${this.results.totalSizes.css.toFixed(2)}KB`);
    console.log(`Images: ${this.results.totalSizes.images.toFixed(2)}KB`);
    console.log(`Other: ${this.results.totalSizes.other.toFixed(2)}KB`);

    // Estimated gzip sizes
    const totalGzip = this.results.totalSizes.total * 0.3;
    console.log(`\n📦 Estimated gzipped: ${totalGzip.toFixed(2)}KB`);

    // Largest files by category
    this.printLargestFiles("JavaScript", this.results.js);
    this.printLargestFiles("CSS", this.results.css);
    this.printLargestFiles("Images", this.results.images);

    // Warnings
    if (this.results.warnings.length > 0) {
      console.log("\n⚠️  Warnings:");
      this.results.warnings.forEach((warning) => console.log(warning));
    }

    // Recommendations
    if (this.results.recommendations.length > 0) {
      console.log("\n💡 Recommendations:");
      this.results.recommendations.forEach((rec) => console.log(rec));
    }

    // Performance score
    this.printPerformanceScore();
  }

  printLargestFiles(category, files) {
    if (files.length === 0) return;

    const sorted = files.sort((a, b) => b.size - a.size).slice(0, 5);
    console.log(`\n🏆 Largest ${category} files:`);
    sorted.forEach((file, index) => {
      console.log(
        `${index + 1}. ${file.name}: ${file.size}KB (gzipped: ~${
          file.gzipEstimate
        }KB)`
      );
    });
  }

  printPerformanceScore() {
    let score = 100;

    // Deduct points for various issues
    if (this.results.totalSizes.js > THRESHOLDS.TOTAL_JS) score -= 20;
    if (this.results.totalSizes.css > THRESHOLDS.TOTAL_CSS) score -= 10;
    if (this.results.totalSizes.images > 500) score -= 15;
    if (this.results.warnings.length > 0)
      score -= this.results.warnings.length * 5;

    score = Math.max(0, score);

    const getScoreColor = (score) => {
      if (score >= 90) return "🟢";
      if (score >= 70) return "🟡";
      return "🔴";
    };

    console.log(`\n${getScoreColor(score)} Performance Score: ${score}/100`);

    if (score < 70) {
      console.log(
        "Consider implementing the recommendations above to improve performance."
      );
    } else if (score < 90) {
      console.log("Good performance, but there's room for optimization.");
    } else {
      console.log("Excellent performance! 🎉");
    }
  }
}

// Check if running as main module
if (import.meta.url === `file://${process.argv[1]}`) {
  const analyzer = new BundleAnalyzer();
  analyzer.analyze();
}

export default BundleAnalyzer;
