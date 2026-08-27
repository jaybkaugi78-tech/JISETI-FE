import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      registerType: "autoUpdate",

      includeAssets: [
        "favicon.png",
      ],

      manifest: {
        name: "Jiseti",
        short_name: "Jiseti",

        description:
          "Citizen reporting platform for corruption and public intervention.",

        theme_color: "#082f5f",
        background_color: "#082f5f",

        display: "standalone",

        start_url: "/",
        scope: "/",

        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },

      workbox: {
        globPatterns: [
          "**/*.{js,css,html,png,jpg,jpeg,svg,webp}",
        ],

        cleanupOutdatedCaches: true,
      },
    }),
  ],
});