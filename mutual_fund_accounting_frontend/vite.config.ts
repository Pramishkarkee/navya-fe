import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

import { resolve } from "path";

const root = resolve(__dirname, "src");

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  let config = {
    plugins: [react()],
    server: {
      // host : '0.0.0.0',
      port: 4000,
      open: true,
    },
    resolve: {
      alias: {
        components: resolve(root, "components"),
        constants: resolve(root, "constants"),
        layout: resolve(root, "layout"),
        pages: resolve(root, "pages"),
        routes: resolve(root, "routes"),
        store: resolve(root, "store"),
        services: resolve(root, "services"),
        utils: resolve(root, "utils"),
        config: resolve(root, "config"),
      },
    },
  };

  if (command === "serve") {
    config = {
      ...config,
    };
  } else {
    // command === 'build'

    config = {
      ...config,
      // base: '/static/dist/'
    };
  }

  return config;
});
