import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Leaf, Heart, Zap, Shield, Star, Users } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

const About = () => {
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        {/* Company Introduction Section */}
        <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-background/90 to-secondary/30" />
          <div className="relative z-10 container mx-auto max-w-4xl text-center px-6">
            <div className="flex justify-center mb-6">
              <div className="flex items-center gap-4 text-6xl">🌴✨👥</div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-sunset bg-clip-text text-transparent leading-tight">
              About Fresh
              <br />
              Tropical Juices
            </h1>
            <p className="text-xl md:text-2xl text-foreground/80 mb-8 max-w-3xl mx-auto leading-relaxed">
              We're passionate about bringing you the freshest, most delicious
              tropical juice experiences through innovative AI-powered recipe
              creation and premium quality ingredients.
            </p>
            <Button
              size="lg"
              className="gradient-tropical text-foreground font-bold text-lg px-8 py-6 hover:scale-105 transition-bounce shadow-tropical"
            >
              <Users className="w-6 h-6 mr-2" />
              Join Our Journey
            </Button>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16 px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-5xl font-bold mb-6 text-black dark:text-white">
                    OUR STORY
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    How Fresh Tropical Juices came to be
                  </p>
                </div>
                <h3 className="text-2xl font-semibold mb-6 text-secondary">
                  Our Journey
                </h3>
                <p className="text-lg text-foreground/80 mb-6 leading-relaxed">
                  Founded in 2024, Fresh Tropical Juices was born from a simple
                  idea: everyone deserves access to personalized, healthy, and
                  delicious tropical juice blends that fit their unique taste
                  preferences and nutritional needs.
                </p>
                <p className="text-lg text-foreground/80 mb-6 leading-relaxed">
                  Using cutting-edge AI technology, we've created the world's
                  first intelligent juice recipe generator that considers your
                  favorite fruits, dietary requirements, and wellness goals to
                  craft the perfect blend just for you.
                </p>
                <div className="flex items-center gap-4">
                  <div className="text-4xl">🌴</div>
                  <div>
                    <h3 className="font-bold text-primary">100% Natural</h3>
                    <p className="text-sm text-foreground/70">
                      No artificial additives, ever
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">
                      50K+
                    </div>
                    <div className="text-sm text-foreground/70">
                      Recipes Created
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-secondary mb-2">
                      25+
                    </div>
                    <div className="text-sm text-foreground/70">
                      Tropical Fruits
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-accent mb-2">
                      95%
                    </div>
                    <div className="text-sm text-foreground/70">
                      Customer Satisfaction
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">
                      24/7
                    </div>
                    <div className="text-sm text-foreground/70">
                      Fresh Delivery
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 px-6 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-5xl font-bold mb-6 text-black dark:text-white">
                VALUES
              </h2>
              <p className="text-sm text-muted-foreground">
                The principles that guide everything we do
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="shadow-tropical border-0">
                <CardHeader className="text-center">
                  <Leaf className="w-12 h-12 mx-auto text-accent mb-4" />
                  <CardTitle className="text-xl text-accent">
                    Sustainability
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-base">
                    We source our fruits from sustainable farms and use
                    eco-friendly packaging to protect our planet for future
                    generations.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="shadow-tropical border-0">
                <CardHeader className="text-center">
                  <Heart className="w-12 h-12 mx-auto text-secondary mb-4" />
                  <CardTitle className="text-xl text-secondary">
                    Wellness First
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-base">
                    Every recipe is designed with your health in mind, packed
                    with vitamins, minerals, and natural energy to fuel your
                    best life.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="shadow-tropical border-0">
                <CardHeader className="text-center">
                  <Zap className="w-12 h-12 mx-auto text-primary mb-4" />
                  <CardTitle className="text-xl text-primary">
                    Innovation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-base">
                    We leverage AI and technology to create personalized
                    experiences that make healthy living easier and more
                    enjoyable than ever.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-16 px-6">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="mb-12">
              <h2 className="text-5xl font-bold mb-6 text-black dark:text-white">
                TEAM
              </h2>
              <p className="text-sm text-muted-foreground">
                The passionate people behind Fresh Tropical Juices
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: "Maria Rodriguez", role: "Founder & CEO", emoji: "👩‍💼" },
                { name: "James Chen", role: "Head of AI", emoji: "👨‍💻" },
                {
                  name: "Sophie Williams",
                  role: "Nutrition Expert",
                  emoji: "👩‍⚕️",
                },
              ].map((member, index) => (
                <div key={index} className="text-center">
                  <div className="text-6xl mb-4">{member.emoji}</div>
                  <h3 className="font-bold text-lg text-foreground">
                    {member.name}
                  </h3>
                  <p className="text-foreground/70">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default About;
