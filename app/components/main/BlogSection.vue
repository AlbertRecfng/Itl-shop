<template>
  <section ref="containerRef" class="w-full bg-[#EEF3FA] pb-10 sm:pb-14 lg:pb-20">
    <div class="max-w-[1500px] mx-auto px-3 sm:px-4">
      <div class="flex items-center gap-2 mb-4 sm:mb-6">
        <h2 class="text-xl sm:text-2xl font-bold text-gray-900">Блог</h2>
        <NuxtLink to="#" class="text-gray-400 hover:text-gray-600 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </NuxtLink>
      </div>

      <div v-if="articles.length" class="relative">
        <swiper-container
          ref="swiperRef"
          init="false"
          style="width: 100%; padding: 2px;"
        >
          <swiper-slide v-for="article in articles" :key="article.id" style="height: auto;">
            <NuxtLink :to="article.link" class="group block">
              <div class="relative rounded-2xl overflow-hidden h-[200px] sm:h-[220px] lg:h-[240px]">
                <img
                  :src="apiBase + article.image"
                  :alt="article.title"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-16 pb-5 px-5">
                  <h3 class="text-white text-sm sm:text-base lg:text-lg font-bold leading-snug">
                    {{ article.title }}
                  </h3>
                </div>
              </div>
              <p class="mt-3 text-sm text-gray-600 line-clamp-2">
                {{ article.description }}
              </p>
            </NuxtLink>
          </swiper-slide>
        </swiper-container>

        <button
          v-if="articles.length > 2"
          @click="swiperRef?.swiper?.slideNext()"
          class="hidden sm:flex absolute -right-3 top-[110px] lg:top-[120px] -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-md items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>

        <button
          v-if="articles.length > 2"
          @click="swiperRef?.swiper?.slidePrev()"
          class="hidden sm:flex absolute -left-3 top-[110px] lg:top-[120px] -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-md items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
      </div>
      <!-- скелетон -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        <div v-for="i in 4" :key="i">
          <div class="h-[200px] sm:h-[220px] lg:h-[240px] rounded-2xl bg-gray-200 animate-pulse" />
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

interface Article {
  id: number
  title: string
  image: string
  link: string
  description: string
}

const articles = ref<Article[]>([])
const swiperRef = ref<any>(null)

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

watch(isVisible, async (val) => {
  if (!val) return
  try {
    const res = await $fetch<any>('/api/include/mainpage/blog/')
    const items = res?.data ?? []

    const detailed = await Promise.all(
      items.map((item: any) =>
        $fetch<any>(`/api${item.links.self}`)
          .then(r => ({
            id: item.id,
            title: item.attributes.title || r?.data?.attributes?.name || '',
            image: item.attributes.image || '',
            link: item.links.self || '#',
            description: stripHtml(r?.data?.attributes?.description || ''),
          }))
          .catch(() => ({
            id: item.id,
            title: item.attributes.title || '',
            image: item.attributes.image || '',
            link: item.links.self || '#',
            description: '',
          }))
      )
    )

    articles.value = detailed
  } catch (e) {
    console.error('Failed to load blog:', e)
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

watch(articles, () => {
  nextTick(() => initSwiper())
})
</script>
