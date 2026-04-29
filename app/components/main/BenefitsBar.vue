<template>
  <section ref="containerRef" class="w-full">
    <template v-if="benefits.length">
      <div class="grid grid-cols-2 lg:grid-cols-5 gap-2">
        <NuxtLink
          v-for="benefit in benefits"
          :key="benefit.id"
          :to="benefit.links?.self ?? '#'"
          class="flex items-center gap-1.5 sm:gap-2 bg-white rounded-lg py-1.5 px-2 sm:py-2 sm:px-3 hover:shadow-md transition-shadow"
        >
          <div class="shrink-0 w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center">
            <img
              :src="imageBase + benefit.attributes.image"
              :alt="benefit.attributes.name"
              class="w-5 h-5 sm:w-6 sm:h-6 object-contain"
            />
          </div>
          <p class="text-[9px] sm:text-[11px] text-gray-600 leading-tight" v-html="benefit.attributes.text" />
        </NuxtLink>
      </div>
    </template>
    <SkeletonBenefitsBar v-else />
  </section>
</template>

<script setup lang="ts">
const containerRef = ref<HTMLElement | null>(null)
const benefits = ref<any[]>([])

const imageBase = useRuntimeConfig().public.apiBase as string
const { isVisible } = useLazySection(containerRef)

watch(isVisible, async (val) => {
  if (!val) return
  const res = await $fetch<any>('/api/include/mainpage/advantages/')
  benefits.value = res?.data ?? []
})
</script>
