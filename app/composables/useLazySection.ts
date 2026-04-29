export function useLazySection(target: Ref<HTMLElement | null>, rootMargin = '200px') {
  const isVisible = ref(false)

  if (import.meta.server) return { isVisible }

  onMounted(() => {
    const el = target.value
    if (!el) {
      isVisible.value = true
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          isVisible.value = true
          observer.disconnect()
        }
      },
      { rootMargin },
    )
    observer.observe(el)

    onUnmounted(() => observer.disconnect())
  })

  return { isVisible }
}
