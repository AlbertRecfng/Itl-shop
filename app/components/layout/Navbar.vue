<template>
  <header class="bg-white w-full shadow-sm">
    <div class="w-full px-4 md:px-6 flex items-center gap-3 md:gap-4 h-[56px] md:h-[64px]">
      <NuxtLink to="/" class="flex items-center gap-2 min-w-[100px] md:min-w-[140px]">
        <div class="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center">
            <img src="/images/logo.png" alt="Logo" class="w-8 h-8 md:w-9 md:h-9 object-contain" />
        </div>
        <div class="leading-tight hidden sm:block">
          <div class="text-sm font-light text-black-500">itlb2c</div>
          <div class="text-[10px] text-black-400">Готовый интернет-магазин</div>
        </div>
      </NuxtLink>

      <button
        type="button"
        class="hidden md:flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium text-sm px-4 h-10 rounded whitespace-nowrap transition-colors"
        @click="catalogModal.open()"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        Каталог товаров
      </button>

      <div class="flex-1 relative">
        <input
          type="text"
          placeholder="Искать товар со скидками до 50%"
          class="w-full h-9 md:h-10 border border-blue-300 rounded px-3 md:px-4 pr-9 text-sm text-blue-600 placeholder-blue-400 outline-none focus:border-blue-400"
        />
        <button class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
        </button>
      </div>

      <div class="flex items-center gap-3 md:gap-5">
        <button class="hidden sm:flex items-center gap-1.5 text-sm text-blue-500 hover:text-blue-600 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Войти
        </button>

        <NuxtLink to="/wishlist" class="relative flex items-center gap-1 md:gap-1.5 text-sm text-blue-500 hover:text-blue-600 transition-colors">
          <div class="relative">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span class="absolute -top-1.5 -right-1.5 bg-yellow-400 text-gray-900 text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">{{ wishlistCount }}</span>
          </div>
          <span class="hidden md:inline">Избранное</span>
        </NuxtLink>

        <NuxtLink to="/cart" class="relative flex items-center gap-1 md:gap-1.5 text-sm text-blue-500 hover:text-blue-600 transition-colors">
          <div class="relative">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span class="absolute -top-1.5 -right-1.5 bg-yellow-400 text-gray-900 text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">{{ cartCount }}</span>
          </div>
          {{ cartTotal }} ₸
        </NuxtLink>
      </div>
    </div>

    <div class="border-t border-gray-100 w-full">
      <div class="w-full px-4 md:px-6">
        <ul
          ref="menuRef"
          class="flex items-center gap-4 md:gap-[53px] h-10 text-sm overflow-x-auto whitespace-nowrap scrollbar-hide select-none cursor-grab"
          :class="{ 'cursor-grabbing': dragging }"
          @pointerdown="onPointerDown"
          @pointermove="onPointerMove"
          @pointerup="onPointerUp"
          @pointerleave="onPointerUp"
          @pointercancel="onPointerUp"
          @click.capture="onClickCapture"
        >
          <li class="md:hidden">
            <button
              type="button"
              class="flex items-center gap-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium text-xs px-3 h-7 rounded whitespace-nowrap transition-colors"
              @click="catalogModal.open()"
            >
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              Каталог
            </button>
          </li>
          <li v-for="item in menuItems" :key="item.id">
            <NuxtLink
              :to="item.links.self"
              class="transition-colors"
              :style="item.attributes.bg ? `color: ${item.attributes.bg}` : ''"
              :class="item.attributes.bg ? '' : 'text-blue-500 hover:text-blue-600'"
            >
              {{ item.attributes.name.trim() }}
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const { count: cartCount, total: cartTotal } = useCart()
const { count: wishlistCount } = useWishlist()
const catalogModal = useCatalogModal()

const { data: menuData } = await useFetch('/include/menu/main/', {
  baseURL: useRuntimeConfig().public.apiBase as string,
})

const menuItems = computed(() => (menuData.value as any)?.data ?? [])

const menuRef = ref<HTMLElement | null>(null)
const dragging = ref(false)
let startX = 0
let startScroll = 0
let moved = 0

function onPointerDown(e: PointerEvent) {
  if (e.pointerType !== 'mouse') return
  const el = menuRef.value
  if (!el) return
  dragging.value = true
  moved = 0
  startX = e.pageX
  startScroll = el.scrollLeft
}

function onPointerMove(e: PointerEvent) {
  if (!dragging.value) return
  const el = menuRef.value
  if (!el) return
  const dx = e.pageX - startX
  moved = Math.abs(dx)
  el.scrollLeft = startScroll - dx
}

function onPointerUp() {
  if (!dragging.value) return
  dragging.value = false
}

function onClickCapture(e: MouseEvent) {
  if (moved > 4) {
    e.preventDefault()
    e.stopPropagation()
  }
}

function onWheel(e: WheelEvent) {
  const el = menuRef.value
  if (!el) return
  if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return
  if (el.scrollWidth <= el.clientWidth) return
  e.preventDefault()
  el.scrollLeft += e.deltaY
}

onMounted(() => {
  menuRef.value?.addEventListener('wheel', onWheel, { passive: false })
})
onBeforeUnmount(() => {
  menuRef.value?.removeEventListener('wheel', onWheel)
})
</script>
