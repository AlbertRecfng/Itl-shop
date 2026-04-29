<template>
  <div v-if="items.length">
    <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 lg:gap-x-12">
      <div
        v-for="item in items"
        :key="item.key"
        class="flex items-baseline justify-between gap-4 py-2.5 border-b border-gray-100 text-sm"
      >
        <dt class="text-gray-500 flex-shrink-0 max-w-[55%]">{{ item.name }}</dt>
        <dd class="text-gray-900 text-right">{{ item.value }}</dd>
      </div>
    </dl>
  </div>
  <p v-else class="text-gray-500 text-sm">Характеристики отсутствуют</p>
</template>

<script setup lang="ts">
const props = defineProps<{
  properties: Record<string, { name: string; value: unknown }> | null
}>()

const items = computed(() => {
  return Object.entries(props.properties ?? {})
    .map(([key, prop]) => ({
      key,
      name: prop.name,
      value: Array.isArray(prop.value) ? prop.value.join(', ') : String(prop.value ?? ''),
    }))
    .filter(i => i.value !== '' && i.value !== 'null' && i.value !== 'undefined')
})
</script>
