<template>
  <section ref="containerRef" class="w-full bg-[#EEF3FA] pb-10 sm:pb-14 lg:pb-20">
    <div class="max-w-[1500px] mx-auto px-3 sm:px-4">
      <div v-if="banners.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
        <div
          v-for="banner in banners"
          :key="banner.id"
          class="relative rounded-2xl overflow-hidden h-[200px] sm:h-[240px] lg:h-[280px]"
        >
          <img
            :src="apiBase + banner.image"
            :alt="banner.title"
            class="absolute inset-0 w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div class="relative z-10 flex flex-col justify-end h-full p-4 sm:p-6">
            <span class="text-yellow-400 text-xs sm:text-sm font-semibold mb-1">{{ banner.category }}</span>
            <h3 class="text-white text-base sm:text-lg font-bold leading-snug mb-3 sm:mb-4 max-w-[85%]" v-html="banner.text" />
            <div class="flex flex-wrap gap-1.5 sm:gap-2">
              <NuxtLink
                v-for="tag in banner.tags"
                :key="tag.label"
                :to="tag.link"
                class="px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-medium rounded-full border border-white/60 text-white bg-white/10 backdrop-blur-sm hover:bg-white hover:text-gray-900 transition-colors"
              >
                {{ tag.label }}
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
      <!-- сккелетон -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
        <div v-for="i in 3" :key="i" class="h-[200px] sm:h-[240px] lg:h-[280px] rounded-2xl bg-gray-200 animate-pulse" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const containerRef = ref<HTMLElement | null>(null)
const apiBase = useRuntimeConfig().public.apiBase

const banners = ref<any[]>([])

const { isVisible } = useLazySection(containerRef)

watch(isVisible, async (val) => {
  if (!val) return
  try {
    const res = await $fetch<any>('/api/include/banners/banner-with-text/')
    const items = res?.data ?? []

    banners.value = items.map((item: any) => {
      const attr = item.attributes
      const buttons = attr.buttons || {}
      const tags = Object.values(buttons)
        .filter((b: any) => b.text)
        .map((b: any) => ({ label: b.text, link: b.link || '#' }))

      return {
        id: item.id,
        category: attr.text?.title || attr.name,
        text: attr.text?.text || '',
        image: attr.images?.preview || '',
        tags,
      }
    })
  } catch (e) {
    console.error('Failed to load promo banners:', e)
  }
})
</script>
