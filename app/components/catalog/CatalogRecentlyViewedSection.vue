<template>
  <section v-if="items.length" class="mt-10">
    <h2 class="text-lg sm:text-xl font-bold text-gray-900 mb-4">Вы смотрели</h2>

    <swiper-container
      :key="swiperKey"
      init="false"
      ref="swiperRef"
      style="width: 100%; padding-bottom: 4px;"
    >
      <swiper-slide v-for="item in items" :key="item.id" style="height: auto;">
        <NuxtLink
          :to="item.link"
          class="block bg-white rounded-xl p-3 hover:shadow-md transition-shadow h-full"
        >
          <img
            :src="imageBase + item.preview"
            :alt="item.name"
            class="w-full h-[120px] sm:h-[140px] object-contain mb-2"
          />
          <p class="text-xs sm:text-sm text-gray-800 font-medium leading-tight line-clamp-2 mb-2 min-h-[2rem]">
            {{ item.name }}
          </p>
          <div v-if="oldPrice(item)" class="text-xs text-gray-400 line-through">{{ oldPrice(item) }}</div>
          <div class="text-sm sm:text-base font-bold text-gray-900">{{ item.priceFormatted }}</div>
        </NuxtLink>
      </swiper-slide>
    </swiper-container>
  </section>
</template>

<script setup lang="ts">
const imageBase = useRuntimeConfig().public.apiBase as string
const { items } = useRecentlyViewed()
const swiperRef = ref<any>(null)
const swiperKey = computed(() => items.value.map(i => i.id).join('-'))

function oldPrice(item: { stikers: string[]; price: number }) {
  if (!item.stikers.includes('Акция')) return null
  const original = Math.round(item.price * 1.06)
  return original.toLocaleString('ru-RU') + ' \u20B8'
}

function initSwiper() {
  const el = swiperRef.value
  if (!el) return
  if (el.swiper) return

  Object.assign(el, {
    slidesPerView: 2,
    spaceBetween: 8,
    freeMode: true,
    observer: true,
    observeParents: true,
    breakpoints: {
      480: { slidesPerView: 3, spaceBetween: 12 },
      768: { slidesPerView: 4, spaceBetween: 16 },
      1024: { slidesPerView: 5, spaceBetween: 16 },
      1280: { slidesPerView: 6, spaceBetween: 16 },
    },
  })

  el.initialize()
}

function scheduleInit() {
  if (typeof requestAnimationFrame === 'undefined') {
    initSwiper()
    return
  }
  requestAnimationFrame(() => requestAnimationFrame(() => initSwiper()))
}

onMounted(() => scheduleInit())

watch(swiperKey, () => scheduleInit(), { flush: 'post' })
</script>
