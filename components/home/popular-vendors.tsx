"use client"

import Link from "next/link"
import Image from "next/image"
import { Star } from "lucide-react"

import { useLanguage } from "@/components/language-provider"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Mock data for vendors
const vendors = [
  {
    id: 1,
    name: "ElectroShop",
    logo: "/placeholder.svg?height=100&width=100",
    coverImage: "/placeholder.svg?height=200&width=400",
    rating: 4.8,
    reviewCount: 256,
    location: "Alger",
    productCount: 128,
    isVerified: true,
  },
  {
    id: 2,
    name: "Artisanat Algérien",
    logo: "/placeholder.svg?height=100&width=100",
    coverImage: "/placeholder.svg?height=200&width=400",
    rating: 4.9,
    reviewCount: 187,
    location: "Constantine",
    productCount: 75,
    isVerified: true,
  },
  {
    id: 3,
    name: "MaisonPlus",
    logo: "/placeholder.svg?height=100&width=100",
    coverImage: "/placeholder.svg?height=200&width=400",
    rating: 4.6,
    reviewCount: 142,
    location: "Annaba",
    productCount: 93,
    isVerified: true,
  },
  {
    id: 4,
    name: "TechZone",
    logo: "/placeholder.svg?height=100&width=100",
    coverImage: "/placeholder.svg?height=200&width=400",
    rating: 4.5,
    reviewCount: 118,
    location: "Sétif",
    productCount: 64,
    isVerified: false,
  },
]

export function PopularVendors() {
  const { t, language, isRTL } = useLanguage()

  return (
    <section className="py-12 bg-muted/30">
      <div className="container">
        <div className={cn("flex justify-between items-center mb-8", isRTL && "flex-row-reverse")}>
          <h2 className="text-2xl md:text-3xl font-bold">{t("popular_vendors")}</h2>
          <Link href="/vendors" className="text-sm font-medium text-primary hover:underline">
            {t("view_all")}
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {vendors.map((vendor) => (
            <Link key={vendor.id} href={`/vendors/${vendor.id}`}>
              <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
                <div className="relative h-32">
                  <Image
                    src={vendor.coverImage || "/placeholder.svg"}
                    alt={vendor.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute -bottom-8 left-4">
                    <div className="relative h-16 w-16 rounded-full border-4 border-background overflow-hidden bg-background">
                      <Image src={vendor.logo || "/placeholder.svg"} alt={vendor.name} fill className="object-cover" />
                    </div>
                  </div>
                </div>

                <CardContent className="pt-10">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">
                      {vendor.name}
                      {vendor.isVerified && (
                        <Badge variant="outline" className="ml-2 bg-green-100 text-green-800 border-green-200">
                          {language === "fr" ? "Vérifié" : "موثق"}
                        </Badge>
                      )}
                    </h3>
                  </div>

                  <div className="flex items-center mt-2">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span className="ml-1 text-sm font-medium">{vendor.rating}</span>
                    <span className="mx-1 text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">
                      {vendor.reviewCount} {language === "fr" ? "avis" : "تقييم"}
                    </span>
                  </div>

                  <div className="mt-2 text-sm text-muted-foreground">
                    <span>{vendor.location}</span>
                    <span className="mx-1">•</span>
                    <span>
                      {vendor.productCount} {language === "fr" ? "produits" : "منتج"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
