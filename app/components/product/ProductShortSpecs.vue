<template>
  <div v-if="items.length" class="bg-white rounded-xl p-4 sm:p-5">
    <h3 class="text-base font-semibold text-gray-900 mb-3">Кратко о товаре</h3>
    <dl class="divide-y divide-gray-100">
      <div v-for="item in items" :key="item.key" class="flex items-baseline justify-between gap-3 py-2 text-sm">
        <dt class="text-gray-500 flex-shrink-0 max-w-[55%]">{{ item.name }}</dt>
        <dd class="text-gray-900 text-right">{{ item.value }}</dd>
      </div>
    </dl>
    <button
      type="button"
      class="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
      @click="$emit('all')"
    >
      Все характеристики →
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  properties: Record<string, { name: string; value: unknown }> | null
  limit?: number
  excludeKeys?: string[]
}>()

defineEmits<{ (e: 'all'): void }>()

const items = computed(() => {
  const entries = Object.entries(props.properties ?? {})
  const excluded = new Set(['cml2Article', ...(props.excludeKeys ?? [])])
  return entries
    .filter(([key]) => !excluded.has(key))
    .slice(0, props.limit ?? 5)
    .map(([key, prop]) => ({
      key,
      name: prop.name,
      value: Array.isArray(prop.value) ? prop.value.join(', ') : String(prop.value ?? ''),
    }))
    .filter(i => i.value !== '')
})
</script>
