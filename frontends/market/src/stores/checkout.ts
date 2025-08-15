import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { RouteLocationRaw, Router } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useCartStore } from "@/stores/cart";
import { initUser } from "@/bootstrap.ts";
import { createOrder } from "@/backend/checkout.service.ts";
import type { CreateOrderDto } from "@/interfaces/order.ts";
import type { DeliveryMeta } from "@/interfaces/meta";

export type PaymentMethod = "sbp" | "bank";

export const useCheckoutStore = defineStore("checkout", () => {
  const auth = useAuthStore();
  const cart = useCartStore();

  // state
  const paymentMethod = ref<PaymentMethod>("sbp");
  const loading = ref(false);
  const error = ref<string | null>(null);

  // computed (профиль)
  const fullName = computed(() => {
    const u: any = auth.user || {};
    const parts = [ u.lastName, u.firstName, u.middleName ].filter(Boolean);
    return (parts.join(" ") || u.name || "").trim();
  });
  const postalCode = computed(() => (auth.user as any)?.postalCode || "");
  const deliveryCity = computed(() => (auth.user as any)?.deliveryCity || "");
  const deliveryAddress = computed(() => auth.user?.deliveryAddress || "");

  // computed (корзина)
  const items = computed(() => cart.items || []);
  const positionsCount = computed(() => items.value.length);
  const totalCount = computed(() => cart.totalCount || 0); // единиц товара
  const totalPrice = computed(() => cart.totalPrice || 0);

  // guard: убедиться в авторизации и подгрузить профиль, иначе редирект на вход
  async function ensureAuthOrRedirect() {
    await initUser();
    return await auth.testAuthenticated("/checkout");
  }

  function getPayload(): CreateOrderDto {
    const delivery = {
      city: deliveryCity.value ?? "",
      address: deliveryAddress.value ?? "",
      postal_code: postalCode.value ?? "",
      phone: auth.user?.phone || "",
      name: fullName.value
    } as DeliveryMeta;

    return {
      payment_method: paymentMethod.value,
      total_price: 0, //сервер посчитает
      description: "",
      delivery
    };
  }

  // подтверждение заказа
  async function submitOrder(router: Router) {
    loading.value = true;
    error.value = null;

    try {
      const res = await createOrder(getPayload());

      if (!res.order_id) {
        throw new Error("Ошибка при отправке заказа. Попробуйте позже.");
      }
      cart.forceClearCart();

      if (!res.meta.payment_token) {
        await router.replace({
          name: "OrderSuccess",
          query: {
            number: res.number
          }
        } as unknown as RouteLocationRaw);
      } else {
        await router.replace({
          name: "Payment",
          query: {
            order_id: res.order_id,
            number: res.number,
            method: res.meta.payment_method,
            token: res.meta.payment_token
          }
        } as unknown as RouteLocationRaw);
      }

    } catch (e: any) {
      error.value = e?.message || "Ошибка при отправке заказа. Попробуйте позже.";
      throw e;
    } finally {
      loading.value = false;
    }
  }

  return {
    paymentMethod,
    loading,
    error,
    fullName,
    postalCode,
    deliveryCity,
    deliveryAddress,
    items,
    positionsCount,
    totalCount,
    totalPrice,
    ensureAuthOrRedirect,
    submitOrder
  };
});
