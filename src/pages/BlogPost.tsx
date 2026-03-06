import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, User, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

// Blog posts data - same as in Blog.tsx
const blogPosts = [
  {
    id: 1,
    title: "The Ultimate Guide to Dragon Fruit: Nature's Most Exotic Superfruit",
    slug: "dragon-fruit-guide",
    excerpt: "Discover the incredible health benefits and unique flavor profile of dragon fruit, plus 5 amazing juice recipes to try today.",
    content: `
      <p>Dragon fruit, also known as pitaya, is one of the most exotic and visually stunning tropical fruits available. With its vibrant pink skin and speckled flesh, it's no wonder this superfruit has captured the attention of health enthusiasts worldwide.</p>
      
      <h2>What is Dragon Fruit?</h2>
      <p>Dragon fruit grows on a cactus plant called Hylocereus, native to Central America but now cultivated in many tropical regions around the world. The fruit comes in three varieties: red-skinned with white flesh, red-skinned with red flesh, and yellow-skinned with white flesh.</p>
      
      <h2>Health Benefits</h2>
      <ul>
        <li><strong>Rich in Antioxidants:</strong> Dragon fruit contains powerful antioxidants that help fight free radicals and reduce oxidative stress.</li>
        <li><strong>Boosts Immune System:</strong> High in vitamin C and other immune-boosting nutrients.</li>
        <li><strong>Supports Digestive Health:</strong> Contains dietary fiber and prebiotics that promote gut health.</li>
        <li><strong>Heart Health:</strong> May help lower bad cholesterol levels and reduce heart disease risk.</li>
      </ul>
      
      <h2>5 Delicious Dragon Fruit Juice Recipes</h2>
      
      <h3>1. Dragon Fruit Sunrise</h3>
      <p>1 cup dragon fruit, 1 orange, 1/2 cup pineapple, 1 cup coconut water</p>
      
      <h3>2. Tropical Dragon Blast</h3>
      <p>1 cup dragon fruit, 1/2 mango, 1 banana, 1 cup almond milk</p>
      
      <h3>3. Dragon Fruit Detox</h3>
      <p>1 cup dragon fruit, 1 cucumber, 1/2 lime, 1 inch ginger, 2 cups spinach</p>
      
      <h3>4. Dragon Fruit Protein Punch</h3>
      <p>1 cup dragon fruit, 1 scoop protein powder, 1 banana, 1 cup Greek yogurt</p>
      
      <h3>5. Dragon Fruit Smoothie Bowl</h3>
      <p>1 cup frozen dragon fruit, 1 banana, 1/2 cup coconut milk, topped with granola and fresh berries</p>
      
      <h2>How to Choose and Store</h2>
      <p>When selecting dragon fruit, look for bright, evenly colored skin without any blemishes. The fruit should give slightly when pressed. Store at room temperature for up to 2 days, or in the refrigerator for up to 5 days.</p>
    `,
    author: "Sophie Williams",
    date: "2025-01-15",
    readTime: "8 min read",
    category: "Superfruits",
    image: "🐉",
    tags: ["Dragon Fruit", "Antioxidants", "Recipes", "Superfood"],
  },
  {
    id: 2,
    title: "Acai Berries: The Amazonian Superfruit Taking the World by Storm",
    slug: "acai-berries",
    excerpt: "Learn about the powerful antioxidants in acai and how this Brazilian berry can boost your immune system and energy levels.",
    content: `
      <p>Acai berries have become one of the most popular superfoods in the world, and for good reason. These small, dark purple berries are packed with nutrients and powerful antioxidants that offer numerous health benefits.</p>
      
      <h2>What is Acai?</h2>
      <p>Acai (pronounced ah-sah-EE) is a small, dark purple berry that grows on the acai palm tree in the Amazon rainforest of Brazil. For centuries, it has been a staple food for indigenous Amazonian communities.</p>
      
      <h2>Nutritional Powerhouse</h2>
      <p>Acai berries are rich in:</p>
      <ul>
        <li><strong>Antioxidants:</strong> Contains more antioxidants than blueberries</li>
        <li><strong>Healthy Fats:</strong> Good source of omega-3, omega-6, and omega-9 fatty acids</li>
        <li><strong>Fiber:</strong> Promotes digestive health and feelings of fullness</li>
        <li><strong>Protein:</strong> Contains essential amino acids</li>
        <li><strong>Vitamins:</strong> Rich in vitamin C, vitamin A, and B vitamins</li>
      </ul>
      
      <h2>Health Benefits</h2>
      <ul>
        <li>Boosts immune system</li>
        <li>Improves heart health</li>
        <li>Supports brain function</li>
        <li>Aids in weight management</li>
        <li>Promotes healthy skin</li>
      </ul>
      
      <h2>How to Enjoy Acai</h2>
      <p>The most popular way to enjoy acai is in smoothie bowls, but it can also be used in juices, smoothies, and even savory dishes.</p>
    `,
    author: "Maria Rodriguez",
    date: "2025-02-20",
    readTime: "6 min read",
    category: "Superfruits",
    image: "🫐",
    tags: ["Acai", "Antioxidants", "Amazon", "Superfood"],
  },
  {
    id: 3,
    title: "Mangosteen: The Queen of Tropical Fruits",
    slug: "mangosteen-queen",
    excerpt: "Explore the anti-inflammatory properties of mangosteen and why it's considered one of the most nutritious tropical fruits.",
    content: `
      <p>Known as the "Queen of Fruits," mangosteen is a tropical fruit prized for its sweet, tangy flavor and impressive health benefits. Despite its name, it's not related to mangoes.</p>
      
      <h2>What is Mangosteen?</h2>
      <p>Mangosteen is a tropical fruit with a thick purple rind and white, juicy flesh segments inside. It's native to Southeast Asia and has been cultivated for centuries for its delicious taste and medicinal properties.</p>
      
      <h2>Xanthones: The Secret Weapon</h2>
      <p>What makes mangosteen special is its high content of xanthones - powerful compounds with exceptional antioxidant and anti-inflammatory properties.</p>
      
      <h2>Health Benefits</h2>
      <ul>
        <li><strong>Powerful Anti-inflammatory:</strong> Xanthones help reduce inflammation in the body</li>
        <li><strong>Immune Support:</strong> Boosts the body's natural defenses</li>
        <li><strong>Digestive Health:</strong> Contains fiber and supports gut health</li>
        <li><strong>Heart Health:</strong> May help lower cholesterol levels</li>
        <li><strong>Skin Health:</strong> Promotes healthy, glowing skin</li>
      </ul>
      
      <h2>How to Eat Mangosteen</h2>
      <p>Simply score the purple rind around the middle and twist to open. Enjoy the white flesh segments, making sure to remove any bitter seeds.</p>
    `,
    author: "James Chen",
    date: "2025-03-10",
    readTime: "7 min read",
    category: "Superfruits",
    image: "🥭",
    tags: ["Mangosteen", "Anti-inflammatory", "Vitamins"],
  },
  {
    id: 4,
    title: "Morning Energy Boost: 7 Tropical Juice Recipes to Start Your Day",
    slug: "morning-energy-boost",
    excerpt: "Transform your mornings with these energizing tropical juice blends that provide sustained energy without the coffee crash.",
    content: `
      <p>Say goodbye to morning grogginess and hello to natural, sustained energy with these delicious tropical juice recipes!</p>
      
      <h2>Why Tropical Fruits?</h2>
      <p>Tropical fruits are naturally rich in vitamins, minerals, and natural sugars that provide clean energy without the crash associated with caffeine.</p>
      
      <h2>7 Energizing Recipes</h2>
      
      <h3>1. Tropical Sunrise (5 min)</h3>
      <p>Ingredients: 1 cup mango, 1/2 cup pineapple, 1 orange, 1/2 cup coconut water</p>
      
      <h3>2. Green Energy Boost (5 min)</h3>
      <p>Ingredients: 1 cup spinach, 1/2 avocado, 1 banana, 1 cup coconut water, 1 tbsp honey</p>
      
      <h3>3. Citrus Power (3 min)</h3>
      <p>Ingredients: 1 grapefruit, 1 orange, 1 inch ginger, 1/2 lemon</p>
      
      <h3>4. Berry Tropical Mix (4 min)</h3>
      <p>Ingredients: 1/2 cup strawberries, 1/2 cup mango, 1 banana, 1 cup almond milk</p>
      
      <h3>5. Ginger Pineapple Punch (4 min)</h3>
      <p>Ingredients: 1 cup pineapple, 1 inch fresh ginger, 1/2 lemon, 1/2 tsp turmeric</p>
      
      <h3>6. Protein Paradise (5 min)</h3>
      <p>Ingredients: 1/2 cup cottage cheese, 1/2 cup pineapple, 1/2 mango, 1 cup orange juice</p>
      
      <h3>7. Green Machine (5 min)</h3>
      <p>Ingredients: 1 cup spinach, 1/2 cucumber, 1/2 green apple, 1/2 lemon, 1 inch ginger</p>
      
      <h2>Tips for Maximum Energy</h2>
      <ul>
        <li>Drink your juice within 30 minutes of waking</li>
        <li>Include protein for sustained energy</li>
        <li>Add a source of healthy fat</li>
        <li>Avoid adding refined sugars</li>
      </ul>
    `,
    author: "Maria Rodriguez",
    date: "2025-01-12",
    readTime: "6 min read",
    category: "Recipes",
    image: "⚡",
    tags: ["Energy", "Morning", "Breakfast", "Recipes"],
  },
  {
    id: 5,
    title: "Tropical Smoothie Bowl Recipes: Instagram-Worthy Breakfast Ideas",
    slug: "tropical-smoothie-bowls",
    excerpt: "Create beautiful and nutritious smoothie bowls at home with these easy tropical fruit combinations.",
    content: `
      <p>Smoothie bowls have taken social media by storm, and for good reason - they're delicious, nutritious, and absolutely beautiful!</p>
      
      <h2>Base Recipes</h2>
      
      <h3>Mango Paradise Bowl</h3>
      <p>1 cup frozen mango, 1 frozen banana, 1/2 cup coconut milk, 1 tbsp honey</p>
      
      <h3>Pina Colada Bowl</h3>
      <p>1 cup frozen pineapple, 1/2 cup frozen banana, 1/2 cup coconut cream, 1/4 cup coconut milk</p>
      
      <h3>Dragon Fruit Dream Bowl</h3>
      <p>1 cup frozen dragon fruit, 1 frozen banana, 1/2 cup coconut milk, 1 tbsp agave</p>
      
      <h2>Topping Ideas</h2>
      <ul>
        <li>Fresh tropical fruits</li>
        <li>Granola or crispy rice</li>
        <li>Shredded coconut</li>
        <li>Chia seeds</li>
        <li>Sliced almonds</li>
        <li>Edible flowers</li>
        <li>Cacao nibs</li>
        <li>Honey or maple syrup drizzle</li>
      </ul>
      
      <h2>Pro Tips for Perfect Bowls</h2>
      <ul>
        <li>Use frozen fruit for thick, creamy texture</li>
        <li>Use less liquid than smoothies</li>
        <li>Blend in high-speed blender</li>
        <li>Top immediately to prevent sogginess</li>
      </ul>
    `,
    author: "Sophie Williams",
    date: "2025-02-05",
    readTime: "5 min read",
    category: "Recipes",
    image: "🥣",
    tags: ["Smoothie Bowl", "Breakfast", "Recipes", "Instagram"],
  },
  {
    id: 6,
    title: "Detox Cleanse Recipes: 3-Day Tropical Juice Reset",
    slug: "detox-cleanse-recipes",
    excerpt: "A complete guide to doing a juice cleanse with tropical fruits to reset your system naturally.",
    content: `
      <p>A juice cleanse can help give your digestive system a rest while flooding your body with nutrients. Here's how to do it safely with tropical fruits.</p>
      
      <h2>Benefits of a Juice Cleanse</h2>
      <ul>
        <li>Increased energy</li>
        <li>Better digestion</li>
        <li>Clearer skin</li>
        <li>Mental clarity</li>
        <li>Weight loss</li>
      </ul>
      
      <h2>3-Day Plan</h2>
      
      <h3>Day 1: Light Start</h3>
      <p>Morning: Green Tropical Juice<br/>Midday: Pineapple Ginger Refresh<br/>Evening: Cucumber Mint Cooler</p>
      
      <h3>Day 2: Deep Clean</h3>
      <p>Morning: Citrus Sunrise<br/>Midday: Green Machine<br/>Evening: Berry Antioxidant</p>
      
      <h3>Day 3: Rebuild</h3>
      <p>Morning: Mango Protein<br/>Midday: Tropical Blend<br/>Evening: Coconut Refresh</p>
      
      <h2>Important Tips</h2>
      <ul>
        <li>Drink 6 juices per day</li>
        <li>Stay hydrated with water</li>
        <li>Rest as much as possible</li>
        <li>Avoid caffeine and alcohol</li>
        <li>Listen to your body</li>
      </ul>
    `,
    author: "James Chen",
    date: "2025-03-01",
    readTime: "10 min read",
    category: "Recipes",
    image: "🥤",
    tags: ["Detox", "Cleanse", "Recipes", "Reset"],
  },
  {
    id: 7,
    title: "Detox vs. Cleanse: Understanding the Science Behind Juice Cleanses",
    slug: "detox-vs-cleanse",
    excerpt: "Separate fact from fiction in the world of juice cleanses and learn how to detox your body naturally and safely.",
    content: `
      <p>The terms "detox" and "cleanse" are often used interchangeably, but they actually refer to different processes. Let's explore the science.</p>
      
      <h2>What is Detoxification?</h2>
      <p>Your body has its own sophisticated detoxification system involving the liver, kidneys, lungs, and skin. These organs work 24/7 to eliminate toxins.</p>
      
      <h2>What is a Cleanse?</h2>
      <p>A cleanse is a dietary approach that gives your digestive system a break while providing concentrated nutrients.</p>
      
      <h2>The Benefits (Backed by Science)</h2>
      <ul>
        <li>Reduced inflammation</li>
        <li>Improved gut health</li>
        <li>Increased fruit and vegetable intake</li>
        <li>Better hydration</li>
        <li>Weight loss (temporary)</li>
      </ul>
      
      <h2>Common Misconceptions</h2>
      <ul>
        <li><strong>Myth:</strong> You need special products to detox</li>
        <li><strong>Fact:</strong> Your body detoxes itself naturally</li>
        <li><strong>Myth:</strong> Juice cleanses remove toxins</li>
        <li><strong>Fact:</strong> They support your body's natural processes</li>
      </ul>
      
      <h2>Safe Cleansing Practices</h2>
      <ul>
        <li>Keep it short (1-3 days)</li>
        <li>Choose whole foods when possible</li>
        <li>Listen to your body</li>
        <li>Consult a healthcare professional first</li>
      </ul>
    `,
    author: "James Chen",
    date: "2025-01-10",
    readTime: "10 min read",
    category: "Health",
    image: "🌿",
    tags: ["Detox", "Science", "Health", "Cleansing"],
  },
  {
    id: 8,
    title: "Heart Health and Tropical Fruits: What the Latest Research Shows",
    slug: "heart-health-tropical",
    excerpt: "Discover how tropical fruits can support cardiovascular health and lower risk of heart disease.",
    content: `
      <p>Recent research continues to highlight the cardiovascular benefits of tropical fruits. Let's explore what science says.</p>
      
      <h2>Key Heart-Healthy Compounds</h2>
      <ul>
        <li><strong>Potassium:</strong> Helps regulate blood pressure</li>
        <li><strong>Fiber:</strong> Reduces cholesterol levels</li>
        <li><strong>Antioxidants:</strong> Prevent artery damage</li>
        <li><strong>Magnesium:</strong> Supports heart muscle function</li>
      </ul>
      
      <h2>Best Tropical Fruits for Heart Health</h2>
      
      <h3>Passion Fruit</h3>
      <p>Rich in potassium and fiber, passion fruit helps lower blood pressure and cholesterol.</p>
      
      <h3>Papaya</h3>
      <p>Contains papain and antioxidants that support cardiovascular health.</p>
      
      <h3>Mango</h3>
      <p>High in vitamin C and fiber, mangoes help reduce heart disease risk.</p>
      
      <h3>Pineapple</h3>
      <p>Contains bromelain, which helps reduce inflammation in blood vessels.</p>
      
      <h2>Research Highlights</h2>
      <p>Studies show that regular consumption of tropical fruits can:</p>
      <ul>
        <li>Lower LDL (bad) cholesterol</li>
        <li>Reduce blood pressure</li>
        <li>Decrease inflammation markers</li>
        <li>Improve blood vessel function</li>
      </ul>
    `,
    author: "Dr. Emily Santos",
    date: "2025-02-15",
    readTime: "8 min read",
    category: "Health",
    image: "❤️",
    tags: ["Heart Health", "Cardiovascular", "Research", "Vitamins"],
  },
  {
    id: 9,
    title: "Boost Your Immune System with These Tropical Powerhouses",
    slug: "immune-system-boost",
    excerpt: "Learn which tropical fruits are packed with vitamin C and immune-boosting nutrients.",
    content: `
      <p>Your immune system is your body's first line of defense against illness. Tropical fruits are packed with nutrients that can help strengthen it.</p>
      
      <h2>Top Immune-Boosting Tropical Fruits</h2>
      
      <h3>1. Guava</h3>
      <p>One of the richest sources of vitamin C - just one guava provides 4x the daily requirement!</p>
      
      <h3>2. Papaya</h3>
      <p>Contains papain and vitamins A, C, and E for immune support.</p>
      
      <h3>3. Pineapple</h3>
      <p>Bromelain helps your body fight infections and reduce inflammation.</p>
      
      <h3>4. Kiwi</h3>
      <p>Packed with vitamin C, vitamin K, and folate.</p>
      
      <h3>5. Mango</h3>
      <p>Rich in vitamin A and C, plus compounds that support immune function.</p>
      
      <h2>Key Nutrients for Immunity</h2>
      <ul>
        <li><strong>Vitamin C:</strong> White blood cell production</li>
        <li><strong>Vitamin A:</strong> Skin and membrane health</li>
        <li><strong>Vitamin E:</strong> Antioxidant protection</li>
        <li><strong>Folate:</strong> Cell production and repair</li>
      </ul>
      
      <h2>Daily Immune-Boosting Routine</h2>
      <p>Start your day with a tropical juice containing at least 2 immune-boosting fruits!</p>
    `,
    author: "Maria Rodriguez",
    date: "2025-03-05",
    readTime: "6 min read",
    category: "Health",
    image: "🛡️",
    tags: ["Immune System", "Vitamin C", "Health", "Nutrition"],
  },
  {
    id: 10,
    title: "Sustainable Sourcing: How We Support Tropical Fruit Farmers",
    slug: "sustainable-sourcing",
    excerpt: "Learn about our commitment to fair trade and sustainable farming practices that benefit both farmers and the environment.",
    content: `
      <p>At Tropical AI Chef, we believe that great taste and ethical practices go hand in hand. Here's how we source our fruits.</p>
      
      <h2>Our Sourcing Principles</h2>
      
      <h3>Fair Trade</h3>
      <p>We partner exclusively with fair trade certified farms, ensuring farmers receive fair compensation for their work.</p>
      
      <h3>Sustainable Farming</h3>
      <p>We prioritize farms that use organic methods, conserve water, and protect biodiversity.</p>
      
      <h3>Local Sourcing</h3>
      <p>Whenever possible, we source from local farmers to reduce our carbon footprint.</p>
      
      <h2>Our Farmer Partners</h2>
      <p>We work directly with over 50 family farms across Latin America and Southeast Asia.</p>
      
      <h2>Environmental Initiatives</h2>
      <ul>
        <li>Carbon-neutral shipping</li>
        <li>Recyclable packaging</li>
        <li>Tree planting programs</li>
        <li>Water conservation projects</li>
      </ul>
      
      <h2>How You Can Help</h2>
      <ul>
        <li>Choose products with fair trade labels</li>
        <li>Support local farmers markets</li>
        <li>Reduce food waste</li>
        <li>Buy seasonal fruits</li>
      </ul>
    `,
    author: "Sophie Williams",
    date: "2025-01-08",
    readTime: "5 min read",
    category: "Sustainability",
    image: "🌱",
    tags: ["Sustainability", "Fair Trade", "Farmers", "Environment"],
  },
  {
    id: 11,
    title: "The Future of Tropical Agriculture: Regenerative Farming Practices",
    slug: "regenerative-farming",
    excerpt: "How regenerative agriculture is transforming tropical fruit farming and combating climate change.",
    content: `
      <p>Regenerative agriculture is revolutionizing how we grow tropical fruits, focusing on healing the land while producing nutritious crops.</p>
      
      <h2>What is Regenerative Agriculture?</h2>
      <p>Regenerative agriculture goes beyond sustainability to actively improve soil health, increase biodiversity, and sequester carbon.</p>
      
      <h2>Key Practices</h2>
      <ul>
        <li>Cover cropping</li>
        <li>No-till farming</li>
        <li>Agroforestry</li>
        <li>Composting</li>
        <li>Integrated pest management</li>
      </ul>
      
      <h2>Benefits for Tropical Fruits</h2>
      <ul>
        <li>Higher nutrient content</li>
        <li>Better flavor</li>
        <li>More resilient crops</li>
        <li>Reduced need for fertilizers</li>
      </ul>
      
      <h2>Climate Impact</h2>
      <p>Regenerative farms can sequester up to 3 tons of carbon per acre annually, making them powerful tools against climate change.</p>
      
      <h2>The Future is Now</h2>
      <p>More tropical fruit farms are adopting regenerative practices, and consumers are increasingly seeking out these products.</p>
    `,
    author: "Carlos Mendez",
    date: "2025-02-28",
    readTime: "7 min read",
    category: "Sustainability",
    image: "🌍",
    tags: ["Regenerative", "Agriculture", "Climate", "Farming"],
  },
  {
    id: 12,
    title: "Zero-Waste Tropical Juicing: Tips for an Eco-Friendly Kitchen",
    slug: "zero-waste-juicing",
    excerpt: "Reduce food waste with these creative tips for using every part of tropical fruits in your kitchen.",
    content: `
      <p>Getting the most out of your tropical fruits not only saves money but also helps the environment. Here's how to reduce waste.</p>
      
      <h2>Using the Whole Fruit</h2>
      
      <h3>Pineapple</h3>
      <ul>
        <li>Core: Make pineapple core tea</li>
        <li>Leaves: Use as garnish or compost</li>
        <li>Skin: Make infused water or vinegar</li>
      </ul>
      
      <h3>Mango</h3>
      <ul>
        <li>Pit: Blend into smoothies or make mango butter</li>
        <li>Skin: Edible (but not tasty), best for composting</li>
      </ul>
      
      <h3>Watermelon</h3>
      <ul>
        <li>Rind: Pickle or add to salads</li>
        <li>Seeds: Roast for a nutritious snack</li>
      </ul>
      
      <h2>Juicing Tips</h2>
      <ul>
        <li>Use vegetable scraps for broth</li>
        <li>Compost what you can't use</li>
        <li>Store juice properly</li>
        <li>Buy whole fruits instead of pre-cut</li>
      </ul>
      
      <h2>Creative Recipes</h2>
      <p>Turn pulp, cores, and peels into:</p>
      <ul>
        <li>Fruit leather</li>
        <li>Smoothies</li>
        <li>Fruit-infused water</li>
        <li>Natural cleaning solutions</li>
      </ul>
    `,
    author: "Ana Costa",
    date: "2025-03-12",
    readTime: "4 min read",
    category: "Sustainability",
    image: "♻️",
    tags: ["Zero Waste", "Eco-Friendly", "Tips", "Kitchen"],
  },
  {
    id: 13,
    title: "AI-Powered Nutrition: How Technology is Revolutionizing Healthy Eating",
    slug: "ai-powered-nutrition",
    excerpt: "Explore how artificial intelligence is making personalized nutrition more accessible and effective than ever before.",
    content: `
      <p>Artificial intelligence is transforming how we approach nutrition, making personalized healthy eating more accessible than ever.</p>
      
      <h2>How AI is Changing Nutrition</h2>
      
      <h3>Personalized Recommendations</h3>
      <p>AI analyzes your preferences, health goals, and dietary restrictions to create custom meal plans.</p>
      
      <h3>Smart Recipe Generation</h3>
      <p>AI can suggest recipes based on available ingredients and nutritional needs.</p>
      
      <h3>Nutrient Tracking</h3>
      <p>Computer vision and voice recognition make logging food easier than ever.</p>
      
      <h2>Benefits of AI Nutrition</h2>
      <ul>
        <li>Personalized to your needs</li>
        <li>Time-saving meal planning</li>
        <li>Better adherence to goals</li>
        <li>Continuous optimization</li>
      </ul>
      
      <h2>The Future</h2>
      <p>AI nutrition will become even more sophisticated, integrating with wearable devices and genetic data for ultra-personalized recommendations.</p>
    `,
    author: "James Chen",
    date: "2025-01-05",
    readTime: "7 min read",
    category: "Technology",
    image: "🤖",
    tags: ["AI", "Technology", "Nutrition", "Personalization"],
  },
  {
    id: 14,
    title: "Smart Kitchen Gadgets Every Health Enthusiast Needs in 2025",
    slug: "smart-kitchen-gadgets",
    excerpt: "From AI-powered juicers to smart fridges, discover the latest technology for healthy living.",
    content: `
      <p>Technology is making it easier than ever to maintain a healthy lifestyle. Here are the must-have gadgets for 2025.</p>
      
      <h2>Top Gadgets</h2>
      
      <h3>AI Juicers</h3>
      <p>Smart juicers that optimize extraction based on fruit type and suggest recipes.</p>
      
      <h3>Smart Blenders</h3>
      <p>Blenders with built-in scales and recipe guidance.</p>
      
      <h3>Nutrient Trackers</h3>
      <p>Devices that analyze the nutritional content of your food in real-time.</p>
      
      <h3>Smart Refrigerators</h3>
      <p>Fridges that track contents and suggest recipes based on what's available.</p>
      
      <h3>Water Filtration Systems</h3>
      <p>Smart filters that track consumption and quality.</p>
      
      <h2>Investment Guide</h2>
      <ul>
        <li>Start with basics (good blender)</li>
        <li>Add smart storage</li>
        <li>Consider nutrient tracking</li>
        <li>Integrate with apps</li>
      </ul>
    `,
    author: "Tech Team",
    date: "2025-02-10",
    readTime: "6 min read",
    category: "Technology",
    image: "📱",
    tags: ["Smart Gadgets", "Technology", "Kitchen", "Innovation"],
  },
  {
    id: 15,
    title: "Blockchain Tracking: Ensuring Transparency in Your Juice",
    slug: "blockchain-tracking",
    excerpt: "How we're using blockchain technology to trace tropical fruits from farm to glass.",
    content: `
      <p>Blockchain technology is bringing unprecedented transparency to the food supply chain, and it's changing how we think about our juice.</p>
      
      <h2>What is Blockchain?</h2>
      <p>Blockchain is a decentralized digital ledger that records transactions across many computers securely.</p>
      
      <h2>Benefits for Food</h2>
      <ul>
        <li>Complete traceability</li>
        <li>Verified sustainability claims</li>
        <li>Proof of fair trade</li>
        <li>Quality assurance</li>
      </ul>
      
      <h2>How It Works</h2>
      <p>Every step of the journey - from farm to your glass - is recorded on the blockchain, creating an unchangeable record.</p>
      
      <h2>What You Can Verify</h2>
      <ul>
        <li>Farm origin</li>
        <li>Harvest date</li>
        <li>Transportation conditions</li>
        <li>Fair trade certification</li>
        <li>Organic status</li>
      </ul>
      
      <h2>The Future</h2>
      <p>As blockchain becomes more accessible, expect to see it used across the entire food industry.</p>
    `,
    author: "Digital Team",
    date: "2025-03-08",
    readTime: "5 min read",
    category: "Technology",
    image: "🔗",
    tags: ["Blockchain", "Transparency", "Tracking", "Supply Chain"],
  },
  {
    id: 16,
    title: "Tropical Fruits for Skin Health: Beauty from the Inside Out",
    slug: "skin-health-tropical",
    excerpt: "Discover which tropical fruits can help you achieve glowing, healthy skin naturally through proper nutrition.",
    content: `
      <p>Beautiful skin starts with proper nutrition. Tropical fruits are packed with vitamins and antioxidants that promote skin health.</p>
      
      <h2>Best Fruits for Skin</h2>
      
      <h3>Papaya</h3>
      <p>Contains papain, an enzyme that helps remove dead skin cells and promotes new cell growth.</p>
      
      <h3>Mango</h3>
      <p>Rich in vitamins A, C, and E, which are essential for skin repair and protection.</p>
      
      <h3>Pineapple</h3>
      <p>Bromelain helps reduce inflammation and may help with acne.</p>
      
      <h3>Guava</h3>
      <p>Extremely high in vitamin C, which is crucial for collagen production.</p>
      
      <h3>Passion Fruit</h3>
      <p>Contains vitamin A and antioxidants that protect skin from damage.</p>
      
      <h2>Key Nutrients for Skin</h2>
      <ul>
        <li><strong>Vitamin C:</strong> Collagen production</li>
        <li><strong>Vitamin E:</strong> Antioxidant protection</li>
        <li><strong>Vitamin A:</strong> Cell turnover</li>
        <li><strong>Antioxidants:</strong> Free radical protection</li>
      </ul>
      
      <h2>Skin-Boosting Recipes</h2>
      <p>Try this daily smoothie for glowing skin:</p>
      <p>1/2 cup papaya, 1/2 mango, 1/2 cup pineapple, 1 cup coconut water, 1 tbsp honey</p>
    `,
    author: "Maria Rodriguez",
    date: "2025-01-03",
    readTime: "6 min read",
    category: "Beauty",
    image: "✨",
    tags: ["Skin Health", "Beauty", "Vitamins", "Natural"],
  },
  {
    id: 17,
    title: "DIY Tropical Face Masks: Natural Beauty Treatments at Home",
    slug: "diy-face-masks",
    excerpt: "Create effective face masks using tropical fruits for glowing, healthy skin.",
    content: `
      <p>Nature provides everything you need for beautiful skin. Here are tropical face mask recipes you can make at home.</p>
      
      <h2>Mask Recipes</h2>
      
      <h3>Mango Honey Mask (Dry Skin)</h3>
      <p>2 tbsp mashed mango, 1 tbsp honey, 1 tsp yogurt</p>
      <p>Apply for 15 minutes, rinse with warm water.</p>
      
      <h3>Pineapple Enzyme Mask (Oily Skin)</h3>
      <p>2 tbsp pineapple juice, 1 tsp honey</p>
      <p>Apply for 10 minutes, rinse with cool water.</p>
      
      <h3>Papaya Brightening Mask (All Skin Types)</h3>
      <p>2 tbsp mashed papaya, 1 tsp lemon juice, 1 tsp turmeric</p>
      <p>Apply for 15 minutes, rinse with warm water.</p>
      
      <h3>Avocado Moisture Mask (Sensitive Skin)</h3>
      <p>1/2 avocado, 1 tbsp coconut oil, 1 tbsp mashed banana</p>
      <p>Apply for 20 minutes, rinse with warm water.</p>
      
      <h2>Tips for Best Results</h2>
      <ul>
        <li>Use fresh, ripe fruits</li>
        <li>Patch test first</li>
        <li>Don't leave masks too long</li>
        <li>Follow with moisturizer</li>
        <li>Use weekly, not daily</li>
      </ul>
    `,
    author: "Beauty Team",
    date: "2025-02-22",
    readTime: "5 min read",
    category: "Beauty",
    image: "🧴",
    tags: ["DIY", "Face Mask", "Natural", "Home Remedies"],
  },
  {
    id: 18,
    title: "Hair Health Secrets: Tropical Fruits for Stronger, Shinier Hair",
    slug: "hair-health-secrets",
    excerpt: "Learn which tropical fruits promote hair growth and overall hair health from the inside out.",
    content: `
      <p>Your diet plays a crucial role in hair health. Tropical fruits provide essential nutrients for strong, shiny locks.</p>
      
      <h2>Best Fruits for Hair</h2>
      
      <h3>Pineapple</h3>
      <p>Contains bromelain that helps with protein absorption - essential for hair growth.</p>
      
      <h3>Banana</h3>
      <p>Rich in biotin and silica, which promote hair strength and growth.</p>
      
      <h3>Papaya</h3>
      <p>Contains vitamin A, which helps produce sebum for moisturized scalp.</p>
      
      <h3>Orange</h3>
      <p>High in vitamin C, which helps your body absorb iron - crucial for hair health.</p>
      
      <h3>Mango</h3>
      <p>Contains vitamin E, which improves blood circulation to the scalp.</p>
      
      <h2>Hair-Boosting Nutrients</h2>
      <ul>
        <li><strong>Biotin:</strong> Hair growth</li>
        <li><strong>Vitamin C:</strong> Iron absorption</li>
        <li><strong>Vitamin A:</strong> Sebum production</li>
        <li><strong>Vitamin E:</strong> Scalp circulation</li>
      </ul>
      
      <h2>Hair Mask Recipe</h3>
      <p>1 ripe banana, 1/2 avocado, 1 tbsp honey, 1 tbsp coconut oil</p>
      <p>Apply to hair, leave for 30 minutes, shampoo out.</p>
    `,
    author: "Sophie Williams",
    date: "2025-03-15",
    readTime: "4 min read",
    category: "Beauty",
    image: "💇‍♀️",
    tags: ["Hair Health", "Beauty", "Nutrition", "Growth"],
  },
];

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background pt-20">
          <div className="container mx-auto max-w-4xl px-6 py-16 text-center">
            <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
            <p className="text-foreground/70 mb-8">The blog post you're looking for doesn't exist.</p>
            <Button asChild>
              <Link to="/blog">Back to Blog</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background pt-20">
        <article className="container mx-auto max-w-4xl px-6 py-16">
          <Link
            to="/blog"
            className="inline-flex items-center text-primary hover:text-primary/80 mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>

          <div className="text-center mb-12">
            <div className="text-6xl mb-4">{post.image}</div>
            <Badge variant="secondary" className="mb-4">
              {post.category}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-sunset bg-clip-text text-transparent">
              {post.title}
            </h1>
            <div className="flex items-center justify-center gap-6 text-foreground/70">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {post.author}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(post.date).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {post.readTime}
              </div>
            </div>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-xl text-foreground/80 mb-8">{post.excerpt}</p>
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>

          <div className="mt-12 pt-8 border-t">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </article>
      </div>
      <Footer />
    </>
  );
};

export default BlogPost;
