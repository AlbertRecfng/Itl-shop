<template>
  <div class="w-full">
    <div class="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12">
      <NuxtLink to="/" class="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
        <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Главная
      </NuxtLink>

      <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
        Избранное
        <span v-if="items.length" class="text-gray-400 font-normal">— {{ items.length }}</span>
      </h1>

      <p v-if="!items.length" class="text-sm text-gray-600">В избранном ничего нет.</p>

      <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3">
        <div
          v-for="item in items"
          :key="item.id"
          class="bg-white rounded-xl p-3 flex flex-col h-full group"
        >
          <NuxtLink :to="item.link || '#'" class="block">
            <div class="relative mb-2">
              <div v-if="displayBadges(item).length" class="flex flex-col gap-1 absolute top-1 left-1 z-10">
                <span
                  v-for="(b, i) in displayBadges(item)"
                  :key="i"
                  class="text-[10px] font-semibold px-2 py-0.5 rounded"
                  :class="b.color"
                >
                  {{ b.label }}
                </span>
              </div>
              <img
                v-if="item.preview"
                :src="imageBase + item.preview"
                :alt="item.name"
                class="w-full h-[140px] sm:h-[170px] lg:h-[200px] object-contain"
              />
              <div v-else class="w-full h-[140px] sm:h-[170px] lg:h-[200px] bg-gray-50 rounded-lg" />
            </div>

            <div v-if="item.rating" class="flex items-center gap-1 mb-1">
              <svg class="w-3.5 h-3.5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span class="text-xs font-medium text-gray-700">{{ item.rating }}</span>
            </div>

            <p class="text-xs sm:text-sm text-gray-800 font-medium leading-tight line-clamp-2 mb-1 min-h-[2rem] sm:min-h-[2.5rem]">
              {{ item.name }}
            </p>

            <p class="text-xs text-gray-500 mb-2">
              <template v-if="(item.storeCount ?? 0) > 0">
                В наличии в <span class="text-blue-600">{{ item.storeCount }} {{ storeWord(item.storeCount ?? 0) }}</span>
              </template>
              <template v-else>
                Нет в наличии
              </template>
            </p>
          </NuxtLink>

          <div class="mt-auto">
            <div class="mb-2">
              <div class="text-base sm:text-lg font-bold text-gray-900">
                {{ item.priceFormatted || (item.price.toLocaleString('ru-RU') + ' ₸') }}
              </div>
            </div>

            <div class="flex items-center gap-1.5">
              <template v-if="cartItemOf(item.id)">
                <div class="flex items-center bg-yellow-400 rounded-lg overflow-hidden">
                  <button
                    class="px-2.5 py-1.5 text-sm font-bold hover:bg-yellow-500 transition-colors"
                    @click.prevent="cart.decrementItem(item.id)"
                  >−</button>
                  <span class="px-2 py-1.5 text-sm font-bold min-w-[24px] text-center">{{ cartItemOf(item.id)?.quantity }}</span>
                  <button
                    class="px-2.5 py-1.5 text-sm font-bold hover:bg-yellow-500 transition-colors"
                    @click.prevent="addToCart(item)"
                  >+</button>
                </div>
              </template>
              <template v-else>
                <button
                  class="bg-yellow-400 hover:bg-yellow-500 text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors"
                  @click.prevent="addToCart(item)"
                >
                  + В корзину
                </button>
              </template>

              <button
                class="p-1.5 rounded-lg text-red-500 hover:bg-gray-100 transition-colors"
                @click.prevent="wishlist.removeItem(item.id)"
                title="Убрать из избранного"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const wishlist = useWishlist()
const cart = useCart()
const { items } = wishlist

const imageBase = useRuntimeConfig().public.apiBase as string

useSeoMeta({ title: 'Избранное' })

const badgeMap: Record<string, { label: string; color: string }> = {
  'Хит': { label: 'Хит продаж', color: 'bg-[#0E6CDD] text-white' },
  'Акция': { label: 'Скидка', color: 'bg-[#E31E24] text-white' },
  'Новинка': { label: 'Новинка', color: 'bg-[#FB6340] text-white' },
  'Советуем': { label: 'Товар недели', color: 'bg-[#5F2580] text-white' },
}

function displayBadges(item: any) {
  return ((item.stikers ?? []) as string[])
    .map(s => badgeMap[s])
    .filter((b): b is { label: string; color: string } => !!b)
    .slice(0, 2)
}

function cartItemOf(id: number) {
  return cart.items.value.find(i => i.id === id)
}

function addToCart(item: any) {
  cart.addItem({
    id: item.id,
    name: item.name,
    price: item.price,
    priceFormatted: item.priceFormatted,
    preview: item.preview,
    link: item.link,
    stikers: item.stikers,
  })
}

function storeWord(n: number) {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod100 >= 11 && mod100 <= 14) return 'магазинах'
  if (mod10 === 1) return 'магазине'
  if (mod10 >= 2 && mod10 <= 4) return 'магазинах'
  return 'магазинах'
}
</script>
