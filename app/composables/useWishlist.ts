export interface WishlistItem {
  id: number
  name: string
  price: number
  priceFormatted?: string
  preview?: string
  link?: string
  stikers?: string[]
  storeCount?: number
  rating?: number
}

const STORAGE_KEY = 'wishlist-items'

function loadFromStorage(): WishlistItem[] {
  if (import.meta.server) return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

const items = ref<WishlistItem[]>(loadFromStorage())

if (import.meta.client) {
  watch(items, (val) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
  }, { deep: true })
}

export function useWishlist() {
  const count = computed(() => items.value.length)

  function addItem(item: WishlistItem) {
    if (!items.value.find(i => i.id === item.id)) {
      items.value.push(item)
    }
  }

  function removeItem(id: number) {
    items.value = items.value.filter(i => i.id !== id)
  }

  return { items, count, addItem, removeItem }
}



