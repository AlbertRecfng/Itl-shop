<template>
  <section ref="containerRef" class="w-full bg-[#EEF3FA] pb-10 sm:pb-14 lg:pb-20">
    <div class="max-w-[1500px] mx-auto px-3 sm:px-4">
      <template v-if="allProducts.length">
        <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
          <h2 class="text-xl sm:text-2xl font-bold text-gray-900">Распродажа</h2>
          <div class="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            <button
              v-for="tab in visibleTabs"
              :key="tab.key"
              @click="activeCategory = tab.key"
              class="px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-medium rounded-full transition-colors whitespace-nowrap"
              :class="activeCategory === tab.key
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'"
            >
              {{ tab.label }}
            </button>
          </div>
        </div>

        <div class="relative">
          <swiper-container
            :key="activeCategory"
            ref="swiperRef"
            init="false"
            style="width: 100%; padding: 2px;"
          >
            <swiper-slide v-for="product in filteredProducts" :key="product.id" style="height: auto;">
              <CatalogProductCard :product="product" :review="getReview(product.id)" />
            </swiper-slide>
          </swiper-container>

          <button
            v-if="filteredProducts.length > 2"
            @click="swiperRef?.swiper?.slideNext()"
            class="hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-md items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>

          <button
            v-if="filteredProducts.length > 2"
            @click="swiperRef?.swiper?.slidePrev()"
            class="hidden sm:flex absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-md items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
        </div>
      </template>
      <SkeletonBestsellers v-else />
    </div>
  </section>
</template>

<script setup lang="ts">
const containerRef = ref<HTMLElement | null>(null)
const swiperRef = ref<any>(null)
const activeCategory = ref('all')

const categories = ref<{ id: string; name: string; slug: string; fetchUrl: string }[]>([])
const allProducts = ref<any[]>([])
const allReviews = ref<any[]>([])
const categoryMap = ref<Record<string, string[]>>({})

const { isVisible } = useLazySection(containerRef)

watch(isVisible, async (val) => {
  if (!val) return

  const res = await $fetch<any>('/api/include/mainpage/hit/stock/')
  const cats = (res?.data ?? []).map((item: any) => ({
    id: item.id,
    name: item.attributes.name.trim(),
    slug: item.id,
    fetchUrl: item.links.self,
  }))
  categories.value = cats

  const results = await Promise.all(
    cats.map((cat: any) =>
      $fetch<any>(`/api${cat.fetchUrl}`)
        .then(r => ({ slug: cat.slug, data: r?.data ?? [], reviews: r?.included?.['reviews-statistics'] ?? [] }))
        .catch(() => ({ slug: cat.slug, data: [], reviews: [] }))
    )
  )

  const products: any[] = []
  const reviews: any[] = []
  const catMap: Record<string, string[]> = {}
  const seenIds = new Set<number>()

  for (const result of results) {
    const ids: string[] = []
    for (const product of result.data) {
      if (!seenIds.has(product.id)) {
        seenIds.add(product.id)
        products.push(product)
      }
      ids.push(String(product.id))
    }
    catMap[result.slug] = ids
    reviews.push(...result.reviews)
  }

  allProducts.value = products
  allReviews.value = reviews
  categoryMap.value = catMap
})

const visibleTabs = computed(() => {
  const tabs = [{ key: 'all', label: 'Все категории' }]
  for (const cat of categories.value) {
    if (categoryMap.value[cat.slug]?.length) {
      tabs.push({ key: cat.slug, label: cat.name })
    }
  }
  return tabs
})

const filteredProducts = computed(() => {
  if (activeCategory.value === 'all') return allProducts.value
  const ids = categoryMap.value[activeCategory.value] ?? []
  return allProducts.value.filter(p => ids.includes(String(p.id)))
})

function getReview(productId: number) {
  return allReviews.value.find((r: any) => r.id === productId) ?? null
}

function initSwiper() {
  const el = swiperRef.value
  if (!el) return

  Object.assign(el, {
    slidesPerView: 2,
    spaceBetween: 8,
    observer: true,
    observeParents: true,
    breakpoints: {
      640: { slidesPerView: 3, spaceBetween: 12 },
      1024: { slidesPerView: 4, spaceBetween: 16 },
      1280: { slidesPerView: 5, spaceBetween: 16 },
    },
  })

  el.initialize()
}

watch(filteredProducts, () => {
  nextTick(() => initSwiper())
})
</script>
