<template>
  <div>
    <HeroSection />
    <BestsellersSection />
    <PromoBanners />
    <PopularBrands />
    <SaleSection />
    <WideBanner />
    <PromotionsSection />
    <RecommendSection />
    <BlogSection />
    <AboutCompany />
    <div class="max-w-[1500px] mx-auto px-3 sm:px-4 pb-10">
      <CatalogRecentlyViewedSection />
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'itlb2c — готовый интернет-магазин',
  description: 'Интернет-магазин itlb2c: техника, мебель, одежда и многое другое со скидками до 50%. Удобный поиск, быстрая доставка, выгодные акции и бренды.',
  ogTitle: 'itlb2c — готовый интернет-магазин',
  ogDescription: 'Техника, мебель, одежда и многое другое со скидками до 50%. Бренды, акции, доставка.',
  ogType: 'website',
  ogSiteName: 'itlb2c',
})
</script>
