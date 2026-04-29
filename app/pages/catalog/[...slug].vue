<template>
  <ProductPage v-if="pageType === 'product' && slug" :slug="slug" :api-data="apiData" />
  <CatalogPage v-else-if="pageType === 'category' && slug" :slug="slug" :api-data="apiData" />
  <div v-else-if="error" class="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-20">
    <div class="bg-white rounded-xl p-8 sm:p-12 text-center max-w-lg mx-auto">
      <p class="text-gray-700 text-base sm:text-lg mb-2">Не удалось загрузить страницу</p>
      <p class="text-sm text-gray-500 mb-5">Возможно, раздел или товар недоступен. Проверьте ссылку или попробуйте ещё раз.</p>
      <div class="flex items-center justify-center gap-2">
        <NuxtLink
          to="/catalog"
          class="bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 text-sm px-4 py-2.5 rounded transition-colors"
        >
          В каталог
        </NuxtLink>
        <button
          class="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium text-sm px-5 py-2.5 rounded transition-colors"
          @click="loadPage"
        >
          Повторить
        </button>
      </div>
    </div>
  </div>
  <div v-else class="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 pt-10">
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3">
      <div v-for="i in 12" :key="i" class="bg-white rounded-xl p-3 animate-pulse">
        <div class="h-[140px] sm:h-[170px] lg:h-[200px] bg-gray-200 rounded mb-3" />
        <div class="h-3 bg-gray-200 rounded w-12 mb-2" />
        <div class="h-4 bg-gray-200 rounded w-full mb-1" />
        <div class="h-4 bg-gray-200 rounded w-3/4 mb-2" />
        <div class="h-3 bg-gray-200 rounded w-28 mb-3" />
        <div class="h-5 bg-gray-200 rounded w-24 mb-3" />
        <div class="flex gap-2">
          <div class="h-8 w-24 bg-gray-200 rounded-lg" />
          <div class="h-8 w-8 bg-gray-200 rounded-lg" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

const slug = computed(() => {
  const params = route.params.slug
  return Array.isArray(params) ? params.join('/') : params
})

const pageType = ref<'product' | 'category' | null>(null)
const apiData = ref<any>({ catRes: null, bannerRes: null })
const error = ref(false)

watch(slug, () => loadPage(), { immediate: true })

async function loadPage() {
  pageType.value = null
  error.value = false

  const filterQuery = new URLSearchParams(route.query as Record<string, string>).toString()
  const separator = filterQuery ? '&' : ''

  const [catRes, bannerRes] = await Promise.all([
    $fetch<any>(`/api/catalog/${slug.value}/?include=items,filter,reviews-statistics,sections${separator}${filterQuery}`).catch(() => null),
    $fetch<any>('/api/include/banners/wide-catalog/').catch(() => null),
  ])

  const data = catRes?.data
  if (!data) {
    error.value = true
    return
  }

  const isProduct = data?.attributes && 'images' in data.attributes && 'properties' in data.attributes

  apiData.value = { catRes, bannerRes }
  pageType.value = isProduct ? 'product' : 'category'
}
</script>
