import { ref } from "vue";
import { defineStore } from "pinia";

import { listOrders, createOrder, updateOrder, deleteOrder } from "@/backend/order.service";

import type { OrderDto } from "@/interfaces/order";

export const useOrderStore = defineStore("order", () => {
  const orders = ref<OrderDto[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function load(): Promise<void> {
    loading.value = true;
    error.value = null;
    try {
      orders.value = (await listOrders()) as unknown as OrderDto[];
    } catch (e: any) {
      error.value = e?.message ?? "Не удалось загрузить заказы";
    } finally {
      loading.value = false;
    }
  }

  async function create(payload: Partial<OrderDto>): Promise<void> {
    loading.value = true;
    error.value = null;
    try {
      await createOrder(payload);
      await load();
    } catch (e: any) {
      error.value = e?.message ?? "Не удалось создать заказ";
    } finally {
      loading.value = false;
    }
  }

  async function update(orderId: number | string, payload: Partial<OrderDto>): Promise<void> {
    loading.value = true;
    error.value = null;
    try {
      await updateOrder(orderId, payload);
      await load();
    } catch (e: any) {
      error.value = e?.message ?? "Не удалось обновить заказ";
    } finally {
      loading.value = false;
    }
  }

  async function remove(orderId: number | string): Promise<void> {
    loading.value = true;
    error.value = null;
    try {
      await deleteOrder(orderId);
      await load();
    } catch (e: any) {
      error.value = e?.message ?? "Не удалось удалить заказ";
    } finally {
      loading.value = false;
    }
  }

  return {
    orders,
    loading,
    error,
    load,
    create,
    update,
    remove,
  };
});
