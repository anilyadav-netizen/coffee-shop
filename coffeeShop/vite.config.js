import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      "/api": {
        target: "http://food.go-drop.in", // backend port
        changeOrigin: true,
        secure: false,
      },
    },
  },
});