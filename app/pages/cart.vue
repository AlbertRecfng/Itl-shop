<template>
  <div class="w-full">
    <div class="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12">
      <NuxtLink to="/catalog" class="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
        <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Вернуться в каталог
      </NuxtLink>

      <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">
          Корзина
          <span v-if="count" class="text-gray-400 font-normal">— {{ count }}</span>
        </h1>

        <div class="flex items-center gap-5 text-sm">
          <button type="button" class="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700" @click="copyCartLink">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Ссылка на корзину
          </button>
          <button type="button" class="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700" @click="printPage">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Распечатать
          </button>
        </div>
      </div>

      <div v-if="!items.length" class="text-gray-700 space-y-4 max-w-3xl">
        <h2 class="text-xl font-semibold text-gray-900 mb-2">Ваша корзина пуста</h2>
        <p class="text-sm">
          Если вы наполняли корзину при прошлом визите,
          <a href="#" class="text-blue-600 hover:underline" @click.prevent>авторизуйтесь</a>,
          чтобы увидеть выбранные товары.
        </p>
        <p class="text-sm">
          Или перейдите в
          <NuxtLink to="/catalog" class="text-blue-600 hover:underline">каталог</NuxtLink>,
          выберите интересующий товар и нажмите кнопку «Добавить в корзину», а также загляните в раздел с акциями.
        </p>
        <p class="text-sm">
          Ещё вы можете
          <a href="#" class="text-blue-600 hover:underline" @click.prevent>загрузить прайс-лист</a>
          с нужным списком товаров.
        </p>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-5 items-start">
        <div class="bg-white border border-gray-100 rounded-xl overflow-hidden">
          <ul class="divide-y divide-gray-100">
            <li
              v-for="item in items"
              :key="item.id"
              class="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4"
            >
              <NuxtLink
                :to="item.link || '#'"
                class="shrink-0 w-full sm:w-[140px] h-[120px] flex items-center justify-center"
              >
                <img
                  v-if="item.preview"
                  :src="imageBase + item.preview"
                  :alt="item.name"
                  class="w-full h-full object-contain"
                />
                <div v-else class="w-full h-full bg-gray-50 rounded-lg" />
              </NuxtLink>

              <div class="flex-1 min-w-0">
                <div v-if="displayBadges(item).length" class="flex flex-wrap gap-1.5 mb-2">
                  <span
                    v-for="(b, i) in displayBadges(item)"
                    :key="i"
                    class="text-[10px] font-semibold px-2 py-0.5 rounded"
                    :class="b.color"
                  >
                    {{ b.label }}
                  </span>
                </div>
                <NuxtLink :to="item.link || '#'" class="text-sm sm:text-base font-medium text-gray-900 hover:text-blue-600 line-clamp-2">
                  {{ item.name }}
                </NuxtLink>
                <p v-if="item.article" class="text-xs text-gray-400 mt-1">Код товара: {{ item.article }}</p>
              </div>

              <div class="flex items-center border border-gray-200 rounded-lg overflow-hidden self-start sm:self-auto">
                <button
                  type="button"
                  class="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                  @click="cart.decrementItem(item.id)"
                >
                  −
                </button>
                <span class="w-10 text-center text-sm font-semibold">{{ item.quantity }}</span>
                <button
                  type="button"
                  class="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                  @click="cart.addItem(item)"
                >
                  +
                </button>
              </div>

              <div class="text-lg sm:text-xl font-bold text-gray-900 min-w-[110px] sm:text-right">
                {{ formatPrice(item.price * item.quantity) }} ₸
              </div>

              <div class="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                <button
                  type="button"
                  class="p-2 rounded-lg hover:bg-gray-50 transition-colors"
                  :class="isInWishlist(item.id) ? 'text-red-500' : 'text-blue-500'"
                  @click="toggleWishlist(item)"
                >
                  <svg class="w-5 h-5" viewBox="0 0 24 24" :fill="isInWishlist(item.id) ? 'currentColor' : 'none'" :stroke="isInWishlist(item.id) ? 'none' : 'currentColor'" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
                <button
                  type="button"
                  class="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-gray-50 transition-colors"
                  @click="cart.removeItem(item.id)"
                >
                  <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M10 3h4a2 2 0 012 2v2H8V5a2 2 0 012-2z" />
                  </svg>
                </button>
              </div>
            </li>
          </ul>
        </div>

        <aside class="space-y-3">
          <div class="bg-white border border-gray-100 rounded-xl p-4 flex items-start gap-3">
            <div class="flex-1 text-sm text-gray-700 leading-snug">
              <a href="#" class="text-blue-600 hover:underline" @click.prevent>Авторизуйтесь</a>
              и узнайте свою персональную цену.
            </div>
            <div class="shrink-0 text-blue-500">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 7h14M5 12h14M9 17h6" />
              </svg>
            </div>
          </div>

          <div class="bg-[#F5F7FA] rounded-xl p-5">
            <div class="flex items-center justify-between mb-4">
              <span class="text-2xl font-semibold text-gray-900">Итого</span>
              <span class="text-2xl font-bold text-gray-900">{{ formatPrice(total) }} ₸</span>
            </div>

            <form class="flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden mb-3" @submit.prevent="applyPromo">
              <input
                v-model="promo"
                type="text"
                placeholder="Введите промокод"
                class="flex-1 px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none"
              />
              <button type="submit" class="px-3 text-gray-400 hover:text-gray-600">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </form>

            <button
              type="button"
              class="w-full bg-yellow-400 hover:bg-yellow-500 transition-colors py-3 rounded-lg text-base font-semibold text-gray-900"
              @click="checkout"
            >
              Перейти к оформлению
            </button>
          </div>

          <button
            type="button"
            class="w-full bg-white border border-gray-100 rounded-xl px-4 py-3 text-sm text-blue-600 hover:bg-gray-50 transition-colors flex items-center justify-between"
            @click.prevent
          >
            <span><span class="font-medium">Добавить товары к заказу</span> <span class="text-gray-700">из Excel файла.</span></span>
            <svg class="w-5 h-5 text-green-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M14 2v6h6" />
            </svg>
          </button>

          <button
            type="button"
            class="w-full bg-white border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-800 hover:bg-gray-50 transition-colors"
            @click="cart.clear()"
          >
            Очистить корзину
          </button>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const cart = useCart()
const wishlist = useWishlist()
const { items, count, total } = cart

const imageBase = useRuntimeConfig().public.apiBase as string
const promo = ref('')

useSeoMeta({ title: 'Корзина' })

const badgeMap: Record<string, { label: string; color: string }> = {
  'Хит': { label: 'Хит', color: 'bg-[#0E6CDD] text-white' },
  'Акция': { label: 'Акция', color: 'bg-[#E31E24] text-white' },
  'Новинка': { label: 'Новинка', color: 'bg-[#FB6340] text-white' },
  'Советуем': { label: 'Советуем', color: 'bg-[#5F2580] text-white' },
}

function displayBadges(item: { stikers?: string[] }) {
  return (item.stikers ?? [])
    .map(s => badgeMap[s])
    .filter((b): b is { label: string; color: string } => b !== undefined)
}

function formatPrice(n: number) {
  return n.toLocaleString('ru-RU')
}

function isInWishlist(id: number) {
  return wishlist.items.value.some(i => i.id === id)
}

function toggleWishlist(item: { id: number; name: string; price: number; priceFormatted?: string; preview?: string; link?: string; stikers?: string[] }) {
  if (isInWishlist(item.id)) wishlist.removeItem(item.id)
  else wishlist.addItem({
    id: item.id,
    name: item.name,
    price: item.price,
    priceFormatted: item.priceFormatted,
    preview: item.preview,
    link: item.link,
    stikers: item.stikers,
  })
}

function applyPromo() {
  if (!promo.value.trim()) return
  alert(`Промокод «${promo.value}» — заглушка, бэкенд не подключён`)
}

function checkout() {
  alert('Оформление заказа — заглушка')
}

async function copyCartLink() {
  if (import.meta.client) {
    try { await navigator.clipboard.writeText(window.location.href) } catch {}
  }
}

function printPage() {
  if (import.meta.client) window.print()
}
</script>
