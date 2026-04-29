<template>
  <section ref="containerRef" class="w-full bg-[#EEF3FA] pb-10 sm:pb-14 lg:pb-20">
    <div class="max-w-[1500px] mx-auto px-3 sm:px-4">
      <h2 class="text-base sm:text-lg font-medium text-gray-700 mb-3 sm:mb-4">Популярные бренды</h2>
      <div v-if="brands.length" class="relative">
        <swiper-container
          ref="swiperRef"
          init="false"
          style="width: 100%;"
        >
          <swiper-slide v-for="brand in brands" :key="brand.id">
            <NuxtLink
              :to="brand.url"
              class="flex items-center justify-center h-[80px] bg-[#F0F2F8] rounded-xl hover:shadow-md transition-shadow"
            >
              <img
                :src="apiBase + brand.image"
                :alt="brand.name"
                class="max-h-[40px] max-w-[100px] object-contain"
              />
            </NuxtLink>
          </swiper-slide>
        </swiper-container>

      </div>
      <!-- скелетон -->
      <div v-else class="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-8 gap-3 sm:gap-4">
        <div v-for="i in 8" :key="i" class="h-[60px] sm:h-[80px] rounded-xl bg-gray-200 animate-pulse" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const containerRef = ref<HTMLElement | null>(null)
const apiBase = useRuntimeConfig().public.apiBase
const swiperRef = ref<any>(null)
const brands = ref<any[]>([])

const { isVisible } = useLazySection(containerRef)

function initSwiper() {
  const el = swiperRef.value
  if (!el) return
  Object.assign(el, {
    slidesPerView: 3,
    spaceBetween: 8,
    loop: true,
    speed: 3000,
    autoplay: {
      delay: 0,
      disableOnInteraction: false,
    },
    allowTouchMove: true,
    observer: true,
    observeParents: true,
    breakpoints: {
      480: { slidesPerView: 4, spaceBetween: 12 },
      640: { slidesPerView: 5, spaceBetween: 12 },
      1024: { slidesPerView: 7, spaceBetween: 16 },
      1280: { slidesPerView: 8, spaceBetween: 16 },
    },
  })
  el.initialize()
}

watch(isVisible, async (val) => {
  if (!val) return
  try {
    const res = await $fetch<any>('/api/include/mainpage/brands/')
    brands.value = (res?.data ?? []).map((item: any) => ({
      id: item.id,
      name: item.attributes.main_page?.name || item.attributes.name,
      image: item.attributes.main_page?.image || item.attributes.detail_page?.images?.preview || '',
      url: item.attributes.main_page?.url || item.links?.self || '#',
    }))
    nextTick(() => initSwiper())
  } catch (e) {
    console.error('Failed to load brands:', e)
  }
})
</script>

<style scoped>
swiper-container::part(wrapper) {
  transition-timing-function: linear;
}
</style>
