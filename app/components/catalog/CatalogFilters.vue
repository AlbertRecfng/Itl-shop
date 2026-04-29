<template>
  <div>
    <div v-for="price in prices" :key="price.name" class="mb-6">
      <button class="flex items-center justify-between w-full mb-3" @click="toggleSection('price')">
        <span class="text-sm font-semibold text-gray-900">{{ price.name }}</span>
        <svg class="w-4 h-4 text-gray-400 transition-transform" :class="openSections.price ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div v-show="openSections.price">
        <div class="flex items-center gap-2 mb-2">
          <input
            :value="priceMin ?? ''"
            type="number"
            :placeholder="String(price.values.min.value)"
            class="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-blue-400"
            @input="$emit('update:priceMin', ($event.target as HTMLInputElement).value ? Number(($event.target as HTMLInputElement).value) : undefined)"
          />
          <span class="text-gray-300 text-sm">—</span>
          <input
            :value="priceMax ?? ''"
            type="number"
            :placeholder="String(price.values.max.value)"
            class="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-blue-400"
            @input="$emit('update:priceMax', ($event.target as HTMLInputElement).value ? Number(($event.target as HTMLInputElement).value) : undefined)"
          />
        </div>
        <div class="relative mt-3 h-5">
          <div class="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1 bg-gray-200 rounded-full">
            <div class="absolute h-full bg-blue-500 rounded-full" :style="priceBarStyle(price)" />
          </div>
          <input
            type="range"
            :min="price.values.min.value"
            :max="price.values.max.value"
            :value="priceMin ?? price.values.min.value"
            class="price-range absolute w-full top-0 left-0 h-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-500 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow [&::-moz-range-thumb]:cursor-pointer"
            @input="$emit('update:priceMin', Number(($event.target as HTMLInputElement).value))"
          />
          <input
            type="range"
            :min="price.values.min.value"
            :max="price.values.max.value"
            :value="priceMax ?? price.values.max.value"
            class="price-range absolute w-full top-0 left-0 h-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-500 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow [&::-moz-range-thumb]:cursor-pointer"
            @input="$emit('update:priceMax', Number(($event.target as HTMLInputElement).value))"
          />
        </div>
      </div>
    </div>

    <div v-for="prop in visibleProperties" :key="prop.code" class="mb-6">
      <button class="flex items-center justify-between w-full mb-3" @click="toggleSection(prop.code)">
        <span class="text-sm font-semibold text-gray-900">{{ prop.name }}</span>
        <svg class="w-4 h-4 text-gray-400 transition-transform" :class="openSections[prop.code] ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div v-show="openSections[prop.code]">
        <template v-if="prop.toggle">
          <label class="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              :checked="activeFilters[prop.values[0]?.id]"
              @change="$emit('toggleFilter', prop.values[0]?.id)"
            />
            {{ prop.name }}
          </label>
        </template>

        <template v-else-if="isRange(prop.values)">
          <div class="flex items-center gap-2">
            <input
              type="number"
              :placeholder="'от ' + prop.values.min.value"
              :value="rangeValues[prop.code]?.min ?? ''"
              class="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-blue-400"
              @input="onRangeInput(prop, 'min', ($event.target as HTMLInputElement).value)"
            />
            <span class="text-gray-300 text-sm">—</span>
            <input
              type="number"
              :placeholder="'до ' + prop.values.max.value"
              :value="rangeValues[prop.code]?.max ?? ''"
              class="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-blue-400"
              @input="onRangeInput(prop, 'max', ($event.target as HTMLInputElement).value)"
            />
          </div>
        </template>

        <template v-else>
          <div class="flex flex-col gap-2">
            <label
              v-for="val in visibleValues(prop)"
              :key="val.id"
              class="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-blue-500"
            >
              <input
                type="checkbox"
                class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                :checked="activeFilters[val.id]"
                @change="$emit('toggleFilter', val.id)"
              />
              <span class="flex-1">{{ val.name }}</span>
              <span v-if="val.count" class="text-gray-400 text-xs">{{ val.count }}</span>
            </label>
            <button
              v-if="Array.isArray(prop.values) && prop.values.length > 5 && !expandedSections[prop.code]"
              class="text-xs text-blue-600 hover:text-blue-700 text-left mt-1"
              @click="expandedSections[prop.code] = true"
            >
              Показать ещё ↓
            </button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  filters: any
  priceMin: number | undefined
  priceMax: number | undefined
  activeFilters: Record<string, boolean>
}>()

const emit = defineEmits<{
  'update:priceMin': [value: number | undefined]
  'update:priceMax': [value: number | undefined]
  'toggleFilter': [id: string]
  'updateRange': [minId: string, maxId: string, min: number | undefined, max: number | undefined]
}>()

const openSections = reactive<Record<string, boolean>>({ price: true })
const expandedSections = reactive<Record<string, boolean>>({})
const rangeValues = reactive<Record<string, { min?: number; max?: number }>>({})

const prices = computed(() => props.filters?.attributes?.prices ?? [])

const visibleProperties = computed(() => {
  const properties: any[] = props.filters?.attributes?.properties ?? []
  return properties.filter((p: any) => {
    if (Array.isArray(p.values)) return p.values.length > 0
    if (p.values && typeof p.values === 'object' && 'min' in p.values) return p.values.min.value !== p.values.max.value
    return false
  })
})

watch(visibleProperties, (list) => {
  list.forEach((p: any, i: number) => {
    if (!(p.code in openSections)) {
      openSections[p.code] = i < 3
    }
  })
}, { immediate: true })

function toggleSection(key: string) {
  openSections[key] = !openSections[key]
}

function isRange(values: any): boolean {
  return values && typeof values === 'object' && !Array.isArray(values) && 'min' in values
}

function visibleValues(prop: any): any[] {
  if (!Array.isArray(prop.values)) return []
  if (expandedSections[prop.code]) return prop.values
  return prop.values.slice(0, 5)
}

function onRangeInput(prop: any, side: 'min' | 'max', raw: string) {
  const entry = rangeValues[prop.code] ?? (rangeValues[prop.code] = {})
  entry[side] = raw ? Number(raw) : undefined
  emit('updateRange',
    prop.values.min.id,
    prop.values.max.id,
    entry.min,
    entry.max,
  )
}

function priceBarStyle(price: any) {
  const min = price.values.min.value
  const max = price.values.max.value
  const range = max - min || 1
  const left = props.priceMin != null ? ((props.priceMin - min) / range) * 100 : 0
  const right = props.priceMax != null ? ((max - props.priceMax) / range) * 100 : 0
  return {
    left: `${Math.max(0, left)}%`,
    right: `${Math.max(0, right)}%`,
  }
}
</script>
