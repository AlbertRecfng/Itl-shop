<template>
  <div class="bg-white rounded-xl">
    <div class="border-b border-gray-100 overflow-x-auto scrollbar-hide">
      <div class="flex whitespace-nowrap">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          type="button"
          class="px-4 sm:px-5 py-3 text-sm font-medium border-b-2 transition-colors"
          :class="modelValue === tab.id
            ? 'text-blue-600 border-blue-600'
            : 'text-gray-600 border-transparent hover:text-gray-900'"
          @click="$emit('update:modelValue', tab.id)"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>
    <div class="p-4 sm:p-6">
      <slot :active="modelValue" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  tabs: { id: string; label: string }[]
  modelValue: string
}>()
defineEmits<{ (e: 'update:modelValue', v: string): void }>()
</script>
