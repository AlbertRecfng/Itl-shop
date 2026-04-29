<template>
  <div ref="containerRef" class="space-y-10 min-h-[1px]">
    <template v-if="loaded">
      <ProductSimilarRow
        v-if="similar.length"
        title="Похожие товары"
        :items="similar"
      />
      <ProductSimilarRow
        v-if="expandables.length"
        title="С этим товаром покупают"
        :items="expandables"
      />
    </template>
    <template v-else-if="pending">
      <SkeletonProductSimilarRow title="Похожие товары" />
      <SkeletonProductSimilarRow title="С этим товаром покупают" />
    </template>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  slug: string
  csrf: string | null
  currentId?: number | string | null
}>()

const containerRef = ref<HTMLElement | null>(null)
const similar = ref<any[]>([])
const expandables = ref<any[]>([])
const pending = ref(false)
const loaded = ref(false)

const { isVisible } = useLazySection(containerRef)

async function fetchList(rel: 'similar-items' | 'expandables'): Promise<any[]> {
  if (!props.csrf || !props.slug) return []
  try {
    const res = await $fetch<any>(`/api/catalog/${props.slug}/relationships/${rel}/`, {
      params: { csrf: props.csrf },
    })
    const list = Array.isArray(res?.data) ? res.data : []
    if (props.currentId == null) return list
    return list.filter((it: any) => String(it?.id) !== String(props.currentId))
  } catch {
    return []
  }
}

async function load() {
  if (!props.csrf || !props.slug) return
  pending.value = true
  loaded.value = false
  try {
    const [s, e] = await Promise.all([fetchList('similar-items'), fetchList('expandables')])
    similar.value = s
    expandables.value = e
  } finally {
    pending.value = false
    loaded.value = true
  }
}

watch(
  [isVisible, () => props.slug, () => props.csrf],
  ([visible]) => {
    if (visible) load()
  },
  { immediate: true },
)
</script>
