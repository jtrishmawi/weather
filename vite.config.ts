import { pluginUnused } from "@gatsbylabs/vite-plugin-unused";
import react from "@vitejs/plugin-react";
import path from "path";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";
import mkcert from "vite-plugin-mkcert";
const isVercel = process.env.VERCEL === "1";

export default defineConfig({
  plugins: [react(), mkcert(), pluginUnused({})],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      plugins: isVercel ? [] : [visualizer({ open: true })],
      output: {
        manualChunks: {
          leaflet: ["leaflet", "react-leaflet"],
          recharts: ["recharts"],
        },
      },
    },
  },
});
