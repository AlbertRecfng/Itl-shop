<template>
  <div ref="containerRef" class="relative w-full h-full rounded-lg overflow-hidden">
    <template v-if="slides.length">
      <swiper-container
        ref="swiperRef"
        init="false"
        style="width: 100%; height: 100%;"
      >
        <swiper-slide v-for="slide in slides" :key="slide.id" style="height: 100%;">
          <NuxtLink
            :to="slide.attributes.links.banner_link"
            class="block w-full h-full"
          >
            <img
              :src="imageBase + slide.attributes.images.preview"
              :alt="slide.attributes.text.title"
              class="w-full h-full object-cover"
            />
          </NuxtLink>
        </swiper-slide>
      </swiper-container>

      <div
        class="flex items-center gap-2"
        style="position: absolute; bottom: 16px; left: 32px; z-index: 9999; pointer-events: all;"
      >
        <button
          v-for="(_, index) in slides"
          :key="index"
          @click="goToSlide(index)"
          style="height: 6px; border-radius: 9999px; transition: width 0.3s; border: none; cursor: pointer; padding: 0;"
          :style="activeIndex === index
            ? { width: '24px', backgroundColor: '#3B82F6' }
            : { width: '5px', backgroundColor: '#93C5FD' }"
        />
      </div>
    </template>
    <SkeletonBanner v-else />
  </div>
</template>

<script setup lang="ts">
const containerRef = ref<HTMLElement | null>(null)
const swiperRef = ref<any>(null)
const activeIndex = ref(0)
const slides = ref<any[]>([])

const imageBase = useRuntimeConfig().public.apiBase as string
const { isVisible } = useLazySection(containerRef)

watch(isVisible, async (val) => {
  if (!val) return
  const res = await $fetch<any>('/api/include/banners/slider/')
  slides.value = res?.data ?? []
})

function goToSlide(index: number | string) {
  if (swiperRef.value?.swiper) {
    swiperRef.value.swiper.slideToLoop(Number(index))
  }
}

function initSwiper() {
  const el = swiperRef.value
  if (!el) return

  Object.assign(el, {
    slidesPerView: 1,
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    observer: true,
    observeParents: true,
    observeSlideChildren: true,
  })

  el.initialize()

  const checkSwiper = setInterval(() => {
    if (el.swiper) {
      el.swiper.on('slideChange', () => {
        activeIndex.value = el.swiper.realIndex
      })
      clearInterval(checkSwiper)
    }
  }, 50)
}

watch(slides, (val) => {
  if (!val.length) return
  nextTick(() => initSwiper())
})
</script>
