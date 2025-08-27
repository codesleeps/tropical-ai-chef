import { TropicalHero } from '@/components/TropicalHero';
import { Navigation } from '@/components/Navigation';

const Index = () => {
  const handleGetStarted = () => {
    window.location.href = '/recipes';
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <TropicalHero onGetStarted={handleGetStarted} />
    </div>
  );
};

export default Index;
