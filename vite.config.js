import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Local/dev: "/" so http://localhost:5173 works
// Build/live (GitHub Pages): "/Portfolio/"
export default defineConfig(({ command }) => {
  const isBuild = command === "build";
  const base = process.env.VITE_BASE || (isBuild ? "/Portfolio/" : "/");

  return {
    base,
    plugins: [react()],
    build: {
      outDir: "docs",
      emptyOutDir: true,
    },
    server: {
      port: 5173,
      proxy: {
        "/api": {
          target: "http://localhost:4000",
          changeOrigin: true,
          // Do not crash the page when API is offline
          configure: (proxy) => {
            proxy.on("error", (_err, _req, res) => {
              if (res && !res.headersSent) {
                res.writeHead(502, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "API offline" }));
              }
            });
          },
        },
        "/uploads": {
          target: "http://localhost:4000",
          changeOrigin: true,
        },
      },
    },
    preview: {
      port: 4173,
      // Preview the GitHub Pages build with the same base
      proxy: {
        "/api": {
          target: "http://localhost:4000",
          changeOrigin: true,
        },
      },
    },
  };
});
