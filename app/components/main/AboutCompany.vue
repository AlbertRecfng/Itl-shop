<template>
  <section ref="containerRef" class="w-full bg-[#EEF3FA] pb-10 sm:pb-14 lg:pb-20">
    <div class="max-w-[1500px] mx-auto px-3 sm:px-4">
      <div v-if="company" class="bg-white rounded-2xl overflow-hidden flex flex-col md:flex-row border-2 border-blue-200 min-h-0 md:min-h-[340px]">
        <div class="flex-1 p-6 sm:p-8 lg:p-12 flex flex-col justify-center">
          <h2 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-5">{{ company.name }}</h2>
          <p class="text-gray-600 text-sm sm:text-base leading-relaxed mb-5 sm:mb-8">{{ company.text }}</p>
          <div>
            <NuxtLink
              :to="company.link"
              class="inline-block px-5 sm:px-7 py-2.5 sm:py-3 text-sm sm:text-base font-medium rounded-full bg-yellow-400 text-gray-900 hover:bg-yellow-500 transition-colors"
            >
              Подробнее
            </NuxtLink>
          </div>
        </div>
        <div class="w-full md:w-[55%] shrink-0 h-[200px] sm:h-[250px] md:h-auto">
          <img
            :src="apiBase + company.image"
            :alt="company.name"
            class="w-full h-full object-cover"
          />
        </div>
      </div>
      <!-- скелетон -->
      <div v-else class="bg-white rounded-2xl h-[250px] sm:h-[300px] animate-pulse" />
    </div>
  </section>
</template>

<script setup lang="ts">
const containerRef = ref<HTMLElement | null>(null)
const apiBase = useRuntimeConfig().public.apiBase

const { isVisible } = useLazySection(containerRef)

const company = ref<{
  name: string
  text: string
  image: string
  link: string
} | null>(null)

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

watch(isVisible, async (val) => {
  if (!val) return
  try {
    const res = await $fetch<any>('/api/company/')
    const item = res?.data?.[0]
    if (!item) return

    const attr = item.attributes
    company.value = {
      name: attr.name || '',
      text: stripHtml(attr.preview_text || ''),
      image: attr.images?.detail || attr.images?.preview || '',
      link: item.links?.self || '/company/',
    }
  } catch (e) {
    console.error('Failed to load company info:', e)
  }
})
</script>
