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
import { useState, useEffect } from "react";
import {
  PageTransition,
  AnimatedSection,
  StaggerContainer,
  StaggerItem,
  HoverScale,
} from "@/components/PageTransition";

const About = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial page load
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <PageTransition loading={isLoading}>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        {/* Company Introduction Section */}
        <AnimatedSection className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
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
            <HoverScale>
              <Button
                size="lg"
                className="gradient-tropical text-foreground font-bold text-lg px-8 py-6 shadow-tropical"
              >
                <Users className="w-6 h-6 mr-2" />
                Join Our Journey
              </Button>
            </HoverScale>
          </div>
        </AnimatedSection>

        {/* Our Story */}
        <AnimatedSection className="py-16 px-6" delay={0.2}>
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
                  Founded in 2016, Fresh Tropical Juices was born from a simple
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
                <HoverScale className="flex items-center gap-4">
                  <div className="text-4xl">🌴</div>
                  <div>
                    <h3 className="font-bold text-primary">100% Natural</h3>
                    <p className="text-sm text-foreground/70">
                      No artificial additives, ever
                    </p>
                  </div>
                </HoverScale>
              </div>
              <HoverScale>
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
              </HoverScale>
            </div>
          </div>
        </AnimatedSection>

        {/* Values */}
        <AnimatedSection className="py-16 px-6 bg-muted/30" delay={0.3}>
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-5xl font-bold mb-6 text-black dark:text-white">
                VALUES
              </h2>
              <p className="text-sm text-muted-foreground">
                The principles that guide everything we do
              </p>
            </div>
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <StaggerItem>
                <HoverScale>
                  <Card className="shadow-tropical border-0 h-full">
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
                </HoverScale>
              </StaggerItem>

              <StaggerItem>
                <HoverScale>
                  <Card className="shadow-tropical border-0 h-full">
                    <CardHeader className="text-center">
                      <Heart className="w-12 h-12 mx-auto text-secondary mb-4" />
                      <CardTitle className="text-xl text-secondary">
                        Wellness First
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-center text-base">
                        Every recipe is designed with your health in mind,
                        packed with vitamins, minerals, and natural energy to
                        fuel your best life.
                      </CardDescription>
                    </CardContent>
                  </Card>
                </HoverScale>
              </StaggerItem>

              <StaggerItem>
                <HoverScale>
                  <Card className="shadow-tropical border-0 h-full">
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
                </HoverScale>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </AnimatedSection>

        {/* Team */}
        <AnimatedSection className="py-16 px-6" delay={0.4}>
          <div className="container mx-auto max-w-6xl text-center">
            <div className="mb-16">
              <h2 className="text-5xl font-bold mb-6 text-black dark:text-white">
                TEAM
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Meet the passionate innovators behind Fresh Tropical Juices,
                dedicated to revolutionizing healthy living through AI-powered
                nutrition.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                {
                  name: "Code Sleep",
                  role: "Founder & CEO",
                  emoji: "👩‍💼",
                  bio: "Former nutrition researcher with 15+ years in the health industry. Passionate about making healthy living accessible to everyone.",
                  skills: [
                    "Leadership",
                    "Nutrition Science",
                    "Business Strategy",
                  ],
                },
                {
                  name: "Code Sleep",
                  role: "Head of AI",
                  emoji: "👨‍💻",
                  bio: "AI engineer and former tech lead at Star Digital. Specializes in machine learning algorithms for personalized nutrition recommendations.",
                  skills: [
                    "Machine Learning",
                    "Data Science",
                    "Algorithm Design",
                  ],
                },
                {
                  name: "Deep Seek AI",
                  role: "Nutrition Expert",
                  emoji: "👩‍⚕️",
                  bio: "Certified nutritionist and wellness coach. Ensures every recipe meets the highest standards for health and nutritional balance.",
                  skills: [
                    "Clinical Nutrition",
                    "Wellness Coaching",
                    "Recipe Development",
                  ],
                },
              ].map((member, index) => (
                <Card
                  key={index}
                  className="shadow-tropical border-0 hover:shadow-xl transition-all duration-300 hover:scale-105 group"
                >
                  <CardHeader className="text-center pb-4">
                    {/* Avatar with Gradient Border */}
                    <div className="relative mx-auto mb-6">
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary via-secondary to-accent p-1 shadow-lg">
                        <div className="w-full h-full rounded-full bg-card flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-300">
                          {member.emoji}
                        </div>
                      </div>
                      {/* Status Indicator */}
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-accent rounded-full border-4 border-background flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                      </div>
                    </div>

                    <CardTitle className="text-xl font-bold text-foreground mb-2">
                      {member.name}
                    </CardTitle>
                    <CardDescription className="text-primary font-semibold text-base mb-4">
                      {member.role}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-sm text-foreground/80 leading-relaxed">
                      {member.bio}
                    </p>

                    {/* Skills Tags */}
                    <div className="flex flex-wrap gap-2 justify-center">
                      {member.skills.map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="px-3 py-1 bg-gradient-to-r from-primary/20 to-secondary/20 text-xs font-medium rounded-full border border-primary/30 hover:border-primary/50 transition-colors"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Social Links Placeholder */}
                    <div className="flex justify-center gap-3 pt-4">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                        <span className="text-white text-xs font-bold">in</span>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-secondary to-accent flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                        <span className="text-white text-xs font-bold">@</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Join Team CTA */}
            <div className="mt-16 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-2xl p-8 border border-primary/20">
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Join Our Growing Team
              </h3>
              <p className="text-foreground/80 mb-6 max-w-2xl mx-auto">
                We're always looking for passionate individuals who share our
                vision of making healthy living accessible through innovative
                technology.
              </p>
              <Button className="gradient-tropical text-foreground font-bold px-8 py-3 hover:scale-105 transition-all duration-300 shadow-tropical">
                <Users className="w-5 h-5 mr-2" />
                View Open Positions
              </Button>
            </div>
          </div>
        </AnimatedSection>
      </div>
      <Footer />
    </PageTransition>
  );
};

export default About;
