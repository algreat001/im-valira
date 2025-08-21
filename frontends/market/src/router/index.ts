import {
  createRouter,
  createWebHistory, type RouteLocationRaw,
  type RouteRecordRaw
} from "vue-router";
import { initUser } from "@/bootstrap.ts";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Home",
    component: () => import("../pages/HomePage.vue"),
    meta: { title: "Главная", metaTags: [ { name: "description", content: "Интернет-магазин. Главная страница." } ] }
  },
  {
    path: "/catalog",
    name: "Catalog",
    component: () => import("../pages/CatalogPage.vue"),
    meta: { title: "Каталог", metaTags: [ { name: "description", content: "Каталог товаров интернет-магазина." } ] }
  },
  {
    path: "/product/:id",
    name: "Product",
    component: () => import("../pages/ProductPage.vue"),
    meta: { title: "Товар", metaTags: [ { name: "description", content: "Карточка товара." } ] }
  },
  {
    path: "/cart",
    name: "Cart",
    component: () => import("../pages/CartPage.vue"),
    meta: { title: "Корзина", metaTags: [ { name: "description", content: "Корзина покупок." } ] }
  },
  {
    path: "/checkout",
    name: "Checkout",
    component: () => import("../pages/CheckoutPage.vue"),
    meta: { title: "Оформление заказа", metaTags: [ { name: "description", content: "Оформление заказа." } ] }
  },
  {
    path: "/payment",
    name: "Payment",
    component: () => import("../pages/PaymentPage.vue"),
    meta: { title: "Оплата заказа", metaTags: [ { name: "description", content: "Оплата заказа." } ] }
  },
  {
    path: "/order/success",
    name: "OrderSuccess",
    component: () => import("../pages/OrderSuccessPage.vue"),
    meta: { title: "Заказ оформлен", metaTags: [ { name: "description", content: "Успешное оформление заказа." } ] }
  },
  {
    path: "/orders",
    name: "Orders",
    component: () => import("@/pages/OrderPage.vue"),
    meta: { title: "Мои заказы", metaTags: [ { name: "description", content: "Список заказов и детали заказа." } ], requiresAuth: true }
  },
  {
    path: "/about",
    name: "About",
    component: () => import("../pages/AboutPage.vue"),
    meta: { title: "О магазине", metaTags: [ { name: "description", content: "Информация о магазине IM Valira." } ] }
  },
  {
    path: "/delivery",
    name: "Delivery",
    component: () => import("../pages/DeliveryPage.vue"),
    meta: { title: "Доставка", metaTags: [ { name: "description", content: "Условия и способы доставки." } ] }
  },
  {
    path: "/contacts",
    name: "Contacts",
    component: () => import("../pages/ContactsPage.vue"),
    meta: {
      title: "Контакты",
      metaTags: [ { name: "description", content: "Контактная информация интернет-магазина." } ]
    }
  },
  {
    path: `/article/:name`,
    name: `Article`,
    component: () => import("../pages/ArticlePage.vue"),
    meta: {
      title: "Статья",
      metaTags: [ { name: "description", content: "Статья интернет-магазина. Полезная информация." } ]
    }
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../pages/LoginPage.vue"),
    meta: { title: "Вход", metaTags: [ { name: "description", content: "Вход в личный кабинет." } ] }
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../pages/RegisterPage.vue"),
    meta: { title: "Регистрация", metaTags: [ { name: "description", content: "Создание аккаунта." } ] }
  },
  {
    path: "/profile",
    name: "Profile",
    component: () => import("../pages/ProfilePage.vue"),
    meta: {
      title: "Профиль",
      metaTags: [ { name: "description", content: "Личный кабинет пользователя." } ],
      requiresAuth: true
    }
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("../pages/NotFound.vue"),
    meta: {
      title: "404 — Страница не найдена",
      metaTags: [
        { name: "description", content: "Страница не найдена. Ошибка 404." }
      ]
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async (to, _from, next) => {
  const { useAuthStore } = await import("../stores/auth");
  const auth = useAuthStore();
  await initUser();
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
  if (to.meta && to.meta.metaTags) {
    (to.meta.metaTags as any[]).forEach(tag => {
      const element = document.createElement("meta");
      Object.keys(tag).forEach(key => {
        element.setAttribute(key, tag[key]);
      });
      document.head.appendChild(element);
    });
  }
});

export default router;
