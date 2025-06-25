import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  base: "/Celestique/",
  plugins: [react(), tailwindcss()],

  build: {
    outDir: "dist",
    sourcemap: true, // Abilita le sourcemap
    minify: false,
  },
});
