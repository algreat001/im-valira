import type { Category } from "@/stores/categories.ts";

export const constants = {
  ui: {
    productList: {
      width: 4,
      height: 5
    },
    imageHeight: 520,
    debounceDelay: 1000
  },
  catalog: {
    ALL: -1,
    sortOptions: [
      "По новизне",
      "Сначала дешевые",
      "Сначала дорогие",
      "По алфавиту"
    ],
    defaultCategory: { category_id: -1, name: "Все", meta: { icon: "", description: "" } } as Category
  },
  app: {
    name: "Valira-decor",
    copyright: "© 2025 Valira-decor. Все права защищены."
  }
};
export const PRODUCT_VARIANT_COLORS: Record<string, string> = {
  "Черный": "#000000",
  "Белый": "#ffffff",
  "Золотой": "#ffd700",
  "Синий": "#0000ff",
  "Красный": "#ff0000",
  "Зеленый": "#008000",
  "Серебристый": "#c0c0c0",
  "Розовый": "#ffc0cb"
};

export const BUTTON_SIZES = {
  standard: {
    height: "36px",
    width: "36px",
    iconSize: "24px"
  },
  small: {
    height: "28px",
    width: "28px",
    iconSize: "18px"
  },
  large: {
    height: "44px",
    width: "44px",
    iconSize: "32px"
  }
};

export const PRODUCT_VARIANT_SIZES = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL"
];

export const HASH_COLOR_PALETTE: string[] = [
  "#1abc9c", "#16a085", "#2ecc71", "#27ae60", "#3498db", "#2980b9", "#9b59b6", "#8e44ad",
  "#34495e", "#2c3e50", "#f1c40f", "#f39c12", "#e67e22", "#d35400", "#e74c3c", "#c0392b",
  "#ec407a", "#ad1457", "#26c6da", "#00838f", "#7e57c2", "#4527a0", "#66bb6a", "#2e7d32",
  "#ffa726", "#ef6c00", "#78909c", "#455a64", "#ff7043", "#5d4037", "#ab47bc", "#6d4c41"
];
