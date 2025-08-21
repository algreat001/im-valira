import { ref, computed } from "vue";
import { defineStore } from "pinia";

import { getDashboardMetrics } from "@/backend/dashboard.service";

import type { DashboardMetrics } from "@/interfaces/dashboard";

type DataFormat = "currency" | "number" | "text";

type Tile = {
  title: string;
  value: number | string;
  icon: string;
  color: string;
  format: DataFormat;
};

const defaultMetrics: DashboardMetrics = {
  pendingOrdersCount: 0,
  unpaidOrdersCount: 0,
  unshippedOrdersCount: 0,
  cancelledOrdersThisMonth: 0,
  cancelledOrdersPrevMonth: 0,
  paymentsThisMonth: 0,
  paymentsPrevMonth: 0,
  productsCount: 0,
  categoriesCount: 0,
  usersCount: 0,
  newUsersThisMonth: 0,
  refundedOrdersThisMonth: 0,
  ordersThisMonth: 0,
  lowStockProductsCount: 0
};

export const useDashboardStore = defineStore("dashboard", () => {
  const metrics = ref<DashboardMetrics | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const tiles = computed<Tile[]>(() => {
    const m = metrics.value ?? defaultMetrics;
    return [
      {
        title: "Незавершенные заказы",
        value: m.pendingOrdersCount,
        icon: "mdi-timer-sand",
        color: "primary",
        format: "number"
      },
      {
        title: "Неоплаченные заказы",
        value: m.unpaidOrdersCount,
        icon: "mdi-cash-remove",
        color: "error",
        format: "number"
      },
      {
        title: "Неотгруженные заказы",
        value: m.unshippedOrdersCount,
        icon: "mdi-truck-delivery-outline",
        color: "warning",
        format: "number"
      },
      {
        title: "Отменено (текущий мес.)",
        value: m.cancelledOrdersThisMonth,
        icon: "mdi-cancel",
        color: "error",
        format: "number"
      },
      {
        title: "Отменено (прошлый мес.)",
        value: m.cancelledOrdersPrevMonth,
        icon: "mdi-cancel",
        color: "secondary",
        format: "number"
      },
      {
        title: "Оплата (текущий мес.)",
        value: m.paymentsThisMonth,
        icon: "mdi-cash",
        color: "success",
        format: "currency"
      },
      {
        title: "Оплата (прошлый мес.)",
        value: m.paymentsPrevMonth,
        icon: "mdi-cash",
        color: "secondary",
        format: "currency"
      },
      { title: "Товары", value: m.productsCount, icon: "mdi-tag-multiple", color: "primary", format: "number" },
      { title: "Категории", value: m.categoriesCount, icon: "mdi-shape-outline", color: "primary", format: "number" },
      { title: "Пользователи", value: m.usersCount, icon: "mdi-account-group", color: "primary", format: "number" },
      {
        title: "Новые пользователи (мес.)",
        value: m.newUsersThisMonth,
        icon: "mdi-account-plus",
        color: "primary",
        format: "number"
      },
      {
        title: "Возвраты (мес.)",
        value: m.refundedOrdersThisMonth,
        icon: "mdi-cash-refund",
        color: "warning",
        format: "number"
      },
      { title: "Заказы (мес.)", value: m.ordersThisMonth, icon: "mdi-receipt", color: "primary", format: "number" },
      {
        title: "Товаров с низким остатком",
        value: m.lowStockProductsCount,
        icon: "mdi-alarm-light-outline",
        color: "warning",
        format: "number"
      }
    ];
  });

  const groupedTiles = computed(() => {
    const t = tiles.value;
    const get = (title: string) => t.find((x) => x.title === title)!;
    return [
      {
        title: "Статус заказов",
        items: [ get("Незавершенные заказы"), get("Неоплаченные заказы"), get("Неотгруженные заказы") ]
      },
      {
        title: "Динамика и финансы",
        items: [
          get("Отменено (текущий мес.)"),
          get("Отменено (прошлый мес.)"),
          get("Оплата (текущий мес.)"),
          get("Оплата (прошлый мес.)"),
          get("Заказы (мес.)"),
          get("Возвраты (мес.)")
        ]
      },
      {
        title: "Каталог",
        items: [ get("Товары"), get("Категории"), get("Товаров с низким остатком") ]
      },
      {
        title: "Пользователи",
        items: [ get("Пользователи"), get("Новые пользователи (мес.)") ]
      }
    ];
  });

  async function load(): Promise<void> {
    loading.value = true;
    error.value = null;
    try {
      metrics.value = await getDashboardMetrics();
    } catch (e: any) {
      error.value = e?.message ?? "Не удалось загрузить метрики";
    } finally {
      loading.value = false;
    }
  }

  return {
    metrics,
    loading,
    error,
    tiles,
    groupedTiles,
    load
  };
});
