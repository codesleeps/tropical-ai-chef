import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    // Set base path for GitHub Pages deployment
    base: mode === "production" ? "/tropical-ai-chef/" : "/",
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(
      Boolean
    ),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    envPrefix: "VITE_",
    preview: {
      port: 8080,
      host: true,
    },
    build: {
      // Ensure assets are referenced correctly
      assetsDir: "assets",
      rollupOptions: {
        output: {
          // Ensure consistent asset naming
          assetFileNames: "assets/[name]-[hash][extname]",
          chunkFileNames: "assets/[name]-[hash].js",
          entryFileNames: "assets/[name]-[hash].js",
        },
      },
    },
  };
});
