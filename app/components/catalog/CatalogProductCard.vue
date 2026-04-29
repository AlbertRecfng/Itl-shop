<template>
  <div class="bg-white rounded-xl p-3 flex flex-col h-full group">
    <NuxtLink :to="product.links.self" class="block" @click="trackView">
      <div class="relative mb-2">
        <div class="flex flex-col gap-1 absolute top-1 left-1 z-10">
          <span
            v-for="(sticker, i) in displayBadges"
            :key="i"
            class="text-[10px] font-semibold px-2 py-0.5 rounded"
            :class="sticker.color"
          >
            {{ sticker.label }}
          </span>
        </div>
        <img
          :src="imageBase + product.attributes.preview"
          :alt="product.attributes.name"
          class="w-full h-[140px] sm:h-[170px] lg:h-[200px] object-contain"
        />
      </div>

      <div v-if="review" class="flex items-center gap-1 mb-1">
        <svg class="w-3.5 h-3.5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
        <span class="text-xs font-medium text-gray-700">{{ review.attributes.rating }}</span>
      </div>

      <p class="text-xs sm:text-sm text-gray-800 font-medium leading-tight line-clamp-2 mb-1 min-h-[2rem] sm:min-h-[2.5rem]">
        {{ product.attributes.name }}
      </p>

      <p class="text-xs text-gray-500 mb-2">
        <template v-if="storeCount > 0">
          В наличии в <span class="text-blue-600">{{ storeCount }} {{ storeWord }}</span>
        </template>
        <template v-else>
          Нет в наличии
        </template>
      </p>
    </NuxtLink>

    <div class="mt-auto">
      <div class="mb-2">
        <div v-if="oldPrice" class="text-xs text-gray-400 line-through">{{ oldPrice }}</div>
        <div class="text-base sm:text-lg font-bold text-gray-900">
          {{ product.attributes.product?.price?.valueFormatted }}
        </div>
      </div>

      <div class="flex items-center gap-1.5">
        <template v-if="cartItem">
          <div class="flex items-center bg-yellow-400 rounded-lg overflow-hidden">
            <button @click.prevent="cart.decrementItem(product.id)" class="px-2.5 py-1.5 text-sm font-bold hover:bg-yellow-500 transition-colors">&minus;</button>
            <span class="px-2 py-1.5 text-sm font-bold min-w-[24px] text-center">{{ cartItem.quantity }}</span>
            <button @click.prevent="cart.addItem(cartPayload)" class="px-2.5 py-1.5 text-sm font-bold hover:bg-yellow-500 transition-colors">&plus;</button>
          </div>
        </template>
        <template v-else>
          <button
            @click.prevent="cart.addItem(cartPayload)"
            class="bg-yellow-400 hover:bg-yellow-500 text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors"
          >
            + В корзину
          </button>
        </template>

        <button
          @click.prevent="toggleWishlist"
          class="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          :class="isInWishlist ? 'text-red-500' : 'text-gray-400'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" :fill="isInWishlist ? 'currentColor' : 'none'" :stroke="isInWishlist ? 'none' : 'currentColor'" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
          </svg>
        </button>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  product: any
  review: any | null
}>()

const imageBase = useRuntimeConfig().public.apiBase as string
const cart = useCart()
const wishlist = useWishlist()
const recentlyViewed = useRecentlyViewed()

function trackView() {
  recentlyViewed.addProduct({
    id: props.product.id,
    name: props.product.attributes.name,
    price: props.product.attributes.product?.price?.value ?? 0,
    priceFormatted: props.product.attributes.product?.price?.valueFormatted ?? '',
    preview: props.product.attributes.preview,
    link: props.product.links.self,
    stikers: props.product.attributes.stikers ?? [],
    storeCount: Object.keys(props.product.attributes.product?.stores?.items ?? {}).length,
  })
}

const cartPayload = computed(() => ({
  id: props.product.id,
  name: props.product.attributes.name,
  price: props.product.attributes.product?.price?.value ?? 0,
  priceFormatted: props.product.attributes.product?.price?.valueFormatted ?? '',
  preview: props.product.attributes.preview,
  link: props.product.links?.self ?? '',
  stikers: props.product.attributes.stikers ?? [],
}))

const cartItem = computed(() => cart.items.value.find(i => i.id === props.product.id))
const isInWishlist = computed(() => wishlist.items.value.some(i => i.id === props.product.id))

function toggleWishlist() {
  if (isInWishlist.value) {
    wishlist.removeItem(props.product.id)
  } else {
    wishlist.addItem({
      id: props.product.id,
      name: props.product.attributes.name,
      price: props.product.attributes.product?.price?.value ?? 0,
      priceFormatted: props.product.attributes.product?.price?.valueFormatted ?? '',
      preview: props.product.attributes.preview,
      link: props.product.links?.self ?? '',
      stikers: props.product.attributes.stikers ?? [],
      storeCount: storeCount.value,
      rating: props.review?.attributes?.rating ?? undefined,
    })
  }
}

const oldPrice = computed(() => {
  const stikers: string[] = props.product.attributes.stikers ?? []
  if (!stikers.includes('Акция')) return null
  const price = props.product.attributes.product?.price?.value
  if (!price) return null
  const original = Math.round(price * 1.06)
  return original.toLocaleString('ru-RU') + ' ₸'
})

const storeCount = computed(() => {
  const stores = props.product.attributes.product?.stores?.items
  if (!stores) return 0
  return Object.keys(stores).length
})

const storeWord = computed(() => {
  const n = storeCount.value
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod100 >= 11 && mod100 <= 14) return 'магазинах'
  if (mod10 === 1) return 'магазине'
  if (mod10 >= 2 && mod10 <= 4) return 'магазинах'
  return 'магазинах'
})

const badgeMap: Record<string, { label: string; color: string }> = {
  'Хит': { label: 'Хит продаж', color: 'bg-[#0E6CDD] text-white' },
  'Акция': { label: 'Скидка', color: 'bg-[#E31E24] text-white' },
  'Новинка': { label: 'Новинка', color: 'bg-[#FB6340] text-white' },
  'Советуем': { label: 'Товар недели', color: 'bg-[#5F2580] text-white' },
}

const displayBadges = computed(() => {
  const stikers: string[] = props.product.attributes.stikers ?? []
  return stikers
    .map(s => badgeMap[s])
    .filter((badge): badge is { label: string; color: string } => badge !== undefined)
    .slice(0, 2)
})
</script>
