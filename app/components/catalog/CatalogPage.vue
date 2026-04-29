<template>
  <div class="w-full">
    <div v-if="banner" class="w-full bg-blue-50 relative overflow-hidden">
      <div class="max-w-[1500px] mx-auto flex items-center justify-between h-[80px] sm:h-[100px] lg:h-[120px] px-4 sm:px-6 lg:px-8">
        <p
          class="text-sm sm:text-lg lg:text-xl font-bold max-w-[50%] leading-snug"
          :style="{ color: banner.attributes.styles.text_color }"
        >
          {{ banner.attributes.text.title }}
        </p>
        <img
          :src="imageBase + banner.attributes.images.desktop.src"
          :alt="banner.attributes.name"
          class="h-full object-contain"
        />
      </div>
    </div>

    <div class="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8">
      <nav class="flex items-center text-xs text-gray-400 mb-4 overflow-x-auto whitespace-nowrap scrollbar-hide">
        <template v-for="(crumb, idx) in fullBreadcrumbs" :key="idx">
          <span v-if="idx > 0" class="mx-1.5">/</span>
          <span v-if="idx === fullBreadcrumbs.length - 1" class="text-gray-900 font-medium">{{ crumb.name }}</span>
          <NuxtLink v-else :to="crumb.link" class="hover:text-gray-600 transition-colors">{{ crumb.name }}</NuxtLink>
        </template>
      </nav>

      <h1 class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-5">
        {{ categoryName }}
        <span v-if="totalCount" class="text-gray-400 font-normal ml-1">—&nbsp;&nbsp;{{ totalCount }}</span>
      </h1>

      <div v-if="sections.length" class="flex gap-3 mb-6 overflow-x-auto scrollbar-hide pb-1">
        <NuxtLink
          v-for="sec in sections"
          :key="sec.id"
          :to="sec.links?.self ?? '#'"
          class="shrink-0 flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-4 py-2.5 hover:shadow-sm transition-shadow"
        >
          <img
            v-if="sec.attributes?.img"
            :src="imageBase + sec.attributes.img"
            :alt="sec.attributes.name"
            class="w-8 h-8 object-contain"
          />
          <div>
            <p class="text-sm font-medium text-gray-800">{{ sec.attributes.name }}</p>
            <p v-if="sec.attributes.count" class="text-xs text-gray-400">{{ sec.attributes.count }} {{ productWord(sec.attributes.count) }}</p>
          </div>
        </NuxtLink>
      </div>

      <div class="flex items-center justify-between mb-5 gap-3 flex-wrap">
        <div class="flex items-center gap-3">
          <button
            class="lg:hidden flex items-center gap-1.5 text-sm text-gray-600 bg-white border border-gray-200 px-3 py-2 rounded-lg"
            @click="showFilters = true"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Фильтры
          </button>

          <div class="relative">
            <select
              v-model="sortBy"
              class="appearance-none bg-white border border-gray-200 rounded-lg px-3 py-2 pr-8 text-sm text-gray-600 outline-none focus:border-blue-400 cursor-pointer"
            >
              <option value="popular">Сначала популярные</option>
              <option value="price_asc">Сначала дешёвые</option>
              <option value="price_desc">Сначала дорогие</option>
              <option value="name">По названию</option>
            </select>
            <svg class="w-4 h-4 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <div class="hidden sm:flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-0.5">
          <button
            class="p-1.5 rounded"
            :class="viewMode === 'grid' ? 'bg-gray-100 text-gray-800' : 'text-gray-400'"
            @click="viewMode = 'grid'"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
              <rect x="0" y="0" width="7" height="7" rx="1" /><rect x="9" y="0" width="7" height="7" rx="1" />
              <rect x="0" y="9" width="7" height="7" rx="1" /><rect x="9" y="9" width="7" height="7" rx="1" />
            </svg>
          </button>
          <button
            class="p-1.5 rounded"
            :class="viewMode === 'list' ? 'bg-gray-100 text-gray-800' : 'text-gray-400'"
            @click="viewMode = 'list'"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
              <rect x="0" y="0" width="16" height="3" rx="1" /><rect x="0" y="4.5" width="16" height="3" rx="1" />
              <rect x="0" y="9" width="16" height="3" rx="1" /><rect x="0" y="13" width="16" height="3" rx="1" />
            </svg>
          </button>
        </div>
      </div>

      <div class="flex gap-6">
        <aside class="hidden lg:block shrink-0 w-[220px]">
          <CatalogFilters
            :filters="filters"
            :price-min="priceMin"
            :price-max="priceMax"
            :active-filters="activeFilters"
            @update:price-min="priceMin = $event"
            @update:price-max="priceMax = $event"
            @toggle-filter="toggleFilter"
            @update-range="onRangeUpdate"
          />
        </aside>

        <Teleport to="body">
          <Transition name="slide">
            <div v-if="showFilters" class="fixed inset-0 z-50 flex">
              <div class="absolute inset-0 bg-black/30" @click="showFilters = false" />
              <div class="relative bg-white w-[300px] max-w-[85vw] h-full overflow-y-auto p-5">
                <div class="flex items-center justify-between mb-5">
                  <span class="font-bold text-gray-900 text-lg">Фильтры</span>
                  <button @click="showFilters = false" class="text-gray-400 hover:text-gray-600">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <CatalogFilters
                  :filters="filters"
                  :price-min="priceMin"
                  :price-max="priceMax"
                  :active-filters="activeFilters"
                  @update:price-min="priceMin = $event"
                  @update:price-max="priceMax = $event"
                  @toggle-filter="toggleFilter"
                  @update-range="onRangeUpdate"
                />
                <button
                  class="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium text-sm py-2.5 rounded-lg mt-4"
                  @click="showFilters = false"
                >
                  Применить
                </button>
              </div>
            </div>
          </Transition>
        </Teleport>

        <div class="flex-1 min-w-0">
          <div
            v-if="paginatedProducts.length"
            class="grid gap-2 sm:gap-3"
            :class="viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' : 'grid-cols-1'"
          >
            <CatalogProductCard
              v-for="item in paginatedProducts"
              :key="item.id"
              :product="item"
              :review="reviewMap[item.id] ?? null"
            />
          </div>

          <!-- скелетон -->
          <div v-else-if="loading" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3">
            <div v-for="i in 12" :key="i" class="bg-white rounded-xl p-3 animate-pulse">
              <div class="h-[140px] sm:h-[170px] lg:h-[200px] bg-gray-200 rounded mb-3" />
              <div class="h-3 bg-gray-200 rounded w-12 mb-2" />
              <div class="h-4 bg-gray-200 rounded w-full mb-1" />
              <div class="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div class="h-3 bg-gray-200 rounded w-28 mb-3" />
              <div class="h-3 bg-gray-200 rounded w-16 mb-1" />
              <div class="h-5 bg-gray-200 rounded w-24 mb-3" />
              <div class="flex gap-2">
                <div class="h-8 w-24 bg-gray-200 rounded-lg" />
                <div class="h-8 w-8 bg-gray-200 rounded-lg" />
              </div>
            </div>
          </div>

          <div v-else class="text-center py-20">
            <p class="text-gray-400 text-lg">Товары не найдены</p>
          </div>

          <nav v-if="totalPages > 1" class="flex items-center justify-center gap-1 mt-8">
            <button
              :disabled="currentPage === 1"
              class="w-9 h-9 flex items-center justify-center rounded-lg text-sm transition-colors"
              :class="currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'"
              @click="goToPage(currentPage - 1)"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <template v-for="(page, idx) in visiblePages" :key="idx">
              <span v-if="page === -1" class="w-9 h-9 flex items-center justify-center text-gray-400 text-sm">...</span>
              <button
                v-else
                class="w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors"
                :class="page === currentPage ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'"
                @click="goToPage(page)"
              >
                {{ page }}
              </button>
            </template>
            <button
              :disabled="currentPage === totalPages"
              class="w-9 h-9 flex items-center justify-center rounded-lg text-sm transition-colors"
              :class="currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'"
              @click="goToPage(currentPage + 1)"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </nav>
        </div>
      </div>

      <div
        v-if="description"
        class="mt-8 bg-white rounded-xl p-4 sm:p-6 text-sm text-gray-600 leading-relaxed prose prose-sm max-w-none"
        v-html="description"
      />

      <CatalogRecentlyViewedSection />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  slug: string
  apiData: any
}>()

const route = useRoute()
const router = useRouter()
const imageBase = useRuntimeConfig().public.apiBase as string

const products = ref<any[]>([])
const reviewMap = ref<Record<number, any>>({})
const categoryName = ref('')
const totalCount = ref(0)
const description = ref('')
const breadcrumbs = ref<{ name: string; link: string }[]>([])

const fullBreadcrumbs = computed(() => {
  const crumbs = breadcrumbs.value.filter(b => b.link !== '/')
  return [
    { name: 'Главная', link: '/' },
    { name: 'Каталог', link: '/catalog' },
    ...crumbs,
  ]
})
const sections = ref<any[]>([])
const filters = ref<any>(null)
const banner = ref<any>(null)
const loading = ref(true)

const showFilters = ref(false)
const viewMode = ref<'grid' | 'list'>('grid')

const sortBy = ref((route.query.sort as string) || 'popular')
const priceMin = ref<number | undefined>(route.query.priceMin ? Number(route.query.priceMin) : undefined)
const priceMax = ref<number | undefined>(route.query.priceMax ? Number(route.query.priceMax) : undefined)
const activeFilters = ref<Record<string, boolean>>(parseActiveFilters(route.query))
const rangeFilters = ref<Record<string, string>>(parseRangeFilters(route.query))

function parseActiveFilters(query: Record<string, any>): Record<string, boolean> {
  const result: Record<string, boolean> = {}
  const raw = query.filters as string | undefined
  if (raw) {
    for (const id of raw.split(',')) {
      if (id) result[id] = true
    }
  }
  return result
}

function parseRangeFilters(query: Record<string, any>): Record<string, string> {
  const result: Record<string, string> = {}
  const raw = query.ranges as string | undefined
  if (raw) {
    for (const pair of raw.split(',')) {
      const [id, val] = pair.split(':')
      if (id && val) result[id] = val
    }
  }
  return result
}

let skipUrlSync = false

function syncFiltersToUrl() {
  if (skipUrlSync) return
  const query: Record<string, string> = {}
  if (sortBy.value && sortBy.value !== 'popular') query.sort = sortBy.value
  if (priceMin.value != null) query.priceMin = String(priceMin.value)
  if (priceMax.value != null) query.priceMax = String(priceMax.value)
  if (currentPage.value > 1) query.page = String(currentPage.value)

  const activeIds = Object.entries(activeFilters.value).filter(([, v]) => v).map(([k]) => k)
  if (activeIds.length) query.filters = activeIds.join(',')

  const rangePairs = Object.entries(rangeFilters.value).map(([k, v]) => `${k}:${v}`)
  if (rangePairs.length) query.ranges = rangePairs.join(',')

  router.replace({ query })
}

const PER_PAGE = 12
const currentPage = ref(route.query.page ? Number(route.query.page) : 1)

const sortedProducts = computed(() => {
  const list = [...products.value]
  switch (sortBy.value) {
    case 'price_asc':
      return list.sort((a, b) => (a.attributes.product?.price?.value ?? 0) - (b.attributes.product?.price?.value ?? 0))
    case 'price_desc':
      return list.sort((a, b) => (b.attributes.product?.price?.value ?? 0) - (a.attributes.product?.price?.value ?? 0))
    case 'name':
      return list.sort((a, b) => (a.attributes.name ?? '').localeCompare(b.attributes.name ?? ''))
    default:
      return list
  }
})

const totalPages = computed(() => Math.ceil(sortedProducts.value.length / PER_PAGE))

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * PER_PAGE
  return sortedProducts.value.slice(start, start + PER_PAGE)
})

const visiblePages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const pages: number[] = []
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    pages.push(1)
    if (current > 3) pages.push(-1)
    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)
    for (let i = start; i <= end; i++) pages.push(i)
    if (current < total - 2) pages.push(-1)
    pages.push(total)
  }
  return pages
})

function goToPage(page: number) {
  currentPage.value = page
  syncFiltersToUrl()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function toggleFilter(id: string) {
  activeFilters.value[id] = !activeFilters.value[id]
}

function onRangeUpdate(minId: string, maxId: string, min: number | undefined, max: number | undefined) {
  if (min != null) rangeFilters.value[minId] = String(min)
  else delete rangeFilters.value[minId]
  if (max != null) rangeFilters.value[maxId] = String(max)
  else delete rangeFilters.value[maxId]
}

function buildFilterParams(): Record<string, string> {
  const params: Record<string, string> = {}
  const hasAny = Object.values(activeFilters.value).some(Boolean)
    || priceMin.value != null
    || priceMax.value != null
    || Object.keys(rangeFilters.value).length > 0

  if (!hasAny) return params
  params.set_filter = 'y'

  for (const [id, active] of Object.entries(activeFilters.value)) {
    if (active) params[id] = 'Y'
  }

  const priceFilter = filters.value?.attributes?.prices?.[0]
  if (priceFilter) {
    if (priceMin.value != null) params[priceFilter.values.min.id] = String(priceMin.value)
    if (priceMax.value != null) params[priceFilter.values.max.id] = String(priceMax.value)
  }

  for (const [id, val] of Object.entries(rangeFilters.value)) {
    params[id] = val
  }

  return params
}

let filterDebounce: ReturnType<typeof setTimeout> | null = null

async function applyFilters() {
  currentPage.value = 1
  loading.value = true
  const params = buildFilterParams()
  const query = new URLSearchParams(params).toString()
  const separator = query ? '&' : ''
  const res = await $fetch<any>(`/api/catalog/${props.slug}/?include=items,filter,reviews-statistics,sections${separator}${query}`).catch(() => null)
  const included = res?.included ?? {}
  products.value = included.items ?? []

  const reviews: any[] = included['reviews-statistics'] ?? []
  const map: Record<number, any> = {}
  for (const r of reviews) map[r.id] = r
  reviewMap.value = map

  loading.value = false
}

watch(sortBy, () => {
  currentPage.value = 1
  syncFiltersToUrl()
})

watch(activeFilters, () => {
  currentPage.value = 1
  syncFiltersToUrl()
  applyFilters()
}, { deep: true })

watch(rangeFilters, () => {
  syncFiltersToUrl()
  if (filterDebounce) clearTimeout(filterDebounce)
  filterDebounce = setTimeout(() => applyFilters(), 500)
}, { deep: true })

watch([priceMin, priceMax], () => {
  syncFiltersToUrl()
  if (filterDebounce) clearTimeout(filterDebounce)
  filterDebounce = setTimeout(() => applyFilters(), 500)
})

function productWord(n: number) {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod100 >= 11 && mod100 <= 14) return 'товаров'
  if (mod10 === 1) return 'товар'
  if (mod10 >= 2 && mod10 <= 4) return 'товара'
  return 'товаров'
}

function applyApiData(catRes: any, bannerRes: any) {
  const data = catRes?.data

  categoryName.value = data?.attributes?.name ?? ''
  totalCount.value = data?.attributes?.count ?? 0
  description.value = data?.attributes?.description ?? ''
  breadcrumbs.value = (catRes?.meta?.breadcrumb ?? []).map((b: any) => ({
    name: b.attributes.name,
    link: b.links?.self ?? '/',
  }))

  const included = catRes?.included ?? {}
  products.value = included.items ?? []
  sections.value = included.sections ?? []
  filters.value = included.filter ?? null

  const reviews: any[] = included['reviews-statistics'] ?? []
  const map: Record<number, any> = {}
  for (const r of reviews) map[r.id] = r
  reviewMap.value = map

  banner.value = bannerRes?.data?.[0] ?? null
  loading.value = false
}

applyApiData(props.apiData.catRes, props.apiData.bannerRes)

watch(() => props.slug, async () => {
  loading.value = true
  products.value = []
  filters.value = null
  sections.value = []

  skipUrlSync = true
  activeFilters.value = {}
  rangeFilters.value = {}
  currentPage.value = 1
  priceMin.value = undefined
  priceMax.value = undefined
  sortBy.value = 'popular'
  skipUrlSync = false
  router.replace({ query: {} })

  const filterParams = buildFilterParams()
  const query = new URLSearchParams(filterParams).toString()
  const separator = query ? '&' : ''

  const [catRes, bannerRes] = await Promise.all([
    $fetch<any>(`/api/catalog/${props.slug}/?include=items,filter,reviews-statistics,sections${separator}${query}`).catch(() => null),
    $fetch<any>('/api/include/banners/wide-catalog/').catch(() => null),
  ])

  applyApiData(catRes, bannerRes)
})
</script>

<style scoped>
.slide-enter-active, .slide-leave-active {
  transition: opacity 0.2s ease;
}
.slide-enter-active > div:last-child, .slide-leave-active > div:last-child {
  transition: transform 0.2s ease;
}
.slide-enter-from, .slide-leave-to {
  opacity: 0;
}
.slide-enter-from > div:last-child {
  transform: translateX(-100%);
}
</style>
