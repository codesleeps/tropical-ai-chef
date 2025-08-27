import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface LoginFormProps {
  onLoginSuccess: () => void;
}

export const LoginForm = ({ onLoginSuccess }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate validation (in real app, this would be API call)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email && password) {
      toast({
        title: "Welcome to Fresh Tropical Juices! 🥭",
        description: "You've successfully logged in.",
      });
      onLoginSuccess();
    } else {
      toast({
        title: "Login failed",
        description: "Please check your credentials.",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-tropical">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold bg-gradient-tropical bg-clip-text text-transparent">
          Welcome Back
        </CardTitle>
        <CardDescription>
          Sign in to create amazing tropical juice recipes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="transition-smooth focus:shadow-glow"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="transition-smooth focus:shadow-glow"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full gradient-tropical text-foreground font-semibold hover:scale-105 transition-bounce shadow-tropical"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};