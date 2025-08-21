import type { OrderStatus } from "@/interfaces/order.ts";

export function formatDate(value: any): string {
  const raw = value;
  const date = raw ? new Date(raw) : null;
  return date ? date.toLocaleString() : "";
}

export function formatCurrency(val?: number): string {
  if (typeof val !== "number") {
    return "";
  }
  return new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(val);
}

export interface ChipInfo {
  color: string;
  icon: string;
  text: string;
}

export function getOrderStatusMeta(status: OrderStatus): ChipInfo {
  switch (status) {
    case "pending":
      return { color: "secondary", icon: "mdi-timer-sand", text: "В ожидании" };
    case "processing":
      return { color: "secondary", icon: "mdi-cog-outline", text: "В обработке" };
    case "shipped":
      return { color: "primary", icon: "mdi-truck-fast-outline", text: "Отправлен" };
    case "delivered":
      return { color: "success", icon: "mdi-package-variant-closed-check", text: "Доставлен" };
    case "completed":
      return { color: "success", icon: "mdi-check-circle-outline", text: "Завершен" };
    case "cancelled":
      return { color: "error", icon: "mdi-cancel", text: "Отменен" };
    case "refunded":
      return { color: "secondary", icon: "mdi-cash-refund", text: "Возврат" };
    case "failed":
      return { color: "error", icon: "mdi-alert-circle-outline", text: "Ошибка" };
    case "unknown":
    default:
      return { color: "grey", icon: "mdi-help-circle-outline", text: "Неизвестно" };
  }
}
