<template>
  <section ref="containerRef" class="w-full bg-[#EEF3FA] pb-10 sm:pb-14 lg:pb-20">
    <div class="max-w-[1500px] mx-auto px-3 sm:px-4">
      <NuxtLink
        v-if="banner"
        to="#"
        class="block relative rounded-2xl overflow-hidden h-[120px] sm:h-[140px] lg:h-[160px] hover:shadow-lg transition-shadow"
      >
        <div class="absolute inset-0 bg-yellow-400" />

        <div class="absolute inset-0 wide-banner-image">
          <img
            :src="apiBase + banner.image"
            :alt="banner.title"
            class="w-full h-full object-contain object-right"
          />
        </div>

        <div class="relative z-10 flex items-center h-full px-4 sm:px-6 lg:px-10">
          <h3 class="text-base sm:text-xl lg:text-2xl font-bold max-w-[55%] sm:max-w-[45%] leading-snug" :style="{ color: banner.textColor }">
            {{ banner.title }}
          </h3>
        </div>
      </NuxtLink>
      <!-- скелетон -->
      <div
      v-else class="h-[120px] sm:h-[140px] lg:h-[160px] rounded-2xl bg-gray-200 animate-pulse" />
    </div>
  </section>
</template>

<script setup lang="ts">
const containerRef = ref<HTMLElement | null>(null)
const apiBase = useRuntimeConfig().public.apiBase

const { isVisible } = useLazySection(containerRef)

const banner = ref<{
  id: number
  title: string
  image: string
  textPosition: string
  textColor: string
} | null>(null)

watch(isVisible, async (val) => {
  if (!val) return
  try {
    const res = await $fetch<any>('/api/include/banners/wide/')
    const item = res?.data?.[0]
    if (!item) return

    const attr = item.attributes
    banner.value = {
      id: item.id,
      title: attr.text?.title || attr.name || '',
      image: attr.images?.desktop?.src || attr.images?.preview || '',
      textPosition: attr.styles?.text_positon || 'left',
      textColor: attr.styles?.text_color || '#000',
    }
  } catch (e) {
    console.error('Failed to load wide banner:', e)
  }
})
</script>

<style scoped>
.wide-banner-image {
  clip-path: polygon(62% 0, 100% 0, 100% 100%, 52% 150%);
}
</style>
