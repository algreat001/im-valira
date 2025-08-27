import Components from "unplugin-vue-components/vite";
import Vue from "@vitejs/plugin-vue";
import Vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
import svgLoader from "vite-svg-loader";

import Fonts from "unplugin-fonts/vite";
import VueRouter from "unplugin-vue-router/vite";

import type { UserConfig } from "vite";
import { defineConfig, loadEnv } from "vite";
import { fileURLToPath, URL } from "node:url";
import fs from "node:fs";

export default defineConfig(({ mode }) => {
  const rootDir = fileURLToPath(new URL(".", import.meta.url));
  const env = loadEnv(mode, rootDir, "");
  const isDev = mode === "development";
  console.log("Vite is running in", mode, "mode");
  console.log("API prefix:", env.VITE_API_PREFIX);
  console.log("API host:", env.VITE_API_HOST);
  console.log("Version:", process.env.npm_package_version);

  // const apiHost = env.VITE_API_HOST || env.VITE_API_URL || ""; // хост может быть пустым => относительные запросы
  // const apiPrefix = env.VITE_API_PREFIX || "/api/v1";
  const base = env.VITE_PUBLIC_BASE || "/";

  return {
    base,
    build: { target: "esnext" },
    plugins: [
      VueRouter({ dts: "src/typed-router.d.ts" }),
      Vue({ template: { transformAssetUrls } }),
      Vuetify({
        autoImport: true,
        styles: { configFile: "src/styles/settings.scss" }
      }),
      Components({ dts: "src/components.d.ts" }),
      svgLoader(),
      Fonts({
        fontsource: {
          families: [ { name: "Roboto", weights: [ 100, 300, 400, 500, 700, 900 ], styles: [ "normal", "italic" ] } ]
        }
      })
    ],
    optimizeDeps: {
      exclude: [
        "vuetify",
        "vue-router",
        "unplugin-vue-router/runtime",
        "unplugin-vue-router/data-loaders",
        "unplugin-vue-router/data-loaders/basic"
      ]
    },
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version)
      // __API_PREFIX__: JSON.stringify(apiPrefix)
    },
    resolve: {
      alias: { "@": fileURLToPath(new URL("src", import.meta.url)) },
      extensions: [ ".js", ".json", ".jsx", ".mjs", ".ts", ".tsx", ".vue" ]
    },
    server: isDev ? {
      https: {
        key: fs.readFileSync("../../cert/localhost.key"),
        cert: fs.readFileSync("../../cert/localhost.crt")
      }
    } : {},
    css: {
      preprocessorOptions: {
        sass: { api: "modern-compiler" },
        scss: { api: "modern-compiler" }
      }
    }
  } as UserConfig;
});
