<template>
  <div class="w-full">
    <div class="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8">
      <nav class="flex items-center text-xs text-gray-400 mb-4 overflow-x-auto whitespace-nowrap scrollbar-hide">
        <template v-for="(crumb, idx) in fullBreadcrumbs" :key="idx">
          <span v-if="idx > 0" class="mx-1.5">/</span>
          <span v-if="idx === fullBreadcrumbs.length - 1" class="text-gray-900 font-medium">{{ crumb.name }}</span>
          <NuxtLink v-else :to="crumb.link" class="hover:text-gray-600 transition-colors">{{ crumb.name }}</NuxtLink>
        </template>
      </nav>

      <ProductHeader
        :name="product?.name ?? ''"
        :stickers="stickers"
        :article="article"
        :brand="brand"
        :rating="reviewStats?.rating ?? null"
        :reviews-count="reviewsCount"
        :rating-pending="reviewStatsPending"
        @goto-reviews="openReviews"
      />

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_320px_320px] gap-4 lg:gap-5 mb-6">
        <ProductGallery
          class="order-1 md:col-span-2 lg:col-span-1"
          :images="product?.images ?? null"
          :video="product?.video ?? null"
          :name="product?.name"
        />
        <ProductPurchase
          v-if="productRaw"
          class="order-2 lg:order-3"
          :product-id="productRaw.id"
          :name="product?.name ?? ''"
          :price-value="product?.product?.price?.value ?? 0"
          :price-formatted="product?.product?.price?.valueFormatted ?? ''"
          :quantity="product?.product?.quantity ?? 0"
          :stores="product?.product?.stores ?? []"
          :delivery-price="meta?.info?.delivery?.delivery ?? null"
          :preview="product?.images?.preview?.src ?? product?.images?.detail?.src ?? ''"
          :link="productRaw?.links?.self ?? `/catalog/${slug}/`"
          :stikers="stickers"
          :article="article"
        />
        <ProductShortSpecs
          class="order-3 lg:order-2"
          :properties="product?.properties ?? null"
          @all="openSpecs"
        />
      </div>

      <div id="product-specs" class="mb-8">
        <ProductTabs
          v-if="tabItems.length"
          :model-value="activeTab"
          :tabs="tabItems"
          @update:model-value="handleTabClick"
        >
          <template #default="{ active }">
            <ProductDescription v-if="active === 'description'" :html="product?.description" />
            <ProductProperties v-else-if="active === 'specs'" :properties="product?.properties ?? null" />
            <ProductDocuments v-else-if="active === 'documents'" :files="product?.files ?? null" />
            <ProductHtml v-else-if="apiTabsById[active]" :html="apiTabsById[active].info" />
          </template>
        </ProductTabs>
      </div>

      <section id="product-reviews" class="mb-8 bg-white rounded-xl p-4 sm:p-6">
        <h2 class="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Отзывы</h2>
        <ProductReviews :slug="slug" :csrf="csrf" :stats="reviewStats" :stats-pending="reviewStatsPending" />
      </section>

      <ProductStores
        v-if="storesInfo"
        class="mb-8"
        :stores="product?.product?.stores ?? null"
        :stores-info="storesInfo"
      />

      <ProductSimilar
        v-if="csrf"
        class="mb-10"
        :slug="slug"
        :csrf="csrf"
        :current-id="productRaw?.id ?? null"
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

const productRaw = computed<any>(() => props.apiData?.catRes?.data ?? null)
const product = computed<any>(() => productRaw.value?.attributes ?? null)
const meta = computed<any>(() => props.apiData?.catRes?.meta ?? null)
const included = computed<any>(() => props.apiData?.catRes?.included ?? null)
const storesInfo = computed<any>(() => included.value?.stores ?? null)
const csrf = computed<string | null>(() => meta.value?.csrf ?? null)

const imageBase = useRuntimeConfig().public.apiBase as string

const seo = computed<any>(() => meta.value?.seo ?? null)
const og = computed<any>(() => meta.value?.og ?? null)

useSeoMeta({
  title: () => seo.value?.title ?? product.value?.name ?? '',
  description: () => seo.value?.description ?? '',
  keywords: () => seo.value?.keywords ?? '',
  ogTitle: () => og.value?.['og:title'] ?? seo.value?.title ?? product.value?.name ?? '',
  ogDescription: () => og.value?.['og:description'] ?? seo.value?.description ?? '',
  ogType: () => (og.value?.['og:type'] as any) ?? 'website',
  ogSiteName: () => og.value?.['og:site_name'] ?? '',
  ogImage: () => {
    const img = og.value?.['og:image']
    if (!img) return ''
    return img.startsWith('http') ? img : imageBase + img
  },
})

onMounted(() => {
  const raw = productRaw.value
  const p = product.value
  if (!raw || !p) return
  useRecentlyViewed().addProduct({
    id: raw.id,
    name: p.name ?? '',
    price: p.product?.price?.value ?? 0,
    priceFormatted: p.product?.price?.valueFormatted ?? '',
    preview: p.images?.preview?.src ?? p.images?.detail?.src ?? '',
    link: raw.links?.self ?? `/catalog/${props.slug}/`,
    stikers: stickers.value,
    storeCount: Object.keys(p.product?.stores?.items ?? {}).length,
  })
})

type StatBucket = { id: number | string; attributes: { count: number } }
const reviewStats = ref<{ rating: number; buckets: StatBucket[] } | null>(null)
const reviewStatsPending = ref(false)
const reviewsCount = computed(() => {
  return (reviewStats.value?.buckets ?? []).reduce((s, b) => s + (Number(b.attributes?.count) || 0), 0)
})

async function loadReviewStats() {
  if (!csrf.value || !props.slug) {
    reviewStatsPending.value = false
    return
  }
  reviewStatsPending.value = true
  try {
    const res = await $fetch<any>(`/api/catalog/${props.slug}/relationships/reviews-statistics/`, {
      params: { csrf: csrf.value },
    })
    reviewStats.value = {
      rating: Number(res?.meta?.rating) || 0,
      buckets: Array.isArray(res?.data) ? res.data : [],
    }
  } catch {
    reviewStats.value = null
  } finally {
    reviewStatsPending.value = false
  }
}

watch(() => [props.slug, csrf.value], () => {
  reviewStats.value = null
  reviewStatsPending.value = true
  loadReviewStats()
}, { immediate: true })

const stickers = computed<string[]>(() => {
  const raw = product.value?.stikers?.value ?? product.value?.stickers?.value ?? []
  return Array.isArray(raw) ? raw : []
})

const article = computed<string | null>(() => {
  const v = product.value?.properties?.cml2Article?.value
  return v ? String(v) : null
})

const brand = computed<any>(() => {
  const b = product.value?.brand
  return Array.isArray(b) && b.length ? b[0] : null
})

const breadcrumbs = computed<{ name: string; link: string }[]>(() => {
  return (meta.value?.breadcrumb ?? [])
    .map((b: any) => ({ name: b.attributes?.name ?? '', link: b.links?.self ?? '/' }))
    .filter((b: any) => b.link !== '/')
})
const fullBreadcrumbs = computed(() => [
  { name: 'Главная', link: '/' },
  { name: 'Каталог', link: '/catalog' },
  ...breadcrumbs.value,
])

type ApiTab = { title: string; sort: number; info: string }

const apiTabsById = computed<Record<string, ApiTab>>(() => {
  const raw = product.value?.tabs
  if (!raw || typeof raw !== 'object') return {}
  return raw as Record<string, ApiTab>
})

const apiTabList = computed(() => {
  return Object.entries(apiTabsById.value)
    .filter(([, t]) => !!t?.info)
    .sort(([, a], [, b]) => (a.sort ?? 0) - (b.sort ?? 0))
    .map(([id, t]) => ({ id, label: t.title }))
})

const tabItems = computed(() => {
  const list: { id: string; label: string }[] = []
  if (product.value?.description) list.push({ id: 'description', label: 'Описание' })
  if (product.value?.properties && Object.keys(product.value.properties).length) {
    list.push({ id: 'specs', label: 'Характеристики' })
  }
  list.push({ id: 'reviews', label: 'Отзывы' })
  list.push(...apiTabList.value)
  if (Array.isArray(product.value?.files) && product.value.files.length) {
    list.push({ id: 'documents', label: 'Инструкции и документы' })
  }
  return list
})

const activeTab = ref('')
watch(tabItems, (items) => {
  const selectable = items.filter(t => t.id !== 'reviews')
  if (!selectable.length) { activeTab.value = ''; return }
  if (!selectable.some(t => t.id === activeTab.value)) activeTab.value = selectable[0]!.id
}, { immediate: true })

function scrollToReviews() {
  nextTick(() => {
    document.getElementById('product-reviews')?.scrollIntoView({ behavior: 'smooth' })
  })
}

function handleTabClick(id: string) {
  if (id === 'reviews') {
    scrollToReviews()
    return
  }
  activeTab.value = id
  nextTick(() => {
    document.getElementById('product-specs')?.scrollIntoView({ behavior: 'smooth' })
  })
}

function openSpecs() {
  if (tabItems.value.some(t => t.id === 'specs')) activeTab.value = 'specs'
  nextTick(() => {
    document.getElementById('product-specs')?.scrollIntoView({ behavior: 'smooth' })
  })
}
const openReviews = () => scrollToReviews()
</script>
