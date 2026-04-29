<template>
  <div class="inline-flex items-center" :class="gapClass">
    <div class="relative inline-flex" :style="{ width: totalWidth + 'px', height: starPx + 'px' }">
      <div class="flex text-gray-200">
        <svg
          v-for="i in 5"
          :key="'g' + i"
          viewBox="0 0 20 20"
          fill="currentColor"
          class="shrink-0 block"
          :width="starPx"
          :height="starPx"
        >
          <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.2 1 5.8L10 15l-5.3 2.8 1-5.8L1.4 7.7l5.9-.9L10 1.5z"/>
        </svg>
      </div>
      <div class="absolute inset-y-0 left-0 overflow-hidden" :style="{ width: pct + '%' }">
        <div class="flex text-amber-400" :style="{ width: totalWidth + 'px' }">
          <svg
            v-for="i in 5"
            :key="'a' + i"
            viewBox="0 0 20 20"
            fill="currentColor"
            class="shrink-0 block"
            :width="starPx"
            :height="starPx"
          >
            <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.2 1 5.8L10 15l-5.3 2.8 1-5.8L1.4 7.7l5.9-.9L10 1.5z"/>
          </svg>
        </div>
      </div>
    </div>
    <span v-if="showValue" class="font-medium text-gray-900" :class="labelClass">{{ formatted }}</span>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  value: number
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
}>(), { size: 'sm', showValue: false })

const pct = computed(() => Math.max(0, Math.min(100, (Number(props.value) || 0) / 5 * 100)))
const formatted = computed(() => (Number(props.value) || 0).toFixed(1))

const starPx = computed(() => props.size === 'lg' ? 28 : props.size === 'md' ? 20 : 16)
const totalWidth = computed(() => starPx.value * 5)
const gapClass = computed(() => props.size === 'lg' ? 'gap-2' : 'gap-1.5')
const labelClass = computed(() => {
  if (props.size === 'lg') return 'text-2xl'
  if (props.size === 'md') return 'text-base'
  return 'text-sm'
})
</script>
