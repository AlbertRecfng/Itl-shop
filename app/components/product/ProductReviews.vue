<template>
  <div>
    <ProductReviewStats
      v-if="stats && (stats.rating || (stats.buckets?.length ?? 0))"
      class="mb-6 pb-6 border-b border-gray-100"
      :rating="stats.rating"
      :buckets="stats.buckets"
    />

    <div v-else-if="statsPending" class="mb-6 pb-6 border-b border-gray-100 animate-pulse">
      <div class="flex items-center gap-4 mb-4">
        <div class="h-10 w-20 bg-gray-200 rounded" />
        <div class="h-4 w-32 bg-gray-200 rounded" />
      </div>
      <div class="space-y-2">
        <div v-for="i in 5" :key="i" class="flex items-center gap-3">
          <div class="h-3 w-6 bg-gray-200 rounded" />
          <div class="h-2 flex-1 bg-gray-200 rounded-full" />
          <div class="h-3 w-8 bg-gray-200 rounded" />
        </div>
      </div>
    </div>

    <div v-if="pending && !reviews.length" class="space-y-4">
      <div v-for="i in 3" :key="i" class="animate-pulse">
        <div class="h-4 bg-gray-200 rounded w-32 mb-2" />
        <div class="h-3 bg-gray-100 rounded w-24 mb-3" />
        <div class="h-3 bg-gray-100 rounded w-full mb-1" />
        <div class="h-3 bg-gray-100 rounded w-5/6" />
      </div>
    </div>

    <div v-else-if="error" class="text-sm text-gray-500">
      Не удалось загрузить отзывы
    </div>

    <ul v-else-if="reviews.length" class="divide-y divide-gray-100">
      <li v-for="r in visibleReviews" :key="r.id">
        <ProductReviewItem :review="r.attributes" />
      </li>
    </ul>

    <p v-else class="text-sm text-gray-500">
      Пока никто не оставил отзыв на этот товар
    </p>

    <div v-if="reviews.length > visibleCount" class="mt-6 flex justify-center">
      <button
        type="button"
        class="px-5 py-2.5 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
        @click="visibleCount += pageSize"
      >
        Показать ещё
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
type Review = {
  id: number | string
  attributes: {
    created_at?: string
    author?: string
    rating: number
    text?: string
    advantages?: string
    disadvantages?: string
    bought?: boolean
    user_experience?: string
  }
}

type StatBucket = { id: number | string; attributes: { count: number } }

const props = defineProps<{
  slug: string
  csrf: string | null
  stats: { rating: number; buckets: StatBucket[] } | null
  statsPending?: boolean
}>()

const pageSize = 5
const visibleCount = ref(pageSize)
const reviews = ref<Review[]>([])
const pending = ref(true)
const error = ref(false)

const visibleReviews = computed(() => reviews.value.slice(0, visibleCount.value))

async function load() {
  if (!props.csrf || !props.slug) { pending.value = false; return }
  pending.value = true
  error.value = false
  try {
    const res = await $fetch<any>(`/api/catalog/${props.slug}/relationships/reviews/`, {
      params: { csrf: props.csrf },
    })
    const list = Array.isArray(res?.data) ? res.data : []
    reviews.value = list.sort((a: Review, b: Review) => {
      const ta = new Date(a.attributes?.created_at || 0).getTime()
      const tb = new Date(b.attributes?.created_at || 0).getTime()
      return tb - ta
    })
  } catch {
    error.value = true
  } finally {
    pending.value = false
  }
}

onMounted(load)
watch(() => [props.slug, props.csrf], load)
</script>
