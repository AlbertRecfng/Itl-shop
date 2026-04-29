<template>
  <div v-if="rows.length" class="bg-white rounded-xl p-4 sm:p-6">
    <h2 class="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Наличие в магазинах</h2>
    <ul class="divide-y divide-gray-100">
      <li
        v-for="row in rows"
        :key="row.id"
        class="py-4 flex flex-col sm:flex-row sm:items-start gap-3"
      >
        <div class="flex-1 min-w-0">
          <p class="font-medium text-gray-900">{{ row.name }}</p>
          <p v-if="row.address" class="text-sm text-gray-500 mt-0.5">{{ row.address }}</p>
          <div class="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm">
            <a
              v-if="row.phone"
              :href="`tel:${row.phone.replace(/[^+\d]/g, '')}`"
              class="text-blue-600 hover:text-blue-700"
            >
              {{ row.phone }}
            </a>
            <span v-if="row.schedule" class="text-gray-500" v-html="row.schedule" />
          </div>
        </div>

        <div class="shrink-0 flex items-center gap-2 sm:flex-col sm:items-end sm:text-right">
          <span
            class="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full"
            :class="row.inStock
              ? 'bg-green-50 text-green-700'
              : 'bg-gray-100 text-gray-500'"
          >
            <span
              class="w-1.5 h-1.5 rounded-full mr-1.5"
              :class="row.inStock ? 'bg-green-500' : 'bg-gray-400'"
            />
            {{ row.inStock ? 'В наличии' : 'Не в наличии' }}
          </span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
type StoreInfo = { name: string; address?: string; phone?: string; schedule?: string }
type StoreAmount = { store_id: string; amount: string; text: string }

const props = defineProps<{
  stores: StoreAmount[] | null
  storesInfo: Record<string, StoreInfo> | null
}>()

const rows = computed(() => {
  const amounts = new Map<string, StoreAmount>(
    (props.stores ?? []).map(s => [String(s.store_id), s]),
  )
  const infoEntries = Object.entries(props.storesInfo ?? {})
  return infoEntries.map(([id, info]) => {
    const a = amounts.get(id)
    return {
      id,
      name: info.name,
      address: info.address,
      phone: info.phone,
      schedule: info.schedule,
      inStock: a ? Number(a.amount) > 0 : false,
      text: a?.text ?? '',
    }
  }).sort((a, b) => Number(b.inStock) - Number(a.inStock))
})
</script>
