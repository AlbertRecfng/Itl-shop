<template>
  <div class="grid grid-cols-2 lg:grid-cols-5 gap-2">
    <div v-for="i in 5" :key="i" class="bg-white rounded-lg py-1.5 px-2 sm:py-2 sm:px-3 flex items-center gap-1.5 sm:gap-2 animate-pulse">
      <div class="w-6 h-6 sm:w-7 sm:h-7 bg-gray-200 rounded shrink-0" />
      <div class="flex-1 flex flex-col gap-1.5">
        <div class="h-2.5 bg-gray-200 rounded w-3/4" />
        <div class="h-2.5 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
  </div>
</template>
