"use client"

import Link from "next/link"
import Image from "next/image"

import { useLanguage } from "@/components/language-provider"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

// Mock data for categories
const categories = [
  {
    id: 1,
    name: {
      fr: "Électronique",
      ar: "إلكترونيات",
    },
    image: "/placeholder.svg?height=200&width=200",
    slug: "electronics",
  },
  {
    id: 2,
    name: {
      fr: "Mode",
      ar: "أزياء",
    },
    image: "/placeholder.svg?height=200&width=200",
    slug: "fashion",
  },
  {
    id: 3,
    name: {
      fr: "Maison",
      ar: "منزل",
    },
    image: "/placeholder.svg?height=200&width=200",
    slug: "home",
  },
  {
    id: 4,
    name: {
      fr: "Beauté",
      ar: "جمال",
    },
    image: "/placeholder.svg?height=200&width=200",
    slug: "beauty",
  },
  {
    id: 5,
    name: {
      fr: "Sports",
      ar: "رياضة",
    },
    image: "/placeholder.svg?height=200&width=200",
    slug: "sports",
  },
  {
    id: 6,
    name: {
      fr: "Artisanat",
      ar: "حرف يدوية",
    },
    image: "/placeholder.svg?height=200&width=200",
    slug: "handmade",
  },
]

export function FeaturedCategories() {
  const { t, language, isRTL } = useLanguage()

  return (
    <section className="py-12 bg-background">
      <div className="container">
        <div className={cn("flex justify-between items-center mb-8", isRTL && "flex-row-reverse")}>
          <h2 className="text-2xl md:text-3xl font-bold">{t("featured_categories")}</h2>
          <Link href="/products" className="text-sm font-medium text-primary hover:underline">
            {t("view_all")}
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link key={category.id} href={`/products?category=${category.slug}`}>
              <Card className="overflow-hidden transition-all hover:shadow-md">
                <CardContent className="p-4 text-center">
                  <div className="relative w-full aspect-square mb-3 mx-auto">
                    <Image
                      src={category.image || "/placeholder.svg"}
                      alt={category.name[language]}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  <h3 className="font-medium">{category.name[language]}</h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
