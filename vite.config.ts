import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),

    // Configuración PWA - Progressive Web App
    VitePWA({
      // Registrar el service worker automáticamente
      registerType: "autoUpdate",

      // Incluir assets del manifest automáticamente
      includeAssets: ["icon-zapetrol.svg", "favicon.ico"],

      // Configuración del manifest (metadatos de la app)
      manifest: {
        name: "Zapetrol - Gasolineras Baratas",
        short_name: "Zapetrol",
        description:
          "Encuentra las gasolineras más baratas cerca de ti con precios actualizados en tiempo real",
        theme_color: "#8a5fe8",
        background_color: "#1a1d29",
        display: "standalone",
        start_url: "/",
        scope: "/",
        orientation: "portrait-primary",
        icons: [
          {
            src: "/icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },

      // Configuración del service worker
      workbox: {
        // Cachear rutas de navegación
        navigateFallback: "/index.html",

        // Estrategia de caché para imágenes y assets
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.mapbox\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "mapbox-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 7 días
              },
            },
          },
          {
            urlPattern: /^https:\/\/.*\.tile\.openstreetmap\.org\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "osm-tiles-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 días
              },
            },
          },
        ],
      },
    }),
  ],
});
