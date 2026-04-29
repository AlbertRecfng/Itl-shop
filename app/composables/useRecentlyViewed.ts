export interface RecentlyViewedItem {
  id: number
  name: string
  price: number
  priceFormatted: string
  preview: string
  link: string
  stikers: string[]
  storeCount: number
}

const STORAGE_KEY = 'recently-viewed'
const MAX_ITEMS = 20

function loadFromStorage(): RecentlyViewedItem[] {
  if (import.meta.server) return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

const items = ref<RecentlyViewedItem[]>(loadFromStorage())

if (import.meta.client) {
  watch(items, (val) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
  }, { deep: true })
}

export function useRecentlyViewed() {
  function addProduct(item: RecentlyViewedItem) {
    items.value = [item, ...items.value.filter(i => i.id !== item.id)].slice(0, MAX_ITEMS)
  }

  return { items, addProduct }
}
