# 🌴 Tropical AI Chef

> AI-powered tropical recipe generation with privacy-first design and production-ready features

[![CI/CD](https://github.com/your-org/tropical-ai-chef/workflows/Production%20Deploy/badge.svg)](https://github.com/your-org/tropical-ai-chef/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.0+-blue.svg)](https://reactjs.org/)
[![Accessibility](https://img.shields.io/badge/Accessibility-WCAG%202.1%20AA-green.svg)](https://www.w3.org/WAI/WCAG21/quickref/)

## ✨ Features

### 🤖 AI-Powered Recipe Generation

- **Multiple AI Services**: OpenAI GPT, Hugging Face Transformers, and Local Browser AI
- **Smart Ingredient Selection**: Choose from 25+ tropical fruits and vegetables
- **Dietary Preferences**: Support for various dietary restrictions and health goals
- **Nutritional Analysis**: Comprehensive health benefits and nutritional information

### 🔐 Privacy & Security First

- **GDPR Compliant**: Explicit consent management and transparent data practices
- **Privacy-First Analytics**: User-controlled tracking with Do Not Track support
- **Comprehensive Security**: CSP headers, input validation, rate limiting, and CSRF protection
- **Legal Compliance**: Complete privacy policy and terms of service

### 🚀 Production Ready

- **Performance Optimized**: Core Web Vitals optimized with 85%+ Lighthouse scores
- **Mobile First**: Responsive design with progressive enhancement
- **Accessibility**: WCAG 2.1 AA compliant with screen reader support
- **SEO Optimized**: Structured data, Open Graph, and Twitter Card support

### 🛠 Developer Experience

- **TypeScript**: Full type safety with strict configuration
- **Modern Stack**: React 18, Vite 5, Tailwind CSS, and Radix UI
- **Testing**: Comprehensive unit, integration, and accessibility tests
- **CI/CD**: Automated deployment with GitHub Actions

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ or 20+ (LTS recommended)
- npm 9+ or yarn 1.22+
- Modern browser with ES2020 support

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/tropical-ai-chef.git
cd tropical-ai-chef

# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env.local

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see the application.

### Environment Configuration

Update `.env.local` with your settings:

```env
# API Keys (Optional - Local AI works without these)
VITE_OPENAI_API_KEY=your_openai_api_key_here
VITE_HUGGINGFACE_API_KEY=your_huggingface_api_key_here

# Analytics (Optional)
VITE_GA_TRACKING_ID=your_google_analytics_id_here

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_ERROR_TRACKING=false
```

## 📖 Usage

### Recipe Generation

1. **Select AI Service**: Choose between Local Browser AI (free), OpenAI GPT, or Hugging Face
2. **Choose Ingredients**: Select from tropical fruits like mango, pineapple, dragon fruit
3. **Set Preferences**: Pick dietary preferences (low sugar, high protein, detox, etc.)
4. **Generate Recipe**: Click "Generate Recipe" to create your personalized tropical juice
5. **Get Results**: Receive complete recipe with ingredients, instructions, and health benefits

### Navigation

- **Home**: Main landing page with featured recipes and testimonials
- **Recipe Generator**: AI-powered recipe creation tool
- **About**: Learn about our mission and team
- **Benefits**: Explore health benefits of tropical fruits
- **Blog**: Read articles about nutrition and wellness
- **Legal**: Access privacy policy and terms of service

### Development Features

- **Analytics Dashboard**: Available at `/analytics` in development mode
- **Performance Monitoring**: Real-time Core Web Vitals tracking
- **Error Boundary**: Graceful error handling with user-friendly messages
- **Responsive Design**: Mobile-first approach with progressive enhancement

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm run test:all

# Run specific test suites
npm run test:unit          # Unit tests
npm run test:integration   # Integration tests
npm run test:accessibility # Accessibility tests

# Run with coverage
npm run test:coverage

# Watch mode for development
npm run test:watch
```

### Test Coverage

Maintains minimum 70% coverage across:

- Lines of code
- Functions
- Branches
- Statements

## 🏗 Build & Deployment

### Production Build

```bash
# Build for production
npm run build:production

# Build for GitHub Pages
npm run build:gh

# Analyze bundle size
npm run analyze
```

### Deployment Options

#### GitHub Pages (Recommended)

```bash
npm run deploy
```

#### Vercel

```bash
npm install -g vercel
vercel --prod
```

#### Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod
```

#### Docker

```bash
docker build -t tropical-ai-chef .
docker run -p 8080:80 tropical-ai-chef
```

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## 🔧 Technology Stack

### Frontend

- **React 18**: Modern React with Concurrent Features
- **TypeScript 5**: Strict type checking for reliability
- **Vite 5**: Fast build tool with HMR
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Headless, accessible UI components

### AI & APIs

- **OpenAI GPT**: Advanced language model for recipe generation
- **Hugging Face**: Open-source transformer models
- **Browser AI**: Local AI processing for privacy

### Development Tools

- **ESLint**: Code linting with TypeScript support
- **Prettier**: Code formatting
- **Vitest**: Unit and integration testing
- **React Testing Library**: Component testing utilities
- **Jest Axe**: Accessibility testing

### Production Features

- **Service Worker**: Offline functionality and caching
- **Analytics**: Privacy-first Google Analytics 4 integration
- **Monitoring**: Performance and error tracking
- **Security**: CSP, CSRF protection, input validation

## 📁 Project Structure

```
tropical-ai-chef/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # Reusable UI components
│   │   ├── RecipeGenerator/ # Recipe generation logic
│   │   └── Navigation/      # Navigation components
│   ├── pages/              # Page components
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   │   ├── analytics.ts    # Analytics implementation
│   │   ├── performance.ts  # Performance monitoring
│   │   └── security.ts     # Security utilities
│   ├── config/             # Configuration files
│   └── test/               # Test utilities and setup
├── scripts/                # Build and deployment scripts
├── .github/               # GitHub Actions workflows
├── docs/                  # Documentation
└── public/                # Static assets
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Install** dependencies: `npm install`
4. **Make** your changes with tests
5. **Run** tests: `npm run test:all`
6. **Build** the project: `npm run build:production`
7. **Commit** your changes: `git commit -m 'Add amazing feature'`
8. **Push** to the branch: `git push origin feature/amazing-feature`
9. **Open** a Pull Request

### Code Standards

- **TypeScript**: Strict mode enabled, no `any` types
- **Testing**: All new features must include tests
- **Accessibility**: WCAG 2.1 AA compliance required
- **Performance**: Lighthouse scores 85%+ required
- **Security**: Security review for all changes

## 📊 Performance

### Lighthouse Scores (Target)

- **Performance**: 90%+
- **Accessibility**: 95%+
- **Best Practices**: 95%+
- **SEO**: 95%+
- **PWA**: 90%+

### Core Web Vitals

- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

## 🔒 Security

### Security Features

- **Content Security Policy**: Strict CSP headers prevent XSS
- **Input Validation**: All user inputs sanitized and validated
- **Rate Limiting**: API abuse prevention
- **CSRF Protection**: Cross-site request forgery prevention
- **Secure Headers**: Comprehensive security headers for all platforms

### Privacy Features

- **GDPR Compliance**: Full compliance with data protection regulations
- **Consent Management**: Granular privacy controls
- **Data Minimization**: Collect only necessary data
- **Transparency**: Clear privacy policy and data usage

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for GPT API access
- **Hugging Face** for open-source AI models
- **Radix UI** for accessible component primitives
- **Tailwind CSS** for the utility-first CSS framework
- **React Team** for the amazing React ecosystem

## 📞 Support

- **Documentation**: Comprehensive guides in `/docs`
- **Issues**: [GitHub Issues](https://github.com/your-org/tropical-ai-chef/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/tropical-ai-chef/discussions)
- **Email**: support@tropical-ai-chef.com

## 🗓 Roadmap

### v1.1 (Next Release)

- [ ] Recipe sharing and social features
- [ ] User accounts and recipe history
- [ ] Advanced nutritional analysis
- [ ] Multi-language support

### v1.2 (Future)

- [ ] Mobile app (React Native)
- [ ] Recipe video generation
- [ ] Integration with fitness trackers
- [ ] AI-powered meal planning

### v2.0 (Long-term)

- [ ] Voice interface
- [ ] AR recipe visualization
- [ ] Smart shopping lists
- [ ] Community recipe marketplace

---

**Made with ❤️ by the Tropical AI Chef team**

_Bringing the power of AI to healthy, delicious tropical cuisine_
