<template>
  <section>
    <h2 class="text-lg sm:text-xl font-bold text-gray-900 mb-4">{{ title }}</h2>

    <swiper-container
      init="false"
      ref="swiperRef"
      style="width: 100%; padding-bottom: 4px;"
    >
      <swiper-slide v-for="item in items" :key="item.id" style="height: auto;">
        <CatalogProductCard :product="item" :review="null" />
      </swiper-slide>
    </swiper-container>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string
  items: any[]
}>()

const swiperRef = ref<any>(null)

function initSwiper() {
  const el = swiperRef.value
  if (!el) return

  Object.assign(el, {
    slidesPerView: 2,
    spaceBetween: 8,
    freeMode: true,
    observer: true,
    observeParents: true,
    breakpoints: {
      480: { slidesPerView: 3, spaceBetween: 12 },
      768: { slidesPerView: 4, spaceBetween: 16 },
      1024: { slidesPerView: 5, spaceBetween: 16 },
      1280: { slidesPerView: 5, spaceBetween: 16 },
    },
  })

  el.initialize()
}

onMounted(() => {
  nextTick(() => initSwiper())
})

watch(() => props.items, () => {
  nextTick(() => initSwiper())
})
</script>
