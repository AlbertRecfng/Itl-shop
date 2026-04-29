<template>
  <div class="flex gap-3">
    <div v-if="slides.length > 1" class="hidden sm:flex flex-col gap-2 w-[72px] shrink-0 max-h-[500px] overflow-y-auto scrollbar-hide">
      <button
        v-for="(slide, idx) in slides"
        :key="idx"
        type="button"
        class="w-full h-[72px] bg-white rounded-lg border-2 overflow-hidden shrink-0 transition-colors"
        :class="activeIndex === idx ? 'border-blue-500' : 'border-gray-100 hover:border-gray-300'"
        @click="goToSlide(idx)"
      >
        <div v-if="slide.type === 'video'" class="relative w-full h-full bg-gray-100 flex items-center justify-center">
          <svg class="w-6 h-6 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
        <img v-else :src="slide.src" :alt="slide.alt" class="w-full h-full object-contain p-1" />
      </button>
    </div>

    <div class="flex-1 min-w-0 bg-white rounded-xl relative">
      <swiper-container ref="swiperRef" init="false" style="width: 100%;">
        <swiper-slide v-for="(slide, idx) in slides" :key="idx">
          <div class="w-full h-[320px] sm:h-[420px] lg:h-[500px] flex items-center justify-center p-4">
            <video
              v-if="slide.type === 'video'"
              :src="slide.src"
              class="max-w-full max-h-full"
              controls
              preload="metadata"
            />
            <img
              v-else
              :src="slide.src"
              :alt="slide.alt"
              class="max-w-full max-h-full object-contain"
            />
          </div>
        </swiper-slide>
      </swiper-container>

      <div v-if="slides.length > 1" class="sm:hidden flex items-center justify-center gap-1.5 py-2">
        <button
          v-for="(_, idx) in slides"
          :key="idx"
          type="button"
          class="h-1.5 rounded-full transition-all"
          :class="activeIndex === idx ? 'w-5 bg-blue-500' : 'w-1.5 bg-gray-300'"
          @click="goToSlide(idx)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
type Slide = { type: 'image' | 'video'; src: string; alt: string }

const props = defineProps<{
  images: { preview?: { src: string }; detail?: { src: string }; more?: { src: string; alt?: string }[] } | null
  video?: { src: string }[] | null
  name?: string
}>()

const imageBase = useRuntimeConfig().public.apiBase as string
const swiperRef = ref<any>(null)
const activeIndex = ref(0)

const slides = computed<Slide[]>(() => {
  const result: Slide[] = []
  const detail = props.images?.detail?.src
  if (detail) {
    result.push({ type: 'image', src: imageBase + detail, alt: props.name ?? '' })
  }
  for (const img of props.images?.more ?? []) {
    result.push({ type: 'image', src: imageBase + img.src, alt: img.alt || props.name || '' })
  }
  for (const v of props.video ?? []) {
    if (v?.src) result.push({ type: 'video', src: imageBase + v.src, alt: props.name ?? '' })
  }
  return result
})

function goToSlide(idx: number) {
  const el = swiperRef.value
  if (el?.swiper) el.swiper.slideTo(idx)
}

function initSwiper() {
  const el = swiperRef.value
  if (!el) return

  Object.assign(el, {
    slidesPerView: 1,
    spaceBetween: 0,
    observer: true,
    observeParents: true,
  })
  el.initialize()

  const check = setInterval(() => {
    if (el.swiper) {
      el.swiper.on('slideChange', () => {
        activeIndex.value = el.swiper.activeIndex
      })
      clearInterval(check)
    }
  }, 50)
}

watch(slides, (val) => {
  if (!val.length) return
  nextTick(() => initSwiper())
}, { immediate: true })
</script>
