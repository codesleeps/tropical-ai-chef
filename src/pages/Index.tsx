import { TropicalHero } from '@/components/TropicalHero';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

const Index = () => {
  const handleGetStarted = () => {
    window.location.href = '/recipes';
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <TropicalHero onGetStarted={handleGetStarted} />
      <Footer />
    </div>
  );
};

export default Index;
