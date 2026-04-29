<template>
  <div class="product-html text-sm text-gray-800 leading-relaxed" v-html="html" />
</template>

<script setup lang="ts">
defineProps<{ html: string }>()
</script>

<style scoped>
.product-html :deep(h1),
.product-html :deep(h2),
.product-html :deep(h3),
.product-html :deep(h4) {
  font-weight: 600;
  color: #111827;
  margin: 1rem 0 0.5rem;
}
.product-html :deep(h2) { font-size: 1.125rem; }
.product-html :deep(h3) { font-size: 1rem; }
.product-html :deep(h4) { font-size: 0.9375rem; }
.product-html :deep(p) { margin: 0.5rem 0; }
.product-html :deep(ul),
.product-html :deep(ol) { padding-left: 1.25rem; margin: 0.5rem 0; }
.product-html :deep(ul) { list-style: disc; }
.product-html :deep(ol) { list-style: decimal; }
.product-html :deep(li) { margin: 0.25rem 0; }
.product-html :deep(a) { color: #2563eb; }
.product-html :deep(a:hover) { text-decoration: underline; }
.product-html :deep(blockquote) {
  border-left: 3px solid #e5e7eb;
  padding-left: 0.75rem;
  color: #6b7280;
  margin: 0.75rem 0;
}
.product-html :deep(img) { max-width: 100%; height: auto; }
.product-html :deep(table) { border-collapse: collapse; width: 100%; }
.product-html :deep(th),
.product-html :deep(td) { border: 1px solid #e5e7eb; padding: 0.375rem 0.5rem; }
</style>
