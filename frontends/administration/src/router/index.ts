import {
  createRouter,
  createWebHistory,
  type RouteLocationRaw,
  type RouteRecordRaw
} from "vue-router";
import { initUser } from "@/bootstrap";

const routes: RouteRecordRaw[] = [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/pages/LoginPage.vue"),
    meta: { title: "Вход", guestOnly: true }
  },
  {
    path: "/",
    name: "Dashboard",
    component: () => import("@/pages/DashboardPage.vue"),
    meta: { title: "Панель управления", requiresAuth: true }
  },
  {
    path: "/users",
    name: "Users",
    component: () => import("@/pages/UsersPage.vue"),
    meta: { title: "Пользователи", requiresAuth: true }
  },
  {
    path: "/categories",
    name: "Categories",
    component: () => import("@/pages/CategoriesPage.vue"),
    meta: { title: "Категории", requiresAuth: true }
  },
  {
    path: "/products",
    name: "Products",
    component: () => import("@/pages/ProductsPage.vue"),
    meta: { title: "Товары", requiresAuth: true }
  },
  {
    path: "/orders",
    name: "Orders",
    component: () => import("@/pages/OrdersPage.vue"),
    meta: { title: "Заказы", requiresAuth: true }
  },
  {
    path: "/gallery",
    name: "Gallery",
    component: () => import("@/pages/GalleryPage.vue"),
    meta: { title: "Галерея", requiresAuth: true }
  },
  {
    path: "/banners",
    name: "Banners",
    component: () => import("@/pages/BannerPage.vue"),
    meta: { title: "Баннеры", requiresAuth: true }
  },
  {
    path: "/:pathMatch(.*)*",
    name: "AdminNotFound",
    component: () => import("@/pages/NotFound.vue"),
    meta: { title: "404 — Не найдено" }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

router.beforeEach(async (to, _from, next) => {
  const { useAuthStore } = await import("@/stores/auth");
  const auth = useAuthStore();
  await initUser();

  if (to.meta && (to.meta as any).guestOnly && auth.isAuthenticated) {
    next({ name: "Dashboard" } as unknown as RouteLocationRaw);
    return;
  }

  if (to.meta && (to.meta as any).requiresAuth && !auth.isAuthenticated) {
    next({ name: "Login", query: { redirect: to.fullPath } } as unknown as RouteLocationRaw);
  } else {
    next();
  }
});

router.afterEach((to) => {
  if (to.meta && to.meta.title) {
    document.title = to.meta.title as string;
  }
});

export default router;
