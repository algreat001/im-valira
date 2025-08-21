// Плагин для инициализации Vuetify с кастомной палитрой
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { aliases, mdi } from "vuetify/iconsets/mdi";

import { palette } from "../palette";

import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles/main.sass";


const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: "light",
    themes: {
      light: {
        colors: {
          primary: palette.primary,
          secondary: palette.secondary,
          accent: palette.accent,
          error: palette.error,
          info: palette.info,
          success: palette.success,
          warning: palette.warning,
          background: palette.background,
          surface: palette.surface
        },
        variables: {
          "border-color": palette.border,
          "text-color": palette.text,
          "muted-color": palette.muted
        }
      }
    }
  },
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: { mdi }
  }
});

export default vuetify;

