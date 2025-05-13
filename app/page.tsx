import { HomeHero } from "@/components/home/hero"
import { FeaturedCategories } from "@/components/home/featured-categories"
import { FeaturedProducts } from "@/components/home/featured-products"
import { SpecialOffers } from "@/components/home/special-offers"
import { PopularVendors } from "@/components/home/popular-vendors"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <HomeHero />
        <FeaturedCategories />
        <FeaturedProducts />
        <SpecialOffers />
        <PopularVendors />
      </main>
      <SiteFooter />
    </div>
  )
}
