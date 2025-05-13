"use client"

import Link from "next/link"
import Image from "next/image"

import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Mock data for special offers
const offers = [
  {
    id: 1,
    title: {
      fr: "Offres d'été",
      ar: "عروض الصيف",
    },
    description: {
      fr: "Jusqu'à 40% de réduction sur les vêtements d'été",
      ar: "خصم يصل إلى 40٪ على ملابس الصيف",
    },
    buttonText: {
      fr: "Voir les offres",
      ar: "عرض العروض",
    },
    image: "/placeholder.svg?height=400&width=600",
    link: "/products?offer=summer",
    color: "bg-orange-100",
  },
  {
    id: 2,
    title: {
      fr: "Produits locaux",
      ar: "منتجات محلية",
    },
    description: {
      fr: "Soutenez les artisans algériens",
      ar: "دعم الحرفيين الجزائريين",
    },
    buttonText: {
      fr: "Découvrir",
      ar: "اكتشف",
    },
    image: "/placeholder.svg?height=400&width=600",
    link: "/products?category=local",
    color: "bg-emerald-100",
  },
]

export function SpecialOffers() {
  const { language, isRTL } = useLanguage()

  return (
    <section className="py-12 bg-background">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {offers.map((offer) => (
            <div key={offer.id} className={cn("rounded-xl overflow-hidden", offer.color)}>
              <div className={cn("flex flex-col md:flex-row h-full", isRTL && "md:flex-row-reverse")}>
                <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
                  <h3 className="text-2xl font-bold mb-2">{offer.title[language]}</h3>
                  <p className="mb-4 text-muted-foreground">{offer.description[language]}</p>
                  <div>
                    <Button asChild>
                      <Link href={offer.link}>{offer.buttonText[language]}</Link>
                    </Button>
                  </div>
                </div>
                <div className="md:w-1/2 relative h-48 md:h-auto">
                  <Image
                    src={offer.image || "/placeholder.svg"}
                    alt={offer.title[language]}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
