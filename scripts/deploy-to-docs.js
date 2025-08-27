// This script moves the contents of dist/ to docs/ for GitHub Pages deployment
// Usage: node scripts/deploy-to-docs.js

const fs = require("fs");
const path = require("path");

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

// Remove old docs folder
if (fs.existsSync(destDir)) {
  removeDirSync(destDir);
}

// Copy dist to docs
copyRecursiveSync(srcDir, destDir);

console.log("Deployment files copied to docs/. Push to GitHub to deploy!");
