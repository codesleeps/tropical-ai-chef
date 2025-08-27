# AI Recipe Generator Setup Guide

Your tropical juice recipe generator now has **real AI capabilities**! Here's how to set it up:

## 🚀 Quick Start (No API Key Required)

The app works **immediately** with **Local AI** - a sophisticated recipe generation system that creates unique recipes based on your inputs. No setup required!

## 🤖 AI Service Options

### 1. Local AI (Default - FREE)
- ✅ **No API key required**
- ✅ **Works offline**
- ✅ **Instant generation**
- ✅ **Smart recipe logic**
- ✅ **Always available**

### 2. OpenAI GPT-3.5 (Premium)
- 🔑 **Requires API key**
- 🌟 **Most advanced AI**
- 💰 **Cost per request**
- 🚀 **Highly creative recipes**

### 3. Hugging Face (Alternative)
- 🔑 **Requires API key**
- 🆓 **Free tier available**
- 🤗 **Open source models**
- 📊 **Good recipe generation**

## 🔑 Setting Up External AI Services

### OpenAI Setup
1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create an account or sign in
3. Generate an API key
4. In the app, select "OpenAI GPT-3.5" and enter your key

### Hugging Face Setup
1. Visit [Hugging Face](https://huggingface.co/settings/tokens)
2. Create an account or sign in
3. Generate an access token
4. In the app, select "Hugging Face" and enter your token

## 🎯 How It Works

### Local AI Generation
The local AI system uses:
- **Smart ingredient combinations** based on fruit properties
- **Style-specific additions** (e.g., ginger for detox, chia seeds for energy)
- **Nutritional knowledge** to create balanced recipes
- **Creative naming** with tropical themes
- **Practical tips** for best results

### External AI Generation
External AI services:
- **Analyze your inputs** (fruit, style, vegetables, dietary needs)
- **Generate creative recipes** with advanced language models
- **Provide detailed instructions** and nutritional insights
- **Adapt to dietary restrictions** automatically

## 🌟 Features

- **Multiple fruit options** (10+ tropical fruits)
- **6 juice styles** (smoothie, detox, energy, immunity, digestive, beauty)
- **Vegetable additions** for extra nutrition
- **Dietary preference support** (vegan, gluten-free, etc.)
- **Smart fallbacks** if external AI fails
- **Beautiful recipe display** with formatting
- **Save and share** functionality

## 💡 Tips for Best Results

1. **Choose complementary fruits** - mango + pineapple work great together
2. **Consider your style** - detox needs cleansing ingredients, energy needs energizing ones
3. **Add vegetables** for extra nutrition (spinach, cucumber, celery)
4. **Specify dietary needs** for personalized recipes
5. **Experiment with combinations** - the AI learns from your preferences

## 🔧 Customization

### Adding New Fruits
Edit `src/config/ai.ts` to add:
- New fruit properties
- Nutritional benefits
- Sweetness levels

### Adding New Styles
Extend the juice styles with:
- New style definitions
- Style-specific ingredients
- Health benefits

### Modifying Prompts
Customize AI prompts in `src/config/ai.ts` for:
- Different recipe formats
- Specific dietary requirements
- Cultural preferences

## 🚨 Troubleshooting

### "API Key Required" Error
- Make sure you've entered the correct API key
- Check that the API key is valid and has credits
- Try switching to "Local AI" as a fallback

### "Failed to Generate Recipe" Error
- Check your internet connection
- Verify API key permissions
- The app will automatically fall back to local generation

### Slow Generation
- Local AI is instant
- External AI depends on service response time
- Consider using local AI for faster results

## 🌐 Deployment Notes

- **GitHub Pages**: Works perfectly with local AI
- **Vercel/Netlify**: Can use environment variables for API keys
- **Local Development**: All features work without deployment

## 🎉 Ready to Use!

Your AI recipe generator is now fully functional with:
- ✅ **Instant local AI generation**
- ✅ **External AI service integration**
- ✅ **Smart fallback systems**
- ✅ **Beautiful user interface**
- ✅ **Comprehensive recipe output**

Start creating delicious tropical juice recipes today! 🥭🍍✨
