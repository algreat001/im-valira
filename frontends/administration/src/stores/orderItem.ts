import { ref } from "vue";
import { defineStore } from "pinia";

import { createOrderItem, deleteOrderItem, listOrderItems, updateOrderItem } from "@/backend/orderItems.service";

import type { OrderItemDto } from "@/interfaces/order";

export const useOrderItemStore = defineStore("orderItem", () => {
  const itemsByOrder = ref<Record<string, OrderItemDto[]>>({});
  const loading = ref(false);
  const error = ref<string | null>(null);

  function key(orderId: number | string): string {
    return String(orderId);
  }

  function getItems(orderId: number | string): OrderItemDto[] {
    return itemsByOrder.value[key(orderId)] ?? [];
  }

  async function load(orderId: number | string): Promise<void> {
    loading.value = true;
    error.value = null;
    try {
      itemsByOrder.value[key(orderId)] = await listOrderItems(orderId);
    } catch (e: any) {
      error.value = e?.message ?? "Не удалось загрузить позиции заказа";
    } finally {
      loading.value = false;
    }
  }

  async function create(orderId: number | string, payload: Partial<OrderItemDto>): Promise<void> {
    loading.value = true;
    error.value = null;
    try {
      await createOrderItem(orderId, payload);
      await load(orderId);
    } catch (e: any) {
      error.value = e?.message ?? "Не удалось создать позицию заказа";
    } finally {
      loading.value = false;
    }
  }

  async function update(
    orderId: number | string,
    orderItemId: number | string,
    payload: Partial<OrderItemDto>
  ): Promise<void> {
    loading.value = true;
    error.value = null;
    try {
      await updateOrderItem(orderId, orderItemId, payload);
      await load(orderId);
    } catch (e: any) {
      error.value = e?.message ?? "Не удалось обновить позицию заказа";
    } finally {
      loading.value = false;
    }
  }

  async function remove(orderId: number | string, orderItemId: number | string): Promise<void> {
    loading.value = true;
    error.value = null;
    try {
      await deleteOrderItem(orderId, orderItemId);
      await load(orderId);
    } catch (e: any) {
      error.value = e?.message ?? "Не удалось удалить позицию заказа";
    } finally {
      loading.value = false;
    }
  }

  return {
    itemsByOrder,
    loading,
    error,
    getItems,
    load,
    create,
    update,
    remove
  };
});
