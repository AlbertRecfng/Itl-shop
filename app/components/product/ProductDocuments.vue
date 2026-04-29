<template>
  <ul v-if="items.length" class="divide-y divide-gray-100">
    <li v-for="(item, i) in items" :key="i" class="py-3">
      <a
        :href="item.href"
        target="_blank"
        rel="noopener"
        class="flex items-center gap-3 text-sm text-gray-800 hover:text-blue-600 transition-colors"
      >
        <svg class="w-5 h-5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        <span class="truncate">{{ item.name }}</span>
        <span class="ml-auto text-xs text-gray-400 uppercase">{{ item.ext }}</span>
      </a>
    </li>
  </ul>
  <p v-else class="text-gray-500 text-sm">Документы отсутствуют</p>
</template>

<script setup lang="ts">
const props = defineProps<{ files: string[] | null }>()

const imageBase = useRuntimeConfig().public.apiBase as string

const items = computed(() => {
  return (props.files ?? [])
    .filter(Boolean)
    .map((src) => {
      const name = src.split('/').pop() ?? src
      const ext = (name.split('.').pop() ?? '').toLowerCase()
      return { href: imageBase + src, name, ext }
    })
})
</script>
