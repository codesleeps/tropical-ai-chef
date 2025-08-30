// This script moves the contents of dist/ to docs/ for GitHub Pages deployment
// Usage: node scripts/deploy-to-docs.js

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, "../dist");
const destDir = path.join(__dirname, "../docs");

function copyRecursiveSync(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  fs.readdirSync(src).forEach((item) => {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    if (fs.lstatSync(srcPath).isDirectory()) {
      copyRecursiveSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

function removeDirSync(dir) {
  if (fs.existsSync(dir)) {
    fs.readdirSync(dir).forEach((file) => {
      const curPath = path.join(dir, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        removeDirSync(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(dir);
  }
}

function updateManifestForGitHubPages() {
  const manifestPath = path.join(destDir, "manifest.json");
  if (fs.existsSync(manifestPath)) {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

    // Update start_url for GitHub Pages
    manifest.start_url = "/tropical-ai-chef/";

    // Update icon paths for GitHub Pages
    if (manifest.icons) {
      manifest.icons = manifest.icons.map((icon) => ({
        ...icon,
        src: icon.src.startsWith("/")
          ? `/tropical-ai-chef${icon.src}`
          : icon.src,
      }));
    }

    // Update screenshot paths for GitHub Pages
    if (manifest.screenshots) {
      manifest.screenshots = manifest.screenshots.map((screenshot) => ({
        ...screenshot,
        src: screenshot.src.startsWith("/")
          ? `/tropical-ai-chef${screenshot.src}`
          : screenshot.src,
      }));
    }

    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log("✅ Updated manifest.json for GitHub Pages");
  }
}

function updateIndexHtmlForGitHubPages() {
  const indexPath = path.join(destDir, "index.html");
  if (fs.existsSync(indexPath)) {
    let html = fs.readFileSync(indexPath, "utf8");

    // Update meta tags URLs
    html = html.replace(
      /https:\/\/tropical-ai-chef\.vercel\.app\//g,
      "https://codesleeps.github.io/tropical-ai-chef/"
    );

    // Update canonical URL
    html = html.replace(
      '<link rel="canonical" href="https://tropical-ai-chef.vercel.app/" />',
      '<link rel="canonical" href="https://codesleeps.github.io/tropical-ai-chef/" />'
    );

    // Update structured data URLs
    html = html.replace(
      /"url": "https:\/\/tropical-ai-chef\.vercel\.app"/g,
      '"url": "https://codesleeps.github.io/tropical-ai-chef"'
    );
    html = html.replace(
      /"logo": "https:\/\/tropical-ai-chef\.vercel\.app\/logo\.png"/g,
      '"logo": "https://codesleeps.github.io/tropical-ai-chef/logo.png"'
    );

    fs.writeFileSync(indexPath, html);
    console.log("✅ Updated index.html for GitHub Pages");
  }
}

// Remove old docs folder
if (fs.existsSync(destDir)) {
  removeDirSync(destDir);
}

// Copy dist to docs
copyRecursiveSync(srcDir, destDir);

// Update manifest.json for GitHub Pages
updateManifestForGitHubPages();

// Update index.html for GitHub Pages
updateIndexHtmlForGitHubPages();

console.log("✅ Deployment files copied to docs/. Push to GitHub to deploy!");
