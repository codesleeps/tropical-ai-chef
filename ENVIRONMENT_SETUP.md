# 🔐 Environment Configuration & Security Guide

## 📁 Environment Files Structure

```
tropical-ai-chef/
├── .env.example          # Template with all available variables
├── .env.development      # Development-specific settings
├── .env.production       # Production-specific settings
├── .env.local           # Local overrides (user-created, not in git)
└── .env                 # Default environment (user-created, not in git)
```

## 🔑 API Key Management

### Development Setup

1. Copy `.env.example` to `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

2. Add your API keys to `.env.local`:
   ```bash
   VITE_OPENAI_API_KEY=sk-your-openai-key-here
   VITE_HUGGINGFACE_API_KEY=hf_your-huggingface-token-here
   ```

### Production Setup

- **GitHub Pages**: Use repository secrets
- **Vercel/Netlify**: Use environment variable settings in dashboard
- **Local Production**: Use `.env.production.local`

## 🛡️ Security Best Practices

### ✅ What We Implemented

- Environment files excluded from git (`.gitignore`)
- API key validation and fallbacks
- Secure key handling with environment variables
- Development vs production configurations
- API key sanitization for logging

### ⚠️ Important Security Notes

1. **Never commit `.env` files** containing real API keys
2. **Use `.env.example`** as a template only
3. **Environment variables are exposed** to the client in Vite apps
4. **API keys are visible** in the browser - this is normal for client-side apps
5. **Use server-side proxy** for sensitive API keys in production

## 🚀 Environment Configuration

### Available Variables

```bash
# App Information
VITE_APP_NAME=Tropical AI Chef
VITE_APP_VERSION=1.0.0
VITE_APP_ENVIRONMENT=development|production|test

# API Keys (Optional)
VITE_OPENAI_API_KEY=your_openai_api_key_here
VITE_HUGGINGFACE_API_KEY=your_huggingface_api_key_here

# Feature Flags
VITE_ENABLE_ANALYTICS=true|false
VITE_ENABLE_ERROR_TRACKING=true|false

# API Configuration
VITE_API_TIMEOUT=30000
VITE_MAX_RECIPES_PER_SESSION=50

# URLs
VITE_BASE_URL=http://localhost:5173
VITE_PRODUCTION_URL=https://yourdomain.github.io/tropical-ai-chef

# Analytics (Optional)
VITE_GA_TRACKING_ID=your_google_analytics_id_here
```

### How It Works

1. **Vite loads environment files** in this order:

   - `.env`
   - `.env.local`
   - `.env.[mode]`
   - `.env.[mode].local`

2. **Variables prefixed with `VITE_`** are exposed to the client
3. **Environment config utility** (`src/config/environment.ts`) provides:
   - Type-safe environment variables
   - Validation and fallbacks
   - Helper functions for feature flags
   - Development logging

## 🎯 Usage Examples

### In Components

```typescript
import { env, hasOpenAIKey, isProduction } from "@/config/environment";

// Check if API key is available
if (hasOpenAIKey()) {
  // Use OpenAI service
} else {
  // Fall back to local AI
}

// Feature flags
if (env.enableAnalytics && isProduction()) {
  // Enable analytics
}
```

### Environment Helpers

```typescript
import {
  env,
  isProduction,
  isDevelopment,
  hasOpenAIKey,
  hasHuggingFaceKey,
  shouldEnableAnalytics,
} from "@/config/environment";

// Environment checks
const isProd = isProduction();
const isDev = isDevelopment();

// API key validation
const canUseOpenAI = hasOpenAIKey();
const canUseHuggingFace = hasHuggingFaceKey();

// Feature flags
const analyticsEnabled = shouldEnableAnalytics();
```

## 🔧 Troubleshooting

### Common Issues

1. **Environment variables not loading**

   - Ensure variables start with `VITE_`
   - Restart development server after changes
   - Check file naming (`.env.local`, not `.env.local.example`)

2. **API keys not working**

   - Verify key format and validity
   - Check environment variable name matches
   - Ensure no trailing spaces or quotes

3. **Production deployment issues**
   - Set environment variables in deployment platform
   - Check build process includes environment files
   - Verify `VITE_APP_ENVIRONMENT=production`

### Debug Commands

```bash
# Check environment variables in development
console.log(import.meta.env);

# View current configuration
import { logEnvironmentInfo } from '@/config/environment';
logEnvironmentInfo(); // Only works in development
```

## 🌟 Benefits Achieved

✅ **Secure API key handling**
✅ **Environment-specific configurations**  
✅ **Feature flag support**
✅ **Development vs production settings**
✅ **Type-safe environment variables**
✅ **Fallback mechanisms**
✅ **Security best practices**

## 🚀 Next Steps

After this configuration:

1. **Performance Optimization** - Loading states and caching
2. **Error Handling** - Error boundaries and user feedback
3. **SEO & Meta Tags** - Search engine optimization
4. **Testing** - Unit and integration tests
5. **Analytics** - User behavior tracking

Your app now has a solid, secure foundation for production deployment! 🎉
