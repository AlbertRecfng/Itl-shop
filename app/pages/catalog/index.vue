<template>
  <section class="w-full bg-[#EEF3FA] min-h-[60vh] py-6 sm:py-10">
    <div class="max-w-[1500px] mx-auto px-3 sm:px-4">
      <h1 class="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Каталог товаров</h1>

      <div v-if="error" class="bg-white rounded-xl p-8 sm:p-12 text-center">
        <p class="text-gray-700 text-base sm:text-lg mb-2">Не удалось загрузить каталог</p>
        <p class="text-sm text-gray-500 mb-5">Проверьте соединение и попробуйте ещё раз.</p>
        <button
          class="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium text-sm px-5 py-2.5 rounded transition-colors"
          @click="loadCategories"
        >
          Повторить
        </button>
      </div>

      <div v-else-if="categories.length" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <NuxtLink
          v-for="cat in categories"
          :key="cat.id"
          :to="cat.links.self"
          class="bg-white rounded-xl p-4 flex flex-col items-center gap-3 min-w-0 hover:shadow-md transition-shadow"
        >
          <div class="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32">
            <img
              :src="imageBase + cat.attributes.img"
              :alt="cat.attributes.name"
              class="w-full h-full object-contain"
            />
          </div>
          <p class="text-sm sm:text-base font-medium text-gray-800 text-center">{{ cat.attributes.name }}</p>
          <span class="text-xs text-gray-400">{{ cat.attributes.count }} {{ productWord(cat.attributes.count) }}</span>
        </NuxtLink>
      </div>

      <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <div v-for="i in 5" :key="i" class="bg-white rounded-xl p-4 flex flex-col items-center gap-3 animate-pulse">
          <div class="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 bg-gray-200 rounded" />
          <div class="h-4 bg-gray-200 rounded w-3/4" />
          <div class="h-3 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Каталог товаров - itlb2c',
  description: 'Полный каталог товаров itlb2c: электроника, мебель, одежда, обувь, спортивные товары, освещение, сантехника и многое другое.',
  ogTitle: 'Каталог товаров — itlb2c',
  ogDescription: 'Полный каталог товаров итернет-магазина itlb2c.',
  ogType: 'website',
  ogSiteName: 'itlb2c',
})

const imageBase = useRuntimeConfig().public.apiBase as string
const categories = ref<any[]>([])
const error = ref(false)

async function loadCategories() {
  error.value = false
  try {
    const res = await $fetch<any>('/api/catalog/')
    categories.value = res?.data ?? []
  } catch {
    error.value = true
    categories.value = []
  }
}

onMounted(() => loadCategories())

function productWord(n: number) {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod100 >= 11 && mod100 <= 14) return 'товаров'
  if (mod10 === 1) return 'товар'
  if (mod10 >= 2 && mod10 <= 4) return 'товара'
  return 'товаров'
}
</script>
