import { useEffect, useRef } from "react";

interface ThreeBlenderProps {
  selectedFruits: string[];
  selectedVegetables: string[];
  isBlending: boolean;
  onBlendingComplete?: () => void;
}

const FRUIT_COLORS: Record<string, string> = {
  mango: "#ffa500",
  pineapple: "#ffd700",
  "passion-fruit": "#800080",
  "dragon-fruit": "#ff1493",
  papaya: "#ff4500",
  guava: "#ff69b4",
  kiwi: "#556b2f",
  banana: "#ffeb3b",
  blueberries: "#4169e1",
  pear: "#d2b48c",
  coconut: "#f5f5f5",
  spinach: "#228b22",
  kale: "#006400",
  cucumber: "#8fbc8f",
  celery: "#98fb98",
  carrot: "#ff8c00",
  beetroot: "#8b008b",
  ginger: "#f5deb3",
  turmeric: "#ffd700",
  mint: "#00ff7f",
};

interface Fruit3D {
  id: string;
  x: number;
  y: number; // Y is up
  z: number;
  vx: number;
  vy: number;
  vz: number;
  radius: number;
  color: string;
  angle: number;
  orbitRadius: number;
  rotX: number;
  rotY: number;
  rotSpeedX: number;
  rotSpeedY: number;
  bounceCount: number;
  scale: number;
  isDestroyed: boolean;
}

interface Particle3D {
  x: number;
  y: number;
  z: number;
  color: string;
  speed: number;
  angle: number;
}

export const ThreeBlender = ({
  selectedFruits,
  selectedVegetables,
  isBlending,
  onBlendingComplete,
}: ThreeBlenderProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fruitsRef = useRef<Fruit3D[]>([]);
  const particlesRef = useRef<Particle3D[]>([]);
  const isBlendingRef = useRef(isBlending);
  const fluidOpacityRef = useRef(0);
  const fluidHeightRef = useRef(0);
  const blendTimerRef = useRef(0);

  // Sync state
  useEffect(() => {
    isBlendingRef.current = isBlending;
    if (!isBlending) {
      blendTimerRef.current = 0;
    }
  }, [isBlending]);

  // Get combined selected item list
  const activeItems = [...selectedFruits, ...selectedVegetables];

  // Sync fruit objects
  useEffect(() => {
    // Keep track of active items in simulation
    const activeSet = new Set(activeItems);

    // Remove unselected fruits
    fruitsRef.current = fruitsRef.current.filter((f) => activeSet.has(f.id));

    // Add new fruits
    activeItems.forEach((id) => {
      const exists = fruitsRef.current.some((f) => f.id === id);
      if (!exists) {
        const color = FRUIT_COLORS[id] || "#ffaa00";
        const isBerry = id === "blueberries";
        const radius = isBerry ? 6 : 12;

        fruitsRef.current.push({
          id,
          x: (Math.random() - 0.5) * 20,
          y: 120 + Math.random() * 40,
          z: (Math.random() - 0.5) * 20,
          vx: (Math.random() - 0.5) * 2,
          vy: 0,
          vz: (Math.random() - 0.5) * 2,
          radius,
          color,
          angle: Math.random() * Math.PI * 2,
          orbitRadius: 15 + Math.random() * 20,
          rotX: Math.random() * Math.PI,
          rotY: Math.random() * Math.PI,
          rotSpeedX: (Math.random() - 0.5) * 0.1,
          rotSpeedY: (Math.random() - 0.5) * 0.1,
          bounceCount: 0,
          scale: 1,
          isDestroyed: false,
        });
      }
    });
  }, [selectedFruits, selectedVegetables]);

  // Main Render and Physics loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    // Viewport size
    const width = 300;
    const height = 350;
    canvas.width = width;
    canvas.height = height;

    const centerX = width / 2;
    const centerY = height / 2 + 30; // Shift down slightly

    // 3D projection parameters
    const fov = 250;
    const cameraZ = 200;

    // Fluid level properties
    let fluidColor = "#ffa500";

    // Setup initial particles
    const initParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < 40; i++) {
        particlesRef.current.push({
          x: (Math.random() - 0.5) * 50,
          y: -40 + Math.random() * 80,
          z: (Math.random() - 0.5) * 50,
          color: "rgba(255, 255, 255, 0.6)",
          speed: 0.1 + Math.random() * 0.15,
          angle: Math.random() * Math.PI * 2,
        });
      }
    };
    initParticles();

    // Get average color of selected items
    const updateFluidColor = () => {
      if (activeItems.length === 0) return;
      // Get colors
      const colors = activeItems.map((id) => FRUIT_COLORS[id] || "#ffbb00");

      // Simple hex blender
      let r = 0, g = 0, b = 0;
      colors.forEach((hex) => {
        const cleanHex = hex.replace("#", "");
        r += parseInt(cleanHex.substring(0, 2), 16);
        g += parseInt(cleanHex.substring(2, 4), 16);
        b += parseInt(cleanHex.substring(4, 6), 16);
      });
      r = Math.floor(r / colors.length);
      g = Math.floor(g / colors.length);
      b = Math.floor(b / colors.length);

      fluidColor = `rgb(${r}, ${g}, ${b})`;
    };

    let bladeAngle = 0;

    // Render loop
    const render = () => {
      updateFluidColor();
      ctx.clearRect(0, 0, width, height);

      const floorY = -50;
      const wallR = 40;
      const gravity = 0.6;
      const blending = isBlendingRef.current;

      // Update fluid height and opacity
      if (blending) {
        fluidOpacityRef.current = Math.min(0.7, fluidOpacityRef.current + 0.02);
        fluidHeightRef.current = Math.min(100, fluidHeightRef.current + 1.2);
        bladeAngle += 0.4;

        // Swirl particles
        particlesRef.current.forEach((p) => {
          p.angle += p.speed;
          const radius = Math.sqrt(p.x * p.x + p.z * p.z);
          // Vortex effect: swirl around Center and bob up
          p.x = Math.cos(p.angle) * radius;
          p.z = Math.sin(p.angle) * radius;
          p.y += 1.5;
          if (p.y > floorY + fluidHeightRef.current) {
            p.y = floorY - 5;
            p.x = (Math.random() - 0.5) * 30;
            p.z = (Math.random() - 0.5) * 30;
          }
          p.color = `rgba(255, 255, 255, ${0.2 + Math.random() * 0.4})`;
        });

        // Check if blending complete
        blendTimerRef.current += 1;
        if (blendTimerRef.current >= 100) {
          if (onBlendingComplete) {
            onBlendingComplete();
          }
        }
      } else {
        fluidOpacityRef.current = Math.max(0, fluidOpacityRef.current - 0.05);
        if (activeItems.length === 0) {
          fluidHeightRef.current = Math.max(0, fluidHeightRef.current - 5);
        }
        bladeAngle += 0.02; // Idle spin
      }

      // 1. Physics update for fruits
      fruitsRef.current.forEach((f) => {
        if (f.isDestroyed) return;

        if (blending) {
          f.angle += 0.15;
          f.orbitRadius = Math.max(2, f.orbitRadius - 0.4);
          f.x = Math.cos(f.angle) * f.orbitRadius;
          f.z = Math.sin(f.angle) * f.orbitRadius;
          f.y += (floorY + 20 + Math.sin(f.angle * 2.5) * 15 - f.y) * 0.08;

          // Shrink fruit
          if (f.scale > 0.05) {
            f.scale -= 0.015;
          } else {
            f.scale = 0;
            f.isDestroyed = true;
          }
        } else {
          // Normal physics drop
          f.vy -= gravity;
          f.y += f.vy;
          f.x += f.vx;
          f.z += f.vz;

          // Floor bounce
          if (f.y < floorY + f.radius) {
            f.y = floorY + f.radius;
            if (f.bounceCount < 4) {
              f.vy = -f.vy * 0.35;
              f.vx *= 0.6;
              f.vz *= 0.6;
              f.bounceCount++;
            } else {
              f.vy = 0;
              f.vx = 0;
              f.vz = 0;
            }
          }

          // Wall collision
          const dist = Math.sqrt(f.x * f.x + f.z * f.z);
          if (dist > wallR - f.radius) {
            const angle = Math.atan2(f.z, f.x);
            f.x = Math.cos(angle) * (wallR - f.radius);
            f.z = Math.sin(angle) * (wallR - f.radius);
            f.vx = -f.vx * 0.5;
            f.vz = -f.vz * 0.5;
          }
        }
      });

      // Filter out destroyed fruits
      fruitsRef.current = fruitsRef.current.filter((f) => !f.isDestroyed);

      // --- RENDERING PIPELINE (3D Projection + Painter's Algorithm) ---
      // We will render elements back-to-front (sorted by Z value)
      interface RenderItem {
        z: number;
        render: () => void;
      }

      const drawQueue: RenderItem[] = [];

      // A. Draw blender base (always background-ish but drawn at bottom)
      const drawBlenderBase = () => {
        // Draw dark grey base pedestal
        ctx.fillStyle = "#2d2d2d";
        ctx.strokeStyle = "#1a1a1a";
        ctx.lineWidth = 2;

        ctx.beginPath();
        // Top ellipse of base
        ctx.ellipse(centerX, centerY - floorY, 52, 10, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Base body
        ctx.beginPath();
        ctx.moveTo(centerX - 52, centerY - floorY);
        ctx.lineTo(centerX - 62, centerY - floorY + 40);
        ctx.lineTo(centerX + 62, centerY - floorY + 40);
        ctx.lineTo(centerX + 52, centerY - floorY);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Base bottom ellipse
        ctx.beginPath();
        ctx.ellipse(centerX, centerY - floorY + 40, 62, 12, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Metallic collar ring
        ctx.fillStyle = "#e0e0e0";
        ctx.beginPath();
        ctx.ellipse(centerX, centerY - floorY - 5, 45, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      };

      // Draw base first (bottom layer)
      drawBlenderBase();

      // B. Draw back half of pitcher glass
      drawQueue.push({
        z: 100, // Far Z
        render: () => {
          ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
          ctx.lineWidth = 1.5;
          ctx.fillStyle = "rgba(240, 248, 255, 0.05)";
          ctx.beginPath();
          ctx.ellipse(centerX, centerY - floorY, 44, 8, 0, 0, Math.PI, true); // back half of bottom
          ctx.lineTo(centerX - 48, centerY - floorY - 110);
          ctx.ellipse(centerX, centerY - floorY - 110, 48, 9, 0, Math.PI, 0, true); // back half of top
          ctx.lineTo(centerX + 44, centerY - floorY);
          ctx.fill();
          ctx.stroke();
        },
      });

      // C. Draw Blender Blades (at floorY)
      drawQueue.push({
        z: 0.1,
        render: () => {
          ctx.strokeStyle = "#8e8e93";
          ctx.lineWidth = 3;
          ctx.beginPath();
          // Draw metallic blades spinning
          const bl1x = Math.cos(bladeAngle) * 18;
          const bl1z = Math.sin(bladeAngle) * 6;
          const bl2x = Math.cos(bladeAngle + Math.PI / 2) * 18;
          const bl2z = Math.sin(bladeAngle + Math.PI / 2) * 6;

          // Projected coords
          ctx.moveTo(centerX - bl1x, centerY - floorY - bl1z);
          ctx.lineTo(centerX + bl1x, centerY - floorY + bl1z);
          ctx.moveTo(centerX - bl2x, centerY - floorY - bl2z);
          ctx.lineTo(centerX + bl2x, centerY - floorY + bl2z);
          ctx.stroke();

          // Center cap
          ctx.fillStyle = "#3a3a3c";
          ctx.beginPath();
          ctx.arc(centerX, centerY - floorY, 4, 0, Math.PI * 2);
          ctx.fill();
        },
      });

      // D. Fluid rendering (if active)
      if (fluidOpacityRef.current > 0) {
        drawQueue.push({
          z: 0,
          render: () => {
            const h = fluidHeightRef.current;
            ctx.fillStyle = fluidColor;
            ctx.globalAlpha = fluidOpacityRef.current;

            // Draw fluid cylinder
            ctx.beginPath();
            // Bottom ellipse of fluid
            ctx.ellipse(centerX, centerY - floorY, 43, 8, 0, 0, Math.PI * 2);
            ctx.fill();

            // Fluid body
            ctx.beginPath();
            ctx.moveTo(centerX - 43, centerY - floorY);
            // Calculate scale top radius
            const topRad = 43 + (h / 110) * 5;
            ctx.lineTo(centerX - topRad, centerY - floorY - h);
            ctx.lineTo(centerX + topRad, centerY - floorY - h);
            ctx.lineTo(centerX + 43, centerY - floorY);
            ctx.closePath();
            ctx.fill();

            // Top ellipse of fluid (surface)
            ctx.beginPath();
            ctx.ellipse(centerX, centerY - floorY - h, topRad, 8, 0, 0, Math.PI * 2);
            // Swirl pattern inside top surface
            ctx.fill();

            ctx.globalAlpha = 1.0;

            // Swirl ring overlay on surface
            ctx.strokeStyle = "rgba(255,255,255,0.4)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.ellipse(centerX, centerY - floorY - h, topRad * 0.7, 5, 0, bladeAngle * 1.5, bladeAngle * 1.5 + Math.PI);
            ctx.stroke();
          },
        });
      }

      // E. Draw Swirling Particles
      if (blending) {
        particlesRef.current.forEach((p) => {
          drawQueue.push({
            z: p.z,
            render: () => {
              // 3D projection
              const scale = fov / (p.z + cameraZ);
              const projX = p.x * scale + centerX;
              const projY = -p.y * scale + centerY;

              ctx.fillStyle = p.color;
              ctx.beginPath();
              ctx.arc(projX, projY, scale * 1.2, 0, Math.PI * 2);
              ctx.fill();
            },
          });
        });
      }

      // F. Draw Fruits
      fruitsRef.current.forEach((f) => {
        drawQueue.push({
          z: f.z,
          render: () => {
            // 3D projection
            const scale = fov / (f.z + cameraZ);
            const projX = f.x * scale + centerX;
            const projY = -f.y * scale + centerY;
            const projR = f.radius * scale * f.scale;

            if (projR <= 0) return;

            // Draw fruit with radial gradient shading for 3D look!
            const grad = ctx.createRadialGradient(
              projX - projR * 0.3,
              projY - projR * 0.3,
              projR * 0.1,
              projX,
              projY,
              projR
            );
            grad.addColorStop(0, "#ffffff");
            grad.addColorStop(0.2, f.color);
            // Dark shadow side
            grad.addColorStop(1, darkenHex(f.color, 0.4));

            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(projX, projY, projR, 0, Math.PI * 2);
            ctx.fill();

            // Specular reflection stroke
            ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
            ctx.lineWidth = 0.8;
            ctx.stroke();
          },
        });
      });

      // G. Front glass reflections & highlights
      drawQueue.push({
        z: -100, // Near Z
        render: () => {
          // Front glass outline
          ctx.strokeStyle = "rgba(255, 255, 255, 0.28)";
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.ellipse(centerX, centerY - floorY, 44, 8, 0, 0, Math.PI); // front half bottom
          ctx.lineTo(centerX - 48, centerY - floorY - 110);
          ctx.ellipse(centerX, centerY - floorY - 110, 48, 9, 0, Math.PI, 0); // front half top
          ctx.lineTo(centerX + 44, centerY - floorY);
          ctx.stroke();

          // Glass shine streak (reflective light)
          const gradShine = ctx.createLinearGradient(centerX - 35, 0, centerX - 10, 0);
          gradShine.addColorStop(0, "rgba(255, 255, 255, 0)");
          gradShine.addColorStop(0.5, "rgba(255, 255, 255, 0.15)");
          gradShine.addColorStop(1, "rgba(255, 255, 255, 0)");

          ctx.fillStyle = gradShine;
          ctx.beginPath();
          ctx.moveTo(centerX - 35, centerY - floorY - 109);
          ctx.lineTo(centerX - 32, centerY - floorY - 1);
          ctx.lineTo(centerX - 12, centerY - floorY - 1);
          ctx.lineTo(centerX - 15, centerY - floorY - 109);
          ctx.closePath();
          ctx.fill();

          // Black plastic lid
          ctx.fillStyle = "#1e1e1e";
          ctx.strokeStyle = "#000000";
          ctx.lineWidth = 1;

          ctx.beginPath();
          ctx.ellipse(centerX, centerY - floorY - 110, 49, 10, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          ctx.beginPath();
          ctx.ellipse(centerX, centerY - floorY - 115, 49, 10, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Connection of lid layers
          ctx.beginPath();
          ctx.moveTo(centerX - 49, centerY - floorY - 115);
          ctx.lineTo(centerX - 49, centerY - floorY - 110);
          ctx.lineTo(centerX + 49, centerY - floorY - 110);
          ctx.lineTo(centerX + 49, centerY - floorY - 115);
          ctx.fill();

          // Glass handle overlay
          ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
          ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
          ctx.lineWidth = 3;
          ctx.beginPath();
          // Draw handle shape
          ctx.ellipse(centerX + 45, centerY - floorY - 55, 12, 35, 0, -Math.PI / 2, Math.PI / 2);
          ctx.stroke();
        },
      });

      // Sort by Z and draw
      drawQueue.sort((a, b) => b.z - a.z);
      drawQueue.forEach((item) => item.render());

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [activeItems]);

  // Helper function to darken hex colors
  const darkenHex = (hex: string, percent: number) => {
    let r = 0, g = 0, b = 0;
    const cleanHex = hex.replace("#", "");

    r = parseInt(cleanHex.substring(0, 2), 16);
    g = parseInt(cleanHex.substring(2, 4), 16);
    b = parseInt(cleanHex.substring(4, 6), 16);

    r = Math.floor(r * (1 - percent));
    g = Math.floor(g * (1 - percent));
    b = Math.floor(b * (1 - percent));

    return `rgb(${r}, ${g}, ${b})`;
  };

  return (
    <div className="relative w-full h-[320px] md:h-[400px] flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-primary/5 to-secondary/5 border border-muted/50 backdrop-blur-sm shadow-inner">
      <canvas ref={canvasRef} className="w-full h-full max-w-[300px] max-h-[350px]" />
      <div className="absolute top-4 left-4 flex gap-1.5 items-center bg-black/20 px-2.5 py-1 rounded-full backdrop-blur-sm border border-white/10">
        <span className="relative flex h-2 w-2">
          <span className={`relative inline-flex rounded-full h-2 w-2 ${isBlending ? "bg-red-500 animate-pulse" : "bg-emerald-500"}`}></span>
        </span>
        <span className="text-[10px] tracking-wider uppercase font-semibold text-white/95 select-none">
          {isBlending ? "Blending 🌪️" : "3D Blender"}
        </span>
      </div>
      <div className="absolute bottom-4 right-4 pointer-events-none select-none text-[9px] text-foreground/40 font-mono">
        3D Projected Canvas
      </div>
    </div>
  );
};
