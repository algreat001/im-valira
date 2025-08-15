import { useProductsStore } from "@/stores/products.ts";
import { useUIStore } from "@/stores/ui.ts";
import { useAuthStore } from "@/stores/auth.ts";
import { useCartStore } from "@/stores/cart.ts";
import { useCategoriesStore } from "@/stores/categories.ts";

export async function bootstrap() {
  await useUIStore().load(useCategoriesStore().loadCategories);
  await useUIStore().load(useProductsStore().loadProducts);
}

export async function initUser() {
  if (useAuthStore().isAuthenticated) {
    return;
  }
  await useAuthStore().init();
  if (!useAuthStore().isAuthenticated) {
    return;
  }
  afterLogin(); // специально асинхронно
}

export async function logout() {
  await useAuthStore().logout();
  afterLogout(); // специально асинхронно
}

export async function afterLogin() {
  await useCartStore().loadCart();
}

export async function afterLogout() {
  useCartStore().forceClearCart();
}
