# Tropical AI Chef - Production Deployment Guide

## Overview

This guide covers the complete deployment process for the Tropical AI Chef application, from local development to production deployment with monitoring and maintenance.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Local Development](#local-development)
4. [Testing](#testing)
5. [Production Build](#production-build)
6. [Deployment Options](#deployment-options)
7. [Monitoring & Maintenance](#monitoring--maintenance)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

### System Requirements

- **Node.js**: v18.x or v20.x (LTS recommended)
- **npm**: v9.x or higher
- **Git**: Latest version
- **Modern browser** with ES2020 support

### Development Tools

- **VS Code** (recommended) with extensions:
  - TypeScript and JavaScript Language Features
  - Tailwind CSS IntelliSense
  - ES7+ React/Redux/React-Native snippets
  - Prettier - Code formatter

## Environment Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/tropical-ai-chef.git
cd tropical-ai-chef
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Update `.env.local` with your configuration:

```env
# API Keys (Optional - Local AI works without these)
VITE_OPENAI_API_KEY=your_openai_api_key_here
VITE_HUGGINGFACE_API_KEY=your_huggingface_api_key_here

# App Configuration
VITE_APP_NAME=Tropical AI Chef
VITE_APP_VERSION=1.0.0
VITE_APP_ENVIRONMENT=development

# Analytics (Optional)
VITE_GA_TRACKING_ID=your_google_analytics_id_here

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_ERROR_TRACKING=false

# API Configuration
VITE_API_TIMEOUT=30000
VITE_MAX_RECIPES_PER_SESSION=50

# Deployment URLs
VITE_BASE_URL=http://localhost:5173
VITE_PRODUCTION_URL=https://yourdomain.github.io/tropical-ai-chef
```

## Local Development

### Start Development Server

```bash
npm run dev
```

This starts the Vite development server at `http://localhost:5173` with:

- Hot module replacement (HMR)
- TypeScript compilation
- Tailwind CSS processing
- ESLint integration

### Development Features

- **Live reload**: Changes automatically refresh the browser
- **Error overlay**: TypeScript and runtime errors display in the browser
- **TypeScript**: Full type checking and IntelliSense
- **Analytics**: Analytics dashboard available at `/analytics` (dev mode only)

## Testing

### Run All Tests

```bash
# Run all tests once
npm run test:all

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage
```

### Test Categories

```bash
# Unit tests only
npm run test:unit

# Integration tests
npm run test:integration

# Accessibility tests
npm run test:accessibility
```

### Test Coverage

Tests maintain the following minimum coverage:

- **Lines**: 70%
- **Functions**: 70%
- **Branches**: 70%
- **Statements**: 70%

## Production Build

### Build Commands

```bash
# Standard production build
npm run build:production

# Build with deployment
npm run build:production:deploy

# GitHub Pages build
npm run build:gh
```

### Build Process

The production build includes:

1. **TypeScript compilation** with strict type checking
2. **Environment validation** ensuring all required variables are set
3. **Dependency security check** scanning for vulnerabilities
4. **Bundle optimization** with code splitting and tree shaking
5. **Asset optimization** including image compression
6. **Performance analysis** with bundle size reports
7. **Security headers** configuration for all platforms

### Build Validation

After building, the system automatically:

- Validates bundle size limits
- Checks for unused dependencies
- Generates security headers for different platforms
- Creates deployment-ready artifacts

## Deployment Options

### 1. GitHub Pages (Recommended)

#### Automatic Deployment

The repository includes GitHub Actions workflow for automatic deployment:

1. **Push to main branch** triggers automatic deployment
2. **CI/CD pipeline** runs tests, builds, and deploys
3. **Lighthouse audits** ensure performance standards
4. **Security scanning** with Trivy

#### Manual Deployment

```bash
# Deploy to GitHub Pages
npm run deploy

# Deploy production build
npm run deploy:production
```

#### Configuration

Update `.github/workflows/production-deploy.yml`:

```yaml
env:
  VITE_PRODUCTION_URL: https://your-username.github.io/tropical-ai-chef
  VITE_GA_TRACKING_ID: ${{ secrets.GA_TRACKING_ID }}
```

### 2. Vercel Deployment

#### Install Vercel CLI

```bash
npm install -g vercel
```

#### Deploy

```bash
# Link project
vercel link

# Deploy preview
vercel

# Deploy to production
vercel --prod
```

#### Configuration

Create `vercel.json`:

```json
{
  "buildCommand": "npm run build:production",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "vite",
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### 3. Netlify Deployment

#### Install Netlify CLI

```bash
npm install -g netlify-cli
```

#### Deploy

```bash
# Link site
netlify link

# Deploy preview
netlify deploy

# Deploy to production
netlify deploy --prod
```

#### Configuration

Create `netlify.toml`:

```toml
[build]
  command = "npm run build:production"
  publish = "dist"

[[headers]]
  for = "/*"
  [headers.values]
    X-Content-Type-Options = "nosniff"
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

### 4. Docker Deployment

#### Build Docker Image

```bash
# Build the image
docker build -t tropical-ai-chef .

# Run container
docker run -p 8080:80 tropical-ai-chef
```

#### Docker Compose

```yaml
version: "3.8"
services:
  tropical-ai-chef:
    build: .
    ports:
      - "8080:80"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

## Monitoring & Maintenance

### Deployment Monitoring

#### Automatic Monitoring

```bash
# Monitor deployment
npm run monitor

# Monitor specific URL
node scripts/deployment-monitor.js https://your-domain.com
```

#### Monitoring Features

- **Health checks** for all critical endpoints
- **Performance monitoring** with response time tracking
- **Security header validation**
- **PWA feature verification**
- **Lighthouse audits** with performance thresholds

### Performance Monitoring

#### Lighthouse CI

```bash
# Run Lighthouse audits
npm run lighthouse
```

#### Performance Thresholds

- **Performance**: 85% minimum
- **Accessibility**: 90% minimum
- **Best Practices**: 90% minimum
- **SEO**: 90% minimum
- **PWA**: 80% minimum

### Analytics Dashboard

Access analytics at `/analytics` (development mode only):

- Real-time event tracking
- Performance metrics
- Error reporting
- User interaction analytics

### Error Tracking

The application includes comprehensive error tracking:

- **JavaScript errors** with stack traces
- **Network failures** with request details
- **Performance issues** with Core Web Vitals
- **Security violations** with context

### Maintenance Tasks

#### Weekly Tasks

1. **Dependency updates**: Check for security patches
2. **Performance review**: Analyze Lighthouse reports
3. **Analytics review**: Check user engagement metrics
4. **Error monitoring**: Review error logs and fix issues

#### Monthly Tasks

1. **Security audit**: Run `npm audit` and fix vulnerabilities
2. **Bundle analysis**: Review bundle size and optimize
3. **Accessibility audit**: Run full accessibility tests
4. **Documentation update**: Keep deployment guides current

#### Quarterly Tasks

1. **Dependency major updates**: Plan and execute major version upgrades
2. **Performance optimization**: Deep dive into performance metrics
3. **Security review**: Comprehensive security assessment
4. **User feedback integration**: Implement user-requested features

## Troubleshooting

### Common Issues

#### Build Failures

**Issue**: TypeScript compilation errors

```bash
# Fix: Run type checking
npm run lint
npx tsc --noEmit
```

**Issue**: Environment variable not found

```bash
# Fix: Check .env.local file
cp .env.example .env.local
# Update with correct values
```

#### Deployment Issues

**Issue**: GitHub Pages deployment failed

```bash
# Check GitHub Actions logs
# Verify repository settings
# Ensure proper permissions
```

**Issue**: Performance audit failures

```bash
# Check Lighthouse report
npm run lighthouse
# Optimize identified issues
```

#### Runtime Issues

**Issue**: Recipe generation failing

```bash
# Check API key configuration
# Verify rate limiting settings
# Check network connectivity
```

**Issue**: Analytics not working

```bash
# Verify GDPR consent given
# Check Google Analytics configuration
# Ensure proper tracking ID
```

### Debug Mode

Enable debug mode for detailed logging:

```env
VITE_APP_ENVIRONMENT=development
VITE_ENABLE_ERROR_TRACKING=true
```

### Support

For additional support:

- **Documentation**: Check the README.md and component docs
- **Issues**: Create GitHub issues for bugs or feature requests
- **Community**: Join our Discord server for community support

## Security Considerations

### Content Security Policy

The application includes comprehensive CSP headers:

- Restricts script sources to trusted domains
- Prevents XSS attacks
- Enforces HTTPS connections
- Blocks unauthorized frame embedding

### Data Privacy

- **GDPR compliant** with explicit consent management
- **Privacy-first analytics** with user control
- **Minimal data collection** approach
- **Transparent privacy policy** with clear explanations

### Regular Security Updates

- Automated dependency vulnerability scanning
- Security headers for all deployment platforms
- Input validation and sanitization
- Rate limiting and abuse prevention

## Performance Optimization

### Bundle Optimization

- **Code splitting** with dynamic imports
- **Tree shaking** to remove unused code
- **Image optimization** with modern formats
- **Lazy loading** for non-critical components

### Caching Strategy

- **Browser caching** with appropriate headers
- **Service worker** for offline functionality
- **Resource preloading** for critical assets
- **CDN integration** for global distribution

### Core Web Vitals

The application is optimized for:

- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

---

For more detailed information, refer to the individual component documentation and API references in the `/docs` directory.
