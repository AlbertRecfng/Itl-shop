<template>
  <div class="animate-pulse">
    <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
      <div class="h-7 w-40 bg-gray-200 rounded" />
      <div class="flex gap-2 overflow-x-auto">
        <div v-for="i in 4" :key="i" class="h-8 w-20 sm:w-24 bg-gray-200 rounded-full shrink-0" />
      </div>
    </div>
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-4">
      <div v-for="i in 6" :key="i" class="bg-white rounded-xl p-2 sm:p-3">
        <div class="h-[120px] sm:h-[150px] lg:h-[180px] bg-gray-200 rounded mb-3" />
        <div class="h-3 bg-gray-200 rounded w-16 mb-2" />
        <div class="h-4 bg-gray-200 rounded w-full mb-1" />
        <div class="h-4 bg-gray-200 rounded w-3/4 mb-2" />
        <div class="h-3 bg-gray-200 rounded w-28 mb-3" />
        <div class="h-5 bg-gray-200 rounded w-24 mb-3" />
        <div class="flex gap-2">
          <div class="h-8 w-24 bg-gray-200 rounded-lg" />
          <div class="h-8 w-8 bg-gray-200 rounded-lg" />
          <div class="h-8 w-8 bg-gray-200 rounded-lg" />
          <div class="h-8 w-8 bg-gray-200 rounded-lg" />
        </div>
      </div>
    </div>
  </div>
</template>
