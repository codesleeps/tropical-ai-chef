import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Heart } from 'lucide-react';

interface RecipeDisplayProps {
  recipe: string;
}

export const RecipeDisplay = ({ recipe }: RecipeDisplayProps) => {
  if (!recipe) return null;

  const formatRecipe = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim());
    
    return lines.map((line, index) => {
      if (line.startsWith('# ')) {
        return (
          <h1 key={index} className="text-4xl font-bold mb-6 bg-gradient-tropical bg-clip-text text-transparent text-center">
            {line.replace('# ', '')}
          </h1>
        );
      } else if (line.startsWith('## ')) {
        return (
          <h2 key={index} className="text-2xl font-bold mt-8 mb-4 text-secondary flex items-center gap-2">
            {line.replace('## ', '')}
            {line.includes('Ingredients') && <Heart className="w-6 h-6" />}
            {line.includes('Instructions') && <Clock className="w-6 h-6" />}
            {line.includes('Benefits') && <Users className="w-6 h-6" />}
          </h2>
        );
      } else if (line.startsWith('- ')) {
        return (
          <li key={index} className="text-lg mb-2 ml-4">
            {line.replace('- ', '')}
          </li>
        );
      } else if (line.match(/^\d+\./)) {
        return (
          <li key={index} className="text-lg mb-2 ml-4">
            {line}
          </li>
        );
      } else if (line.startsWith('*') && line.endsWith('*')) {
        return (
          <p key={index} className="text-center text-lg font-semibold mt-6 italic bg-gradient-fresh bg-clip-text text-transparent">
            {line.replace(/\*/g, '')}
          </p>
        );
      } else if (line.trim()) {
        return (
          <p key={index} className="text-lg mb-3 leading-relaxed">
            {line}
          </p>
        );
      }
      return null;
    });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto mt-8 shadow-tropical border-0 bg-gradient-to-br from-card to-muted/20">
      <CardContent className="p-8">
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
            Fresh & Natural
          </Badge>
          <Badge variant="outline" className="border-accent text-accent">
            Tropical Paradise
          </Badge>
          <Badge variant="outline" className="border-primary text-primary">
            Ready in 5 mins
          </Badge>
        </div>
        
        <div className="prose prose-lg max-w-none">
          {formatRecipe(recipe)}
        </div>
      </CardContent>
    </Card>
  );
};