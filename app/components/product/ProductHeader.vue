<template>
  <div class="mb-4">
    <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3">{{ name }}</h1>

    <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
      <div v-if="displayBadges.length" class="flex flex-wrap gap-1.5">
        <span
          v-for="(badge, i) in displayBadges"
          :key="i"
          class="text-[11px] font-semibold px-2 py-1 rounded"
          :class="badge.color"
        >
          {{ badge.label }}
        </span>
      </div>

      <span v-if="article" class="text-gray-500">Артикул: <span class="text-gray-700">{{ article }}</span></span>

      <button
        v-if="rating && rating > 0"
        type="button"
        class="flex items-center gap-2 hover:opacity-80 transition-opacity"
        @click="$emit('goto-reviews')"
      >
        <ProductRating :value="rating" size="sm" show-value />
        <span v-if="reviewsCount" class="text-gray-500 border-b border-dashed border-gray-400">
          {{ reviewsLabel }}
        </span>
      </button>

      <div v-else-if="ratingPending" class="flex items-center gap-2 animate-pulse" aria-hidden="true">
        <div class="h-4 w-20 bg-gray-200 rounded" />
        <div class="h-4 w-16 bg-gray-200 rounded" />
      </div>

      <NuxtLink
        v-if="brand"
        :to="brand.links?.self ?? '#'"
        class="ml-auto flex items-center gap-2 hover:opacity-80 transition-opacity"
      >
        <img
          v-if="brand.attributes?.images?.preview"
          :src="imageBase + brand.attributes.images.preview"
          :alt="brand.attributes?.name ?? ''"
          class="h-7 object-contain"
        />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  name: string
  stickers?: string[]
  article?: string | null
  brand?: any
  rating?: number | null
  reviewsCount?: number | null
  ratingPending?: boolean
}>()

defineEmits<{ (e: 'goto-reviews'): void }>()

const imageBase = useRuntimeConfig().public.apiBase as string

const reviewsLabel = computed(() => {
  const n = Number(props.reviewsCount) || 0
  if (!n) return ''
  const mod10 = n % 10, mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return `${n} отзыв`
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${n} отзыва`
  return `${n} отзывов`
})

const badgeMap: Record<string, { label: string; color: string }> = {
  'Хит': { label: 'Хит продаж', color: 'bg-[#0E6CDD] text-white' },
  'Акция': { label: 'Скидка', color: 'bg-[#E31E24] text-white' },
  'Новинка': { label: 'Новинка', color: 'bg-[#FB6340] text-white' },
  'Советуем': { label: 'Товар недели', color: 'bg-[#5F2580] text-white' },
}

const displayBadges = computed(() => {
  return (props.stickers ?? [])
    .map(s => badgeMap[s])
    .filter((b): b is { label: string; color: string } => !!b)
})
</script>
