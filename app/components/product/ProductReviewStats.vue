<template>
  <div class="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-6 sm:gap-10 items-center">
    <div class="text-center sm:text-left">
      <div class="text-4xl font-bold text-gray-900 leading-none mb-2">{{ ratingFormatted }}</div>
      <ProductRating :value="rating" size="md" />
      <div class="mt-2 text-sm text-gray-500">{{ totalLabel }}</div>
    </div>

    <div class="space-y-1.5">
      <div v-for="row in rows" :key="row.star" class="flex items-center gap-3 text-sm">
        <span class="w-4 text-gray-500">{{ row.star }}</span>
        <svg viewBox="0 0 20 20" fill="currentColor" class="w-3.5 h-3.5 text-amber-400 shrink-0">
          <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.2 1 5.8L10 15l-5.3 2.8 1-5.8L1.4 7.7l5.9-.9L10 1.5z"/>
        </svg>
        <div class="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div class="h-full bg-amber-400 rounded-full transition-all" :style="{ width: row.pct + '%' }" />
        </div>
        <span class="w-8 text-right text-gray-500 tabular-nums">{{ row.count }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
type StatBucket = { id: number | string; attributes: { count: number } }

const props = defineProps<{
  rating: number
  buckets: StatBucket[] | null
}>()

const ratingFormatted = computed(() => (Number(props.rating) || 0).toFixed(2))

const counts = computed(() => {
  const map: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  for (const b of props.buckets ?? []) {
    const star = Number(b.id)
    if (star >= 1 && star <= 5) map[star] = Number(b.attributes?.count) || 0
  }
  return map
})

const total = computed(() => Object.values(counts.value).reduce((s, n) => s + n, 0))

const totalLabel = computed(() => {
  const n = total.value
  const mod10 = n % 10, mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return `${n} отзыв`
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${n} отзыва`
  return `${n} отзывов`
})

const rows = computed(() => {
  const max = Math.max(1, ...Object.values(counts.value))
  return [5, 4, 3, 2, 1].map(star => ({
    star,
    count: counts.value[star]!,
    pct: (counts.value[star]! / max) * 100,
  }))
})
</script>
