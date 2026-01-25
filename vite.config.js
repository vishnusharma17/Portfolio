// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     port: 3000,
//     open: true
//   },
//   build: {
//     outDir: 'dist',
//     assetsDir: 'assets'
//   }
// })
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/Portfolio/",
  plugins: [react()],
  build: {
    outDir: "docs",
  },
});
