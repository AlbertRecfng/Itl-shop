<template>
  <ProductHtml v-if="html" :html="html" />
  <p v-else class="text-gray-500 text-sm">Описание отсутствует</p>
</template>

<script setup lang="ts">
defineProps<{ html?: string | null }>()
</script>
