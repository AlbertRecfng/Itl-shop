<template>
  <section ref="containerRef" class="w-full bg-[#EEF3FA] pb-10 sm:pb-14 lg:pb-20">
    <div class="max-w-[1500px] mx-auto px-3 sm:px-4">
      <div class="flex items-center gap-2 mb-4 sm:mb-6">
        <h2 class="text-xl sm:text-2xl font-bold text-gray-900">Акции</h2>
        <NuxtLink to="#" class="text-gray-400 hover:text-gray-600 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </NuxtLink>
      </div>

      <div v-if="promotions.length" class="relative">
        <swiper-container
          ref="swiperRef"
          init="false"
          style="width: 100%; padding: 2px;"
        >
          <swiper-slide v-for="promo in promotions" :key="promo.id" style="height: auto;">
            <NuxtLink :to="promo.link" class="group block">
              <div class="relative rounded-2xl overflow-hidden h-[160px] sm:h-[180px] lg:h-[200px] bg-gray-100">
                <img
                  :src="apiBase + promo.image"
                  :alt="promo.name"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div class="absolute bottom-3 left-3 flex items-center gap-2">
                  <span
                    v-if="promo.discount"
                    class="bg-yellow-400 text-gray-900 text-xs font-bold px-2 py-1 rounded-full"
                  >
                    {{ promo.discount }}
                  </span>
                  <span
                    v-if="promo.period"
                    class="bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-orange-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"/>
                    </svg>
                    {{ promo.period }}
                  </span>
                </div>
              </div>
              <p class="mt-3 text-sm text-gray-800 group-hover:text-gray-600 transition-colors">
                {{ promo.name }}
              </p>
            </NuxtLink>
          </swiper-slide>
        </swiper-container>

        <button
          v-if="promotions.length > 2"
          @click="swiperRef?.swiper?.slideNext()"
          class="hidden sm:flex absolute -right-3 top-[90px] lg:top-[100px] -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-md items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>

        <button
          v-if="promotions.length > 2"
          @click="swiperRef?.swiper?.slidePrev()"
          class="hidden sm:flex absolute -left-3 top-[90px] lg:top-[100px] -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-md items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
      </div>
      <!-- скелетон -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        <div v-for="i in 4" :key="i">
          <div class="h-[160px] sm:h-[180px] lg:h-[200px] rounded-2xl bg-gray-200 animate-pulse" />
          <div class="mt-3 h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const containerRef = ref<HTMLElement | null>(null)
const apiBase = useRuntimeConfig().public.apiBase

const { isVisible } = useLazySection(containerRef)

interface Promotion {
  id: number
  name: string
  image: string
  discount: string
  link: string
  period: string
}

const promotions = ref<Promotion[]>([])
const swiperRef = ref<any>(null)

watch(isVisible, async (val) => {
  if (!val) return
  try {
    const res = await $fetch<any>('/api/include/mainpage/sale/')
    const items = res?.data ?? []

    promotions.value = items.map((item: any) => {
      const attr = item.attributes
      return {
        id: item.id,
        name: attr.name?.trim() || '',
        image: attr.images?.desktop?.src || attr.image || '',
        discount: attr.discount || '',
        link: item.links?.self || '#',
        period: attr.active_period || '',
      }
    })
  } catch (e) {
    console.error('Failed to load promotions:', e)
  }
})

function initSwiper() {
  const el = swiperRef.value
  if (!el) return

  Object.assign(el, {
    slidesPerView: 1,
    spaceBetween: 12,
    observer: true,
    observeParents: true,
    breakpoints: {
      640: { slidesPerView: 2, spaceBetween: 16 },
      1024: { slidesPerView: 3, spaceBetween: 20 },
      1280: { slidesPerView: 4, spaceBetween: 20 },
    },
  })

  el.initialize()
}

watch(promotions, () => {
  nextTick(() => initSwiper())
})
</script>
