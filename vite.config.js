import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { viteSingleFile } from "vite-plugin-singlefile";

// base "./" + HashRouter + single-file bundle = dist/index.html opens straight from disk
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss(), viteSingleFile()],
});
