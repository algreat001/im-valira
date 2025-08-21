import { defineStore } from "pinia";
import { computed, ref, type Ref } from "vue";
import { fetchOrderItems, fetchOrders, cancelOrder as cancelOrderApi } from "@/backend/order.service";
import type { OrderDto, OrderItemDto } from "@/interfaces/order.ts";

export type Order = OrderDto;

export type OrderItem = OrderItemDto

export const useOrderStore = defineStore("order", () => {
  const ordersMap: Ref<Map<number, Order>> = ref(new Map());

  // Текущие позиции выбранного заказа
  const currentPositions = ref<OrderItem[]>([]);

  // Состояния
  const loading = ref(false);
  const loadingPositions = ref(false);
  const error = ref<string | null>(null);

  // Представления
  const ordersArray = computed<Order[]>(() => {
    return Array.from(ordersMap.value.values()).sort((a, b) => {
      return (new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    });
  });

  // Получить заказ из мапы
  function getOrder(key: number): Order | undefined {
    return ordersMap.value.get(key);
  }

  // Загрузка заказов (mode: "completed" | "active" | undefined)
  async function loadOrders(mode: "completed" | "active") {
    loading.value = true;
    error.value = null;
    try {
      const list = await fetchOrders(mode);
      ordersMap.value.clear();
      for (const o of list) {
        ordersMap.value.set(o.order_id, o);
      }
    } catch (e: any) {
      error.value = e?.message || "Не удалось загрузить заказы";
      throw e;
    } finally {
      loading.value = false;
    }
  }

  // Загрузка позиций заказа и помещение в currentPositions
  async function loadOrderItems(orderId: undefined | number) {
    if (!orderId) {
      currentPositions.value = [];
      return;
    }
    loadingPositions.value = true;
    error.value = null;
    try {
      currentPositions.value = await fetchOrderItems(orderId);
    } catch (e: any) {
      error.value = e?.message || "Не удалось загрузить позиции заказа";
      currentPositions.value = [];
      throw e;
    } finally {
      loadingPositions.value = false;
    }
  }

  // Отмена заказа
  async function cancelOrder(orderId: number) {
    loading.value = true;
    error.value = null;
    try {
      const updated = await cancelOrderApi(orderId);
      if (updated && typeof updated.order_id === "number") {
        ordersMap.value.set(updated.order_id, updated);
      }
      return updated;
    } catch (e: any) {
      error.value = e?.message || "Не удалось отменить заказ";
      throw e;
    } finally {
      loading.value = false;
    }
  }

  return {
    ordersMap,
    currentPositions,
    loading,
    loadingPositions,
    error,
    ordersArray,
    loadOrderItems,
    loadOrders,
    getOrder,
    cancelOrder
  };
});
