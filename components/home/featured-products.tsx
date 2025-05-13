"use client"

import Link from "next/link"
import Image from "next/image"
import { Heart, ShoppingCart, Star } from "lucide-react"

import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Mock data for products
const products = [
  {
    id: 1,
    name: {
      fr: "Smartphone Galaxy S22",
      ar: "هاتف جالاكسي S22",
    },
    price: 89900,
    oldPrice: 99900,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.5,
    reviewCount: 128,
    isNew: true,
    vendor: {
      name: "ElectroShop",
      location: "Alger",
    },
  },
  {
    id: 2,
    name: {
      fr: "Laptop Lenovo ThinkPad",
      ar: "لابتوب لينوفو ثينك باد",
    },
    price: 159900,
    oldPrice: null,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.2,
    reviewCount: 75,
    isNew: false,
    vendor: {
      name: "InfoTech",
      location: "Oran",
    },
  },
  {
    id: 3,
    name: {
      fr: "Robe traditionnelle",
      ar: "فستان تقليدي",
    },
    price: 12500,
    oldPrice: 15000,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.8,
    reviewCount: 42,
    isNew: false,
    vendor: {
      name: "Artisanat Algérien",
      location: "Constantine",
    },
  },
  {
    id: 4,
    name: {
      fr: "Cafetière automatique",
      ar: "ماكينة قهوة أوتوماتيكية",
    },
    price: 24900,
    oldPrice: null,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.0,
    reviewCount: 63,
    isNew: true,
    vendor: {
      name: "MaisonPlus",
      location: "Annaba",
    },
  },
  {
    id: 5,
    name: {
      fr: "Montre connectée",
      ar: "ساعة ذكية",
    },
    price: 18500,
    oldPrice: 22000,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.3,
    reviewCount: 91,
    isNew: false,
    vendor: {
      name: "TechZone",
      location: "Sétif",
    },
  },
  {
    id: 6,
    name: {
      fr: "Parfum Ambre Noir",
      ar: "عطر العنبر الأسود",
    },
    price: 8900,
    oldPrice: null,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.7,
    reviewCount: 104,
    isNew: false,
    vendor: {
      name: "Parfumerie Orientale",
      location: "Tlemcen",
    },
  },
  {
    id: 7,
    name: {
      fr: "Tapis berbère",
      ar: "سجادة أمازيغية",
    },
    price: 35000,
    oldPrice: 42000,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.9,
    reviewCount: 37,
    isNew: true,
    vendor: {
      name: "Artisanat du Sud",
      location: "Ghardaïa",
    },
  },
  {
    id: 8,
    name: {
      fr: "Ensemble de vaisselle",
      ar: "طقم أواني المائدة",
    },
    price: 14500,
    oldPrice: null,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.1,
    reviewCount: 52,
    isNew: false,
    vendor: {
      name: "MaisonPlus",
      location: "Annaba",
    },
  },
]

// Format price in Algerian Dinar
function formatPrice(price: number, language: string) {
  return new Intl.NumberFormat(language === "fr" ? "fr-DZ" : "ar-DZ", {
    style: "currency",
    currency: "DZD",
    maximumFractionDigits: 0,
  }).format(price)
}

export function FeaturedProducts() {
  const { t, language, isRTL } = useLanguage()

  return (
    <section className="py-12 bg-muted/30">
      <div className="container">
        <div className={cn("flex justify-between items-center mb-8", isRTL && "flex-row-reverse")}>
          <h2 className="text-2xl md:text-3xl font-bold">{t("featured_products")}</h2>
          <Link href="/products" className="text-sm font-medium text-primary hover:underline">
            {t("view_all")}
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden h-full flex flex-col">
              <div className="relative pt-4 px-4">
                {product.isNew && (
                  <Badge className="absolute top-6 left-6 z-10">{language === "fr" ? "Nouveau" : "جديد"}</Badge>
                )}
                {product.oldPrice && (
                  <Badge variant="outline" className="absolute top-6 right-6 z-10 bg-red-500 text-white border-red-500">
                    {language === "fr"
                      ? `-${Math.round((1 - product.price / product.oldPrice) * 100)}%`
                      : `${Math.round((1 - product.price / product.oldPrice) * 100)}%-`}
                  </Badge>
                )}
                <Link href={`/products/${product.id}`}>
                  <div className="relative w-full aspect-square mb-3 overflow-hidden rounded-md">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name[language]}
                      fill
                      className="object-cover transition-transform hover:scale-105"
                    />
                  </div>
                </Link>
              </div>

              <CardContent className="flex-1">
                <div className="text-sm text-muted-foreground mb-1">
                  {product.vendor.name} • {product.vendor.location}
                </div>
                <Link href={`/products/${product.id}`} className="hover:underline">
                  <h3 className="font-medium line-clamp-2 h-12">{product.name[language]}</h3>
                </Link>
                <div className="flex items-center mt-2">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span className="ml-1 text-sm font-medium">{product.rating}</span>
                  <span className="mx-1 text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">
                    {product.reviewCount} {language === "fr" ? "avis" : "تقييم"}
                  </span>
                </div>
                <div className="mt-3 space-x-2 rtl:space-x-reverse">
                  <span className="font-bold text-lg">{formatPrice(product.price, language)}</span>
                  {product.oldPrice && (
                    <span className="text-muted-foreground line-through">
                      {formatPrice(product.oldPrice, language)}
                    </span>
                  )}
                </div>
              </CardContent>

              <CardFooter className="border-t p-4">
                <div className="flex gap-2 w-full">
                  <Button className="flex-1" size="sm">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    {t("add_to_cart")}
                  </Button>
                  <Button variant="outline" size="icon" className="h-9 w-9">
                    <Heart className="h-4 w-4" />
                    <span className="sr-only">{t("add_to_wishlist")}</span>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
