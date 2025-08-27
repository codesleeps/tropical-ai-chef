import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, Heart, Zap, Shield, Star, Users } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-sunset bg-clip-text text-transparent">
            About Fresh Tropical Juices
          </h1>
          <p className="text-xl text-foreground/70 mb-8 leading-relaxed">
            We're passionate about bringing you the freshest, most delicious tropical juice experiences 
            through innovative AI-powered recipe creation and premium quality ingredients.
          </p>
          <Button size="lg" className="gradient-tropical text-foreground font-bold">
            Join Our Journey
          </Button>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-secondary">Our Story</h2>
              <p className="text-lg text-foreground/80 mb-6 leading-relaxed">
                Founded in 2024, Fresh Tropical Juices was born from a simple idea: everyone deserves 
                access to personalized, healthy, and delicious tropical juice blends that fit their 
                unique taste preferences and nutritional needs.
              </p>
              <p className="text-lg text-foreground/80 mb-6 leading-relaxed">
                Using cutting-edge AI technology, we've created the world's first intelligent juice 
                recipe generator that considers your favorite fruits, dietary requirements, and 
                wellness goals to craft the perfect blend just for you.
              </p>
              <div className="flex items-center gap-4">
                <div className="text-4xl">🌴</div>
                <div>
                  <h3 className="font-bold text-primary">100% Natural</h3>
                  <p className="text-sm text-foreground/70">No artificial additives, ever</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">50K+</div>
                  <div className="text-sm text-foreground/70">Recipes Created</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-secondary mb-2">25+</div>
                  <div className="text-sm text-foreground/70">Tropical Fruits</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent mb-2">95%</div>
                  <div className="text-sm text-foreground/70">Customer Satisfaction</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                  <div className="text-sm text-foreground/70">Fresh Delivery</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-fresh bg-clip-text text-transparent">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="shadow-tropical border-0">
              <CardHeader className="text-center">
                <Leaf className="w-12 h-12 mx-auto text-accent mb-4" />
                <CardTitle className="text-xl text-accent">Sustainability</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-base">
                  We source our fruits from sustainable farms and use eco-friendly packaging 
                  to protect our planet for future generations.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="shadow-tropical border-0">
              <CardHeader className="text-center">
                <Heart className="w-12 h-12 mx-auto text-secondary mb-4" />
                <CardTitle className="text-xl text-secondary">Wellness First</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-base">
                  Every recipe is designed with your health in mind, packed with vitamins, 
                  minerals, and natural energy to fuel your best life.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="shadow-tropical border-0">
              <CardHeader className="text-center">
                <Zap className="w-12 h-12 mx-auto text-primary mb-4" />
                <CardTitle className="text-xl text-primary">Innovation</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-base">
                  We leverage AI and technology to create personalized experiences that 
                  make healthy living easier and more enjoyable than ever.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-12 text-secondary">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Maria Rodriguez", role: "Founder & CEO", emoji: "👩‍💼" },
              { name: "James Chen", role: "Head of AI", emoji: "👨‍💻" },
              { name: "Sophie Williams", role: "Nutrition Expert", emoji: "👩‍⚕️" }
            ].map((member, index) => (
              <div key={index} className="text-center">
                <div className="text-6xl mb-4">{member.emoji}</div>
                <h3 className="font-bold text-lg text-foreground">{member.name}</h3>
                <p className="text-foreground/70">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;