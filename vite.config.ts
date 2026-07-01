import { pluginUnused } from "@gatsbylabs/vite-plugin-unused";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";
import mkcert from "vite-plugin-mkcert";

const isVercel = process.env.VERCEL === "1";
const isDev = process.env.NODE_ENV === "development";

export default defineConfig({
  plugins: [
    react(),

    // Local HTTPS certificates only.
    ...(isDev && !isVercel ? [mkcert()] : []),

    // Disable on Vercel until compatibility is confirmed.
    ...(!isVercel ? [pluginUnused({})] : []),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  build: {
    rollupOptions: {
      plugins: isVercel ? [] : [visualizer({ open: true })],
      output: {
        advancedChunks: {
          groups: [
            {
              name: "leaflet",
              test: /node_modules[\\/](leaflet|react-leaflet)[\\/]/,
            },
          ],
        },
      },
    },
  },
});
