<template>
  <div>
    <div class="flex items-center gap-1">
      <button
        v-if="hasChildren"
        class="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors shrink-0"
        @click="expanded = !expanded"
      >
        <svg
          class="w-4 h-4 transition-transform"
          :class="{ 'rotate-90': expanded }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
      <span v-else class="w-6 shrink-0" />

      <NuxtLink
        :to="node.links?.self ?? '#'"
        class="flex items-center gap-2 flex-1 min-w-0 py-1.5 px-2 rounded hover:bg-blue-50 group transition-colors"
        @click="$emit('navigate')"
      >
        <img
          v-if="node.attributes?.img"
          :src="apiBase + node.attributes.img"
          :alt="node.attributes.name"
          class="w-6 h-6 object-contain shrink-0"
        />
        <span class="text-sm text-gray-800 group-hover:text-blue-600 truncate">
          {{ node.attributes?.name }}
        </span>
        <span v-if="node.attributes?.count" class="text-xs text-gray-400 shrink-0">
          {{ node.attributes.count }}
        </span>
      </NuxtLink>
    </div>

    <div v-if="hasChildren && expanded" class="pl-6 border-l border-gray-100 ml-3">
      <CatalogTreeNode
        v-for="child in children"
        :key="child.id"
        :node="child"
        :children-map="childrenMap"
        @navigate="$emit('navigate')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  node: any
  childrenMap: Record<number, any[]>
}>()

defineEmits<{ navigate: [] }>()

const apiBase = useRuntimeConfig().public.apiBase as string

const children = computed(() => props.childrenMap[props.node.id] ?? [])
const hasChildren = computed(() => children.value.length > 0)
const expanded = ref(false)
</script>
