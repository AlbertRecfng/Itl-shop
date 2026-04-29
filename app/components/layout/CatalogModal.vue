<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 overflow-y-auto">
        <div class="absolute inset-0 bg-black/40" @click="close" />

        <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-[1100px] mt-4 sm:mt-10 max-h-[90vh] flex flex-col">
          <div class="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-gray-100">
            <h2 class="text-lg sm:text-xl font-bold text-gray-900">Каталог товаров</h2>
            <button
              class="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
              @click="close"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="overflow-y-auto px-5 sm:px-7 py-5">
            <div v-if="error" class="text-center py-10">
              <p class="text-gray-600 mb-3">Не удалось загрузить каталог.</p>
              <button class="text-sm text-blue-500 hover:text-blue-600" @click="loadCatalog">
                Попробовать снова
              </button>
            </div>

            <div v-else-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
              <div v-for="i in 9" :key="i" class="flex items-center gap-2 py-2">
                <div class="w-6 h-6 bg-gray-200 rounded animate-pulse" />
                <div class="h-4 bg-gray-200 rounded animate-pulse flex-1" />
              </div>
            </div>

            <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-1">
              <CatalogTreeNode
                v-for="root in rootCategories"
                :key="root.id"
                :node="root"
                :children-map="childrenMap"
                @navigate="close"
              />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const { isOpen, close } = useCatalogModal()
const route = useRoute()

const rootCategories = ref<any[]>([])
const childrenMap = ref<Record<number, any[]>>({})
const loading = ref(false)
const error = ref(false)
let loaded = false

async function loadCatalog() {
  loading.value = true
  error.value = false
  try {
    const res = await $fetch<any>('/api/catalog/')
    const items: any[] = res?.data ?? []

    const roots: any[] = []
    const map: Record<number, any[]> = {}

    for (const item of items) {
      const pid = item.attributes?.parentId
      if (pid == null) {
        roots.push(item)
      } else {
        if (!map[pid]) map[pid] = []
        map[pid].push(item)
      }
    }

    rootCategories.value = roots
    childrenMap.value = map
    loaded = true
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}

watch(isOpen, (val) => {
  if (val && !loaded) loadCatalog()
})

watch(() => route.fullPath, () => {
  if (isOpen.value) close()
})

onMounted(() => {
  function onKey(e: KeyboardEvent) {
    if (e.key === 'Escape') close()
  }
  window.addEventListener('keydown', onKey)
  onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
})

watch(isOpen, (val) => {
  if (typeof document === 'undefined') return
  document.body.style.overflow = val ? 'hidden' : ''
})
</script>

<style scoped>
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-active > div:last-child,
.modal-leave-active > div:last-child {
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.modal-enter-from, .modal-leave-to {
  opacity: 0;
}
.modal-enter-from > div:last-child,
.modal-leave-to > div:last-child {
  transform: translateY(-10px);
  opacity: 0;
}
</style>
