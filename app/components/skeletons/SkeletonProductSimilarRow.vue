<template>
  <section class="animate-pulse">
    <div class="h-6 sm:h-7 w-48 bg-gray-200 rounded mb-4" />
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4">
      <div v-for="i in 5" :key="i" class="bg-white rounded-xl p-3">
        <div class="h-[120px] sm:h-[150px] lg:h-[180px] bg-gray-200 rounded mb-3" />
        <div class="h-3 bg-gray-200 rounded w-12 mb-2" />
        <div class="h-4 bg-gray-200 rounded w-full mb-1" />
        <div class="h-4 bg-gray-200 rounded w-3/4 mb-2" />
        <div class="h-3 bg-gray-200 rounded w-24 mb-3" />
        <div class="h-5 bg-gray-200 rounded w-20 mb-3" />
        <div class="flex gap-2">
          <div class="h-8 w-20 bg-gray-200 rounded-lg" />
          <div class="h-8 w-8 bg-gray-200 rounded-lg" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{ title?: string }>()
</script>
