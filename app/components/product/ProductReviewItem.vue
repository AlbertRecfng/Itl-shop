<template>
  <article class="py-5 first:pt-0 last:pb-0">
    <div class="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2">
      <span class="font-semibold text-gray-900">{{ review.author || 'Аноним' }}</span>
      <span v-if="review.bought" class="inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
        <svg viewBox="0 0 20 20" fill="currentColor" class="w-3 h-3"><path fill-rule="evenodd" d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0l-3.5-3.5a1 1 0 011.4-1.4L8.5 12 15.3 5.3a1 1 0 011.4 0z" clip-rule="evenodd"/></svg>
        Купил товар
      </span>
      <span class="text-xs text-gray-400 ml-auto">{{ dateLabel }}</span>
    </div>

    <div class="flex flex-wrap items-center gap-x-4 gap-y-1 mb-3">
      <ProductRating :value="review.rating" size="sm" />
      <span v-if="review.user_experience" class="text-xs text-gray-500">Опыт использования: {{ review.user_experience }}</span>
    </div>

    <p v-if="review.text" class="text-sm text-gray-800 leading-relaxed whitespace-pre-line">{{ review.text }}</p>

    <div v-if="review.advantages || review.disadvantages" class="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div v-if="review.advantages" class="text-sm">
        <div class="text-green-700 font-medium mb-1">Достоинства</div>
        <div class="text-gray-700 whitespace-pre-line">{{ review.advantages }}</div>
      </div>
      <div v-if="review.disadvantages" class="text-sm">
        <div class="text-red-700 font-medium mb-1">Недостатки</div>
        <div class="text-gray-700 whitespace-pre-line">{{ review.disadvantages }}</div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
type Review = {
  created_at?: string
  author?: string
  rating: number
  text?: string
  advantages?: string
  disadvantages?: string
  bought?: boolean
  user_experience?: string
}

const props = defineProps<{ review: Review }>()

const dateLabel = computed(() => {
  const raw = props.review.created_at
  if (!raw) return ''
  const d = new Date(raw)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
})
</script>
