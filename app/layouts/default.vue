<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <Navbar />
    <main class="flex-1 w-full">
      <slot />
    </main>
    <Footer />
    <CatalogModal />
  </div>
</template>
