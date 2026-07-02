import { useState, useEffect } from "react";

export const AnimatedFruitIcon = () => {
  const [currentFruit, setCurrentFruit] = useState(0);
  const fruits = ["🥭", "🍍", "🥥", "🥝", "🫐", "🍓"];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFruit((prev) => (prev + 1) % fruits.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-6xl mb-4 transition-all duration-500 hover:scale-110 select-none animate-bounce">
      {fruits[currentFruit]}
    </div>
  );
};
