import Components from "unplugin-vue-components/vite";
import Vue from "@vitejs/plugin-vue";
import Vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
import svgLoader from "vite-svg-loader";

import Fonts from "unplugin-fonts/vite";
import VueRouter from "unplugin-vue-router/vite";

import type { UserConfig } from "vite";
import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";
import fs from "node:fs";

export default defineConfig((config: UserConfig) => {
  const isDev = config.mode === "development";
  if (isDev) {
    console.log("Vite is running in development mode");
  }
  return {
    plugins: [
      VueRouter({
        dts: "src/typed-router.d.ts"
      }),
      Vue({
        template: { transformAssetUrls }
      }),
      // https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin#readme
      Vuetify({
        autoImport: true,
        styles: {
          configFile: "src/styles/settings.scss"
        }
      }),
      Components({
        dts: "src/components.d.ts"
      }),
      svgLoader(),
      Fonts({
        fontsource: {
          families: [
            {
              name: "Roboto",
              weights: [ 100, 300, 400, 500, 700, 900 ],
              styles: [ "normal", "italic" ]
            }
          ]
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
    define: { "process.env": {} },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("src", import.meta.url))
      },
      extensions: [
        ".js",
        ".json",
        ".jsx",
        ".mjs",
        ".ts",
        ".tsx",
        ".vue"
      ]
    },
    server: isDev ? {
      https: {
        key: fs.readFileSync("../../cert/localhost.key"),
        cert: fs.readFileSync("../../cert/localhost.crt")
      }
    } : {},

    css: {
      preprocessorOptions: {
        sass: {
          api: "modern-compiler"
        },
        scss: {
          api: "modern-compiler"
        }
      }
    }
  } as UserConfig;
});
