import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/login": "http://localhost:3001",
      "/me": "http://localhost:3001",
      "/logout": "http://localhost:3001",
    },
  },
});
