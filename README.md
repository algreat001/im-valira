# im-valira monorepo

Монохранилище интернет‑магазина: backend (NestJS) + несколько фронтендов (market, administration, stock) + утилиты.

## Структура

```
backend/              NestJS API (PostgreSQL, TypeORM, Auth, Orders, Products)
frontends/            Клиентские приложения (Vite + Vue 3)
  market/             Публичный магазин
  administration/     Панель администратора (/administrator)
  stock/              Дополнительный фронт (зарезервирован)
cert/                 Dev self‑signed сертификаты (HTTPS)
scripts/              Скрипты сборки и деплоя
```

## Backend

- Framework: NestJS
- Язык: TypeScript
- ORM: TypeORM (PostgreSQL)
- Auth: JWT, роли, guards
- Сущности: User, Role, Product, ProductVariant, Category, Cart, Order, OrderItem
- Модули: products, categories, cart, orders, reports, telegram, admin-* (users, dashboard, gallery, product)
- Почта: @nestjs-modules/mailer + Handlebars
- Статика: ServeStaticModule (market на `/`, administration на `/administrator`)
- API префикс: `/api/v1`
- Dev HTTPS: автоматическое включение при наличии `cert/localhost.key|crt`
- CORS: локальные origins + переменная `CORS_ORIGINS`

## Frontend (общие технологии)

- Vite + Vue 3 + TypeScript
- Vuetify 3
- Vue Router (unplugin-vue-router) — генерация типизированных маршрутов
- unplugin-vue-components — автоимпорт компонентов
- vite-svg-loader — SVG как компоненты
- unplugin-fonts (Roboto)
- .env файлы (`VITE_*` переменные), HTTPS dev настройка

### Market

Публичный магазин: каталог, варианты товаров, корзина, оформление заказов. Использует Vite proxy для `/api/v1` или
полный HTTPS URL.

### Administration

Панель управления: аутентификация, пользователи, категории, товары, заказы, галерея. Деплоится под префиксом
`/administrator` (base в Vite).

### Stock

Заготовка для будущего интерфейса (может быть склад / B2B). Пока без активной логики.

## Скрипты

`scripts/deploy.sh` — сборка backend и фронтов, копирование артефактов.

## Переменные окружения

Пример `.env` (корень backend):

```
PORT=3010
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=valira
EMAIL_LOGIN=example@yandex.ru
EMAIL_PASSWORD=secret
CORS_ORIGINS=https://localhost:5173,https://localhost:5174
```

Пример `frontends/market/.env`:

```
VITE_API_HOST=https://localhost:3010
VITE_API_PREFIX=/api/v1
VITE_PUBLIC_BASE=/
```

Пример `frontends/administration/.env`:

```
VITE_API_HOST=https://localhost:3010
VITE_API_PREFIX=/api/v1
VITE_PUBLIC_BASE=/administrator/
```

## Запуск (Dev)

Backend:

```
cd backend
npm install
npm run start:dev
```

Market:

```
cd frontends/market
npm install
npm run dev
```

Administration:

```
cd frontends/administration
npm install
npm run dev
```

Открыть: https://localhost:5173 (market), https://localhost:5174/administrator (если настроен порт/префикс).

## Production (кратко)

1. Установить реальные сертификаты (или использовать HTTP за reverse proxy TLS)
2. Собрать фронтенды: `npm run build` в каждем фронте
3. Собрать backend: `npm run build` (NestJS)
4. Запустить node `dist/main.js`

## Ключевые библиотеки

- Backend: @nestjs/*, typeorm, pg, @nestjs-modules/mailer, handlebars, jsonwebtoken
- Frontend: vue, vue-router, vuetify, vite, unplugin-vue-router, unplugin-vue-components, vite-svg-loader,
  unplugin-fonts

## Принципы

- Чёткий API префикс и версияция
- Отделение публичного и административного UI
- Типизация всех слоёв (TS)
- Возможность расширения (варианты продуктов, дополнительные фронты)

## Лицензия

Проект распространяется по модифицированной MIT лицензии с обязательной атрибуцией. См. файл [LICENSE](./LICENSE).
