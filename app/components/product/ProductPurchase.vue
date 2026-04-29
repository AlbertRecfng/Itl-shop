<template>
  <div class="bg-white rounded-xl p-4 sm:p-5 flex flex-col gap-4">
    <div>
      <div class="text-2xl sm:text-3xl font-bold text-gray-900">
        {{ priceFormatted }}
      </div>
      <p class="text-xs text-gray-500 mt-1">или от {{ monthly }} / мес.</p>
    </div>

    <div class="text-sm">
      <template v-if="availableInStoresCount > 0">
        <p class="text-green-600 font-medium">В наличии</p>
        <p class="text-gray-500 mt-0.5">в {{ availableInStoresCount }} {{ storeWord }}</p>
      </template>
      <p v-else class="text-gray-500">Нет в наличии</p>
    </div>

    <div v-if="deliveryPrice" class="flex items-start gap-2 text-sm border-t border-gray-100 pt-3">
      <svg class="w-5 h-5 text-gray-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      <div>
        <p class="text-gray-900">Доставка курьером - <span class="font-semibold">{{ deliveryPrice }}</span></p>
        <p class="text-gray-500 text-xs mt-0.5">Самовывоз из магазина — бесплатно</p>
      </div>
    </div>

    <div class="flex items-stretch gap-2">
      <template v-if="cartItem">
        <div class="flex items-center bg-yellow-400 rounded-lg overflow-hidden flex-1">
          <button
            type="button"
            class="flex-1 py-3 text-base font-bold hover:bg-yellow-500 transition-colors"
            @click="cart.decrementItem(productId)"
          >−</button>
          <span class="px-3 py-3 text-base font-bold min-w-[40px] text-center">{{ cartItem.quantity }}</span>
          <button
            type="button"
            class="flex-1 py-3 text-base font-bold hover:bg-yellow-500 transition-colors"
            :disabled="!canBuy"
            :class="{ 'opacity-50 cursor-not-allowed': !canBuy }"
            @click="addToCart"
          >+</button>
        </div>
      </template>
      <template v-else>
        <button
          type="button"
          class="flex-1 bg-yellow-400 hover:bg-yellow-500 text-base font-semibold py-3 rounded-lg transition-colors"
          :disabled="!canBuy"
          :class="{ 'opacity-50 cursor-not-allowed': !canBuy }"
          @click="addToCart"
        >
          В корзину
        </button>
      </template>

      <button
        type="button"
        class="p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        :class="isInWishlist ? 'text-red-500' : 'text-gray-400'"
        @click="toggleWishlist"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" :fill="isInWishlist ? 'currentColor' : 'none'" :stroke="isInWishlist ? 'none' : 'currentColor'" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
        </svg>
      </button>
    </div>

    <button
      type="button"
      class="w-full bg-blue-50 hover:bg-blue-100 border border-blue-200 text-gray-800 text-base font-medium py-3 rounded-lg transition-colors"
      :disabled="!canBuy"
      :class="{ 'opacity-50 cursor-not-allowed': !canBuy }"
      @click="addToCart"
    >
      Заказать в 1 клик
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  productId: number
  name: string
  priceValue: number
  priceFormatted: string
  quantity: number
  stores?: { store_id: string; amount: string; text: string }[]
  deliveryPrice?: string | null
  preview?: string
  link?: string
  stikers?: string[]
  article?: string | null
}>()

const cart = useCart()
const wishlist = useWishlist()

const availableInStoresCount = computed(() => {
  return (props.stores ?? []).filter(s => Number(s.amount) > 0).length
})

const canBuy = computed(() => props.quantity > 0)

const cartItem = computed(() => cart.items.value.find(i => i.id === props.productId))
const isInWishlist = computed(() => wishlist.items.value.some(i => i.id === props.productId))

const monthly = computed(() => {
  const perMonth = Math.round(props.priceValue / 12)
  return perMonth.toLocaleString('ru-RU') + ' ₸'
})

const storeWord = computed(() => {
  const n = availableInStoresCount.value
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod100 >= 11 && mod100 <= 14) return 'магазинах'
  if (mod10 === 1) return 'магазине'
  if (mod10 >= 2 && mod10 <= 4) return 'магазинах'
  return 'магазинах'
})

function addToCart() {
  if (!canBuy.value) return
  cart.addItem({
    id: props.productId,
    name: props.name,
    price: props.priceValue,
    priceFormatted: props.priceFormatted,
    preview: props.preview,
    link: props.link,
    stikers: props.stikers,
    article: props.article ?? undefined,
  })
}

function toggleWishlist() {
  if (isInWishlist.value) {
    wishlist.removeItem(props.productId)
  } else {
    wishlist.addItem({
      id: props.productId,
      name: props.name,
      price: props.priceValue,
      priceFormatted: props.priceFormatted,
      preview: props.preview,
      link: props.link,
      stikers: props.stikers,
      storeCount: availableInStoresCount.value,
    })
  }
}
</script>
