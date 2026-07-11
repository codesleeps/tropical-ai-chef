import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, Heart, Download, Sparkles, CheckCircle2, Bookmark } from "lucide-react";
import { toast } from "sonner";
import * as THREE from "three";

interface RecipeDisplayProps {
  recipe: string;
}

interface ThreeDProgressDialProps {
  score: number;
  label: string;
  emoji: string;
  color: string;
  glowColor: string;
}

const ThreeDProgressDial = ({ score, label, emoji, color, glowColor }: ThreeDProgressDialProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = 100;
    const height = 100;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 4.5;

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      preserveDrawingBuffer: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(2, 3, 4);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(new THREE.Color(glowColor), 1.5, 10);
    pointLight.position.set(0, 0, 2);
    scene.add(pointLight);

    const dialGroup = new THREE.Group();
    scene.add(dialGroup);

    // Background track torus
    const bgGeometry = new THREE.TorusGeometry(1.3, 0.15, 16, 100);
    const bgMaterial = new THREE.MeshStandardMaterial({
      color: 0x3a3a3c,
      roughness: 0.8,
      metalness: 0.1,
      transparent: true,
      opacity: 0.15
    });
    const bgMesh = new THREE.Mesh(bgGeometry, bgMaterial);
    dialGroup.add(bgMesh);

    // Progress torus geometry
    const targetArc = (score / 100) * Math.PI * 2;
    const activeColor = new THREE.Color(color);
    const progressMaterial = new THREE.MeshStandardMaterial({
      color: activeColor,
      roughness: 0.2,
      metalness: 0.8,
      emissive: new THREE.Color(glowColor),
      emissiveIntensity: 0.35,
    });

    let progressMesh: THREE.Mesh | null = null;
    let currentArc = 0;

    let isHovered = false;
    const onMouseEnter = () => { isHovered = true; };
    const onMouseLeave = () => { isHovered = false; };
    
    const container = containerRef.current;
    container.addEventListener("mouseenter", onMouseEnter);
    container.addEventListener("mouseleave", onMouseLeave);

    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (currentArc < targetArc) {
        currentArc = Math.min(targetArc, currentArc + (targetArc - currentArc) * 0.08 + 0.005);
        
        if (progressMesh) {
          dialGroup.remove(progressMesh);
          progressMesh.geometry.dispose();
        }
        
        const progressGeometry = new THREE.TorusGeometry(1.3, 0.18, 16, 100, currentArc);
        progressMesh = new THREE.Mesh(progressGeometry, progressMaterial);
        progressMesh.rotation.set(0, 0, Math.PI / 2);
        progressMesh.scale.set(1, -1, 1); // Clockwise rotation
        dialGroup.add(progressMesh);
      }

      const elapsedTime = clock.getElapsedTime();
      if (isHovered) {
        dialGroup.rotation.y = Math.sin(elapsedTime * 4) * 0.2;
        dialGroup.rotation.x = Math.cos(elapsedTime * 4) * 0.2;
        progressMaterial.emissiveIntensity = 0.65 + Math.sin(elapsedTime * 8) * 0.15;
      } else {
        dialGroup.rotation.y += (0 - dialGroup.rotation.y) * 0.1;
        dialGroup.rotation.x += (0 - dialGroup.rotation.x) * 0.1;
        progressMaterial.emissiveIntensity = 0.35;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener("mouseenter", onMouseEnter);
      container.removeEventListener("mouseleave", onMouseLeave);
      
      bgGeometry.dispose();
      bgMaterial.dispose();
      if (progressMesh) {
        progressMesh.geometry.dispose();
      }
      progressMaterial.dispose();
      
      if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [score, color, glowColor]);

  return (
    <div className="flex flex-col items-center select-none group relative">
      <div 
        ref={containerRef} 
        className="w-[100px] h-[100px] relative cursor-pointer"
        data-3d-dial-score={score}
        data-3d-dial-label={label}
      />
      <div className="absolute top-[34px] flex flex-col items-center justify-center pointer-events-none">
        <span className="text-lg font-black text-foreground tracking-tight group-hover:scale-110 transition-transform">{score}%</span>
      </div>
      <div className="text-center mt-1.5 space-y-0.5">
        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-center gap-1">
          <span>{emoji}</span>
          <span>{label}</span>
        </div>
      </div>
    </div>
  );
};

export const RecipeDisplay = ({ recipe }: RecipeDisplayProps) => {
  const [isSaved, setIsSaved] = useState(false);
  if (!recipe) return null;

  // --- PARSE MARKDOWN RECIPE ---
  const lines = recipe.split("\n");
  let title = "Tropical Paradise Juice";
  let ingredients: string[] = [];
  let instructions: string[] = [];
  let benefits: string[] = [];
  let tips: string[] = [];
  let prepTime = "5 mins";
  let servings = "2 servings";
  let modelInfo = "";

  let currentSection = "";
  lines.forEach((line) => {
    const l = line.trim();
    if (l.startsWith("# ")) {
      title = l.replace("# ", "").replace(" 🥤", "").replace(" 🍹", "").trim();
    } else if (l.startsWith("## ")) {
      currentSection = l.replace("## ", "").replace(":", "").toLowerCase().trim();
    } else if (l.startsWith("- ")) {
      const val = l.replace("- ", "");
      if (currentSection.includes("ingredients")) {
        ingredients.push(val);
      } else if (currentSection.includes("benefits") || currentSection.includes("nutritional")) {
        benefits.push(val);
      } else if (currentSection.includes("tips")) {
        tips.push(val);
      }
    } else if (l.match(/^\d+\./)) {
      instructions.push(l.replace(/^\d+\.\s*/, ""));
    } else if (l.includes("Prep Time:")) {
      prepTime = l.split(":")[1]?.trim() || "5 mins";
    } else if (l.includes("Servings:")) {
      servings = l.split(":")[1]?.trim() || "2 servings";
    } else if (l.startsWith("*Generated with") || l.startsWith("Generated with")) {
      modelInfo = l.replace(/\*/g, "").trim();
    }
  });

  // Fallback: If parsing fails, use standard markdown representation
  const renderFallback = () => {
    const markdownLines = recipe.split("\n").filter((line) => line.trim());
    return markdownLines.map((line, index) => {
      if (line.startsWith("# ")) return null; // title drawn custom
      if (line.startsWith("## ")) {
        return (
          <h2 key={index} className="text-xl font-bold mt-6 mb-3 text-secondary">
            {line.replace("## ", "")}
          </h2>
        );
      }
      if (line.startsWith("- ")) {
        return (
          <li key={index} className="text-sm mb-1 ml-4 list-disc text-foreground/80">
            {line.replace("- ", "")}
          </li>
        );
      }
      return (
        <p key={index} className="text-sm mb-2 text-foreground/80 leading-relaxed">
          {line}
        </p>
      );
    });
  };

  // --- HEALTH SCORE CALCULATION ---
  const calculateScores = () => {
    let hydration = 75;
    let immunity = 70;
    let energy = 65;
    let detox = 60;

    const lowerRecipe = recipe.toLowerCase();

    // Hydration triggers
    if (lowerRecipe.includes("coconut water") || lowerRecipe.includes("watermelon") || lowerRecipe.includes("cucumber")) {
      hydration = 95;
    } else if (lowerRecipe.includes("orange juice") || lowerRecipe.includes("water") || lowerRecipe.includes("hydrate")) {
      hydration = 85;
    }

    // Immunity triggers
    if (lowerRecipe.includes("ginger") || lowerRecipe.includes("lemon") || lowerRecipe.includes("lime") || lowerRecipe.includes("kiwi") || lowerRecipe.includes("immune")) {
      immunity = 95;
    } else if (lowerRecipe.includes("orange") || lowerRecipe.includes("turmeric") || lowerRecipe.includes("pineapple")) {
      immunity = 88;
    }

    // Energy triggers
    if (lowerRecipe.includes("banana") || lowerRecipe.includes("protein") || lowerRecipe.includes("honey") || lowerRecipe.includes("energy")) {
      energy = 90;
    } else if (lowerRecipe.includes("mango") || lowerRecipe.includes("passion fruit") || lowerRecipe.includes("chia")) {
      energy = 82;
    }

    // Detox triggers
    if (lowerRecipe.includes("kale") || lowerRecipe.includes("spinach") || lowerRecipe.includes("celery") || lowerRecipe.includes("detox") || lowerRecipe.includes("beetroot")) {
      detox = 95;
    } else if (lowerRecipe.includes("mint") || lowerRecipe.includes("cucumber")) {
      detox = 85;
    }
    return { hydration, immunity, energy, detox };
  };

  const scores = calculateScores();

  const handleExportRecipe = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 850;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const grad = ctx.createLinearGradient(0, 0, 0, 850);
    grad.addColorStop(0, "#ffa07a");
    grad.addColorStop(0.5, "#ff7f50");
    grad.addColorStop(1, "#ff4500");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 600, 850);

    ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
    ctx.lineWidth = 15;
    ctx.strokeRect(20, 20, 560, 810);

    ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(40, 40, 520, 770, 16);
      ctx.fill();
    } else {
      ctx.fillRect(40, 40, 520, 770);
    }

    ctx.fillStyle = "#ff5a36";
    ctx.font = "bold 24px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("🌴 TROPICAL AI CHEF 🌴", 300, 90);

    ctx.fillStyle = "#1c1c1e";
    ctx.font = "bold 22px sans-serif";
    const textTitle = title.toUpperCase();
    if (textTitle.length > 25) {
      ctx.font = "bold 17px sans-serif";
    }
    ctx.fillText(textTitle, 300, 130);

    ctx.fillStyle = "#8e8e93";
    ctx.font = "14px sans-serif";
    ctx.fillText(`⏱️ Prep: ${prepTime}    •    👥 Servings: ${servings}`, 300, 158);

    ctx.strokeStyle = "#e5e5ea";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(70, 178);
    ctx.lineTo(530, 178);
    ctx.stroke();

    ctx.fillStyle = "#e05300";
    ctx.font = "bold 15px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("INGREDIENTS:", 70, 205);

    ctx.fillStyle = "#3a3a3c";
    ctx.font = "14px sans-serif";
    let startY = 228;
    ingredients.slice(0, 6).forEach((ing) => {
      ctx.fillText(`•  ${ing.length > 52 ? ing.substring(0, 49) + "..." : ing}`, 70, startY);
      startY += 22;
    });

    ctx.fillStyle = "#e05300";
    ctx.font = "bold 15px sans-serif";
    ctx.fillText("INSTRUCTIONS:", 70, startY + 12);
    startY += 35;

    ctx.fillStyle = "#3a3a3c";
    ctx.font = "14px sans-serif";
    instructions.slice(0, 3).forEach((inst, index) => {
      const stepText = `${index + 1}. ${inst}`;
      if (stepText.length > 55) {
        ctx.fillText(stepText.substring(0, 55), 70, startY);
        ctx.fillText(stepText.substring(55), 88, startY + 18);
        startY += 36;
      } else {
        ctx.fillText(stepText, 70, startY);
        startY += 22;
      }
    });

    ctx.fillStyle = "#e05300";
    ctx.font = "bold 15px sans-serif";
    ctx.fillText("NUTRITIONAL VITALITY STATUS:", 70, 580);

    const dialContainers = document.querySelectorAll("[data-3d-dial-score]");
    let dialX = 56;
    dialContainers.forEach((container) => {
      const scoreVal = container.getAttribute("data-3d-dial-score") || "0";
      const labelVal = container.getAttribute("data-3d-dial-label") || "";
      const dialCanvas = container.querySelector("canvas");

      if (dialCanvas) {
        ctx.drawImage(dialCanvas, dialX, 605, 80, 80);
      }

      ctx.fillStyle = "#1c1c1e";
      ctx.font = "bold 13px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`${scoreVal}%`, dialX + 40, 649);

      ctx.fillStyle = "#8e8e93";
      ctx.font = "bold 10px sans-serif";
      ctx.fillText(labelVal.toUpperCase(), dialX + 40, 698);

      dialX += 80 + 56;
    });

    ctx.fillStyle = "#8e8e93";
    ctx.font = "italic 11px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Generated client-side via Tropical AI Chef app 🥤", 300, 785);

    const link = document.createElement("a");
    link.download = `tropical-recipe-${title.toLowerCase().replace(/\s+/g, "-")}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    toast.success("Downloaded beautiful recipe card PNG! 📸🌴");
  };

  const handleLocalSave = () => {
    try {
      const saved = JSON.parse(localStorage.getItem("tropical_saved_recipes") || "[]");
      const alreadySaved = saved.some((r: any) => r.title === title);
      if (alreadySaved) {
        toast.info("Recipe is already saved in your chest!");
        return;
      }
      saved.push({ title, ingredients, instructions, tips, benefits, prepTime, servings, date: new Date().toISOString() });
      localStorage.setItem("tropical_saved_recipes", JSON.stringify(saved));
      setIsSaved(true);
      toast.success("Saved recipe to your local chest! 💾🦜");
    } catch (e) {
      console.error(e);
      toast.error("Failed to save recipe locally.");
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto mt-8 shadow-tropical border-0 bg-gradient-to-br from-card to-muted/20 relative overflow-hidden">
      {/* Decorative background blurs */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full filter blur-3xl pointer-events-none" />

      <CardContent className="p-6 md:p-8">
        {/* Actions header line */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-muted">
          <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 flex gap-1 items-center px-3 py-1">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            AI Masterpiece
          </Badge>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 rounded-full text-xs flex gap-1 items-center hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
              onClick={handleLocalSave}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? "fill-red-500 text-red-500" : ""}`} />
              {isSaved ? "Saved" : "Save Recipe"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 rounded-full text-xs flex gap-1 items-center hover:bg-primary/10 hover:text-primary transition-colors"
              onClick={handleExportRecipe}
            >
              <Download className="w-3.5 h-3.5" />
              Export Card
            </Button>
          </div>
        </div>

        {/* Recipe Title */}
        <h1 className="text-3xl md:text-5xl font-extrabold mb-4 gradient-tropical bg-clip-text text-transparent text-center tracking-tight">
          {title} 🥤
        </h1>

        {/* Recipe Subtitles/badges */}
        <div className="flex flex-wrap gap-2.5 mb-8 justify-center">
          <Badge variant="secondary" className="bg-secondary/10 text-secondary border border-secondary/20 flex gap-1 items-center">
            <Clock className="w-3.5 h-3.5" />
            {prepTime}
          </Badge>
          <Badge variant="secondary" className="bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 flex gap-1 items-center">
            <Users className="w-3.5 h-3.5" />
            {servings}
          </Badge>
          {modelInfo && (
            <Badge variant="outline" className="text-muted-foreground border-muted-foreground/30 font-mono text-[10px]">
              {modelInfo}
            </Badge>
          )}
        </div>

        {/* Main Content Grid */}
        {ingredients.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Left side: Ingredients & Health Dashboard */}
            <div className="md:col-span-5 space-y-6">
              {/* Ingredients card */}
              <div className="bg-background/40 border border-muted p-5 rounded-2xl backdrop-blur-sm">
                <h3 className="text-lg font-bold mb-4 text-foreground flex items-center gap-2 border-b pb-2 border-muted">
                  <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                  Ingredients
                </h3>
                <ul className="space-y-3">
                  {ingredients.map((item, idx) => (
                    <li key={idx} className="flex gap-2.5 items-start text-foreground/80 text-sm md:text-base leading-snug">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Visual Nutrition Dashboard */}
              <div className="bg-background/40 border border-muted p-5 rounded-2xl backdrop-blur-sm">
                <h3 className="text-lg font-bold mb-4 text-foreground flex items-center gap-2 border-b pb-2 border-muted">
                  <Sparkles className="w-5 h-5 text-secondary" />
                  Visual Health Dashboard
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 justify-items-center">
                  <ThreeDProgressDial score={scores.hydration} label="Hydration" emoji="💧" color="#06b6d4" glowColor="#0891b2" />
                  <ThreeDProgressDial score={scores.immunity} label="Immunity" emoji="🛡️" color="#10b981" glowColor="#059669" />
                  <ThreeDProgressDial score={scores.energy} label="Energy" emoji="⚡" color="#f59e0b" glowColor="#d97706" />
                  <ThreeDProgressDial score={scores.detox} label="Detox" emoji="🌿" color="#8b5cf6" glowColor="#7c3aed" />
                </div>
                <p className="text-[10px] text-muted-foreground mt-3 text-center">
                  Interactive 3D dials. Hover to tilt and increase glow intensity.
                </p>
              </div>
            </div>

            {/* Right side: Instructions, Benefits & Tips */}
            <div className="md:col-span-7 space-y-6">
              {/* Instructions */}
              <div className="bg-background/40 border border-muted p-5 rounded-2xl backdrop-blur-sm">
                <h3 className="text-lg font-bold mb-4 text-foreground flex items-center gap-2 border-b pb-2 border-muted">
                  <Clock className="w-5 h-5 text-secondary" />
                  Instructions
                </h3>
                <ol className="space-y-4">
                  {instructions.map((step, idx) => (
                    <li key={idx} className="flex gap-3 items-start">
                      <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-foreground/80 text-sm md:text-base leading-relaxed">{step}</p>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Tips & Nutritional info */}
              {(benefits.length > 0 || tips.length > 0) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {benefits.length > 0 && (
                    <div className="bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-xl">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2 flex items-center gap-1.5">
                        🛡️ Health Benefits
                      </h4>
                      <ul className="space-y-1.5 text-xs text-foreground/80 pl-2">
                        {benefits.slice(0, 4).map((b, i) => (
                          <li key={i} className="list-disc leading-snug">{b}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {tips.length > 0 && (
                    <div className="bg-primary/5 border border-primary/10 p-4 rounded-xl">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-primary mb-2 flex items-center gap-1.5">
                        💡 Chef's Tips
                      </h4>
                      <ul className="space-y-1.5 text-xs text-foreground/80 pl-2">
                        {tips.slice(0, 4).map((t, i) => (
                          <li key={i} className="list-disc leading-snug">{t}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="prose prose-lg max-w-none">
            {renderFallback()}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
export default RecipeDisplay;