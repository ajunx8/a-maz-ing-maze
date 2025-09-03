/// <reference types="vitest/config" />
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(() => {
  const isVitest = process.env.VITEST === "true";

  return {
    plugins: [
      tailwindcss(),
      !isVitest && reactRouter(),
      tsconfigPaths(),
    ].filter(Boolean),
    test: {
      environment: 'happy-dom',
      globals: true,
      setupFiles: ['app/test/setup.ts'],
    },
  };
});
