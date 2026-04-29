# itl-shop

Frontend интернет-магазина на Nuxt 4 + Vue 3 (Composition API, TypeScript) с интеграцией готового REST API. Реализовано в рамках стажировки frontend-разработчика.

## Стек

- **Nuxt 4.4** (SSR, file-based routing, auto-imports, Nitro server)
- **Vue 3.5** (Composition API, `<script setup>`)
- **TypeScript**
- **Tailwind CSS 3** (`@nuxtjs/tailwindcss`)
- **Swiper 12** (web-components: `<swiper-container>` / `<swiper-slide>`)
- **Node.js 20+**

## Запуск

```bash
# 1. Установка зависимостей
npm install

# 2. Dev-сервер на http://localhost:3000
npm run dev

# 3. Production-сборка
npm run build

# 4. Запуск собранной версии
npm run preview
```

## Структура проекта

```
app/
├── app.vue                       # корневой компонент (NuxtLayout + NuxtPage)
├── layouts/
│   └── default.vue               # дефолтный layout: Navbar + slot + Footer
├── pages/                        # file-based routing
│   ├── index.vue                 # / — главная
│   ├── catalog/
│   │   ├── index.vue             # /catalog — список категорий
│   │   └── [...slug].vue         # /catalog/* — catch-all (категория или товар)
│   ├── cart.vue                  # /cart
│   └── wishlist.vue              # /wishlist
├── components/
│   ├── layout/                   # Navbar, Footer, CatalogModal
│   ├── main/                     # секции главной (HeroBanner, BestsellersSection, ...)
│   ├── catalog/                  # CatalogPage, CatalogFilters, CatalogProductCard
│   ├── product/                  # детальная товара (ProductPage и подкомпоненты)
│   └── skeletons/                # переиспользуемые скелетоны
├── composables/
│   ├── useCart.ts                # корзина (module-level state + localStorage)
│   ├── useWishlist.ts            # избранное (то же)
│   ├── useRecentlyViewed.ts      # просмотренные товары
│   └── useLazySection.ts         # IntersectionObserver обёртка для lazy-load
├── plugins/
│   └── swiper.client.ts          # регистрация web-components Swiper'а на клиенте
└── assets/css/main.css           # tailwind директивы + кастомные утилиты

server/
└── routes/api/[...path].ts       # серверный proxy на api.retail.itl.digital (CORS)

nuxt.config.ts                    # runtimeConfig.public.apiBase + custom elements + tailwind module
tailwind.config.js
tsconfig.json
```

## Реализованный функционал

### Главная страница
- Hero-баннер с автоплеем (Swiper) + блок преимуществ
- Все секции с **lazy-load по скроллу** через `IntersectionObserver` (`useLazySection`) и **skeleton-состояниями**
- Хиты продаж / Распродажа / Рекомендуем — переключение категорий с локальной фильтрацией без повторных запросов
- Карусели брендов, акций, блога с touch-свайпом и кнопками
- Динамические данные по большинству эндпоинтов из ТЗ

### Шапка (Navbar)
- Меню популярных категорий (drag-to-scroll + горизонтальный wheel)
- Поиск, корзина, избранное со счётчиками
- **Модальное окно каталога** с древовидной структурой по `parentId`

### Каталог (`/catalog/[slug]`)
- Список товаров с пагинацией (12 на страницу)
- Фильтры: чекбоксы, диапазоны (min/max), цена
- Сортировка: популярные / дешёвые / дорогие / по названию
- **Все параметры синхронизированы с URL query** (`?page=2&sort=price_asc&filters=…&priceMin=…&priceMax=…`) — фильтры/сортировка/страница сохраняются при F5 и при открытии прямой ссылки
- Debounce 500мс на изменения цены/диапазонов
- Адаптивные фильтры: десктоп — sidebar, мобайл — выезжающая панель (`<Teleport>` + `<Transition>`)
- Хлебные крошки, подкатегории, баннер каталога
- View mode: grid / list

### Детальная товара (`/catalog/[…]/[slug]`)
Catch-all роут (`pages/catalog/[...slug].vue`) определяет тип страницы по структуре ответа бэка (категория или товар).

- Галерея, цена/старая цена, характеристики, свойства, документы
- Описание, рейтинг, отзывы (с пагинацией), статистика отзывов
- Похожие товары, "С этим товаром покупают" (lazy-load + skeleton)
- "Вы смотрели" (через localStorage)
- Магазины, кнопки "Купить"/"В 1 клик", добавление в корзину/избранное
- Заглушки на отсутствующие изображения и неполные данные
- SEO: `useSeoMeta` с данными из `meta.seo` и `meta.og` (включая Open Graph)

### Корзина и избранное
- Module-level `ref` + `localStorage` (без Pinia)
- Cart: список, количество, шаги +/-, итоговая сумма, промо-инпут (заглушка), очистка
- Wishlist: сетка карточек, удаление по клику на сердечко

### Серверный слой / API
- Серверный proxy в `server/routes/api/[...path].ts` решает CORS — фронт ходит на `/api/*`, сервер форвардит на `https://api.retail.itl.digital/*`
- `apiBase` для абсолютных URL картинок берётся из `runtimeConfig.public.apiBase`

## Зависимости

```json
{
  "dependencies": {
    "nuxt": "^4.4.2",
    "vue": "^3.5.31",
    "vue-router": "^5.0.4",
    "swiper": "^12.1.3"
  },
  "devDependencies": {
    "@nuxtjs/tailwindcss": "^6.14.0",
    "tailwindcss": "^3.4.19"
  }
}
```
