export interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  preview?: string
  link?: string
  stikers?: string[]
  article?: string
  priceFormatted?: string
}

const STORAGE_KEY = 'cart-items'

function loadFromStorage(): CartItem[] {
  if (import.meta.server) return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

const items = ref<CartItem[]>(loadFromStorage())

if (import.meta.client) {
  watch(items, (val) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
  }, { deep: true })
}

export function useCart() {
  const count = computed(() => items.value.reduce((sum, i) => sum + i.quantity, 0))
  const total = computed(() => items.value.reduce((sum, i) => sum + i.price * i.quantity, 0))

  function addItem(item: Omit<CartItem, 'quantity'>) {
    const existing = items.value.find(i => i.id === item.id)
    if (existing) {
      existing.quantity++
    } else {
      items.value.push({ ...item, quantity: 1 })
    }
  }

  function decrementItem(id: number) {
    const existing = items.value.find(i => i.id === id)
    if (existing) {
      existing.quantity--
      if (existing.quantity <= 0) {
        items.value = items.value.filter(i => i.id !== id)
      }
    }
  }

  function removeItem(id: number) {
    items.value = items.value.filter(i => i.id !== id)
  }

  function clear() {
    items.value = []
  }

  return { items, count, total, addItem, decrementItem, removeItem, clear }
}
