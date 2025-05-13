"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"
import { cn } from "@/lib/utils"

// Mock data for carousel
const carouselItems = [
  {
    id: 1,
    title: {
      fr: "Découvrez nos nouveaux produits",
      ar: "اكتشف منتجاتنا الجديدة",
    },
    description: {
      fr: "Les meilleures offres sur les produits électroniques",
      ar: "أفضل العروض على المنتجات الإلكترونية",
    },
    buttonText: {
      fr: "Acheter maintenant",
      ar: "تسوق الآن",
    },
    image: "/placeholder.svg?height=600&width=1200",
    link: "/products?category=electronics",
  },
  {
    id: 2,
    title: {
      fr: "Collection de mode",
      ar: "مجموعة الأزياء",
    },
    description: {
      fr: "Découvrez les dernières tendances",
      ar: "اكتشف أحدث صيحات الموضة",
    },
    buttonText: {
      fr: "Voir la collection",
      ar: "عرض المجموعة",
    },
    image: "/placeholder.svg?height=600&width=1200",
    link: "/products?category=fashion",
  },
  {
    id: 3,
    title: {
      fr: "Produits artisanaux algériens",
      ar: "منتجات حرفية جزائرية",
    },
    description: {
      fr: "Soutenez les artisans locaux",
      ar: "دعم الحرفيين المحليين",
    },
    buttonText: {
      fr: "Explorer",
      ar: "استكشاف",
    },
    image: "/placeholder.svg?height=600&width=1200",
    link: "/products?category=handmade",
  },
]

export function HomeHero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const { language, isRTL } = useLanguage()

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselItems.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselItems.length) % carouselItems.length)
  }

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative overflow-hidden">
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(${-currentSlide * 100}%)` }}
      >
        {carouselItems.map((item) => (
          <div key={item.id} className="relative min-w-full h-[400px] md:h-[500px]">
            <Image
              src={item.image || "/placeholder.svg"}
              alt={item.title[language]}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/40">
              <div className="container h-full flex items-center">
                <div className={cn("max-w-lg text-white p-6", isRTL ? "text-right ml-auto" : "text-left")}>
                  <h1 className="text-3xl md:text-4xl font-bold mb-4">{item.title[language]}</h1>
                  <p className="text-lg md:text-xl mb-6">{item.description[language]}</p>
                  <Button asChild size="lg">
                    <Link href={item.link}>{item.buttonText[language]}</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation buttons */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 text-white hover:bg-black/50 rounded-full"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-6 w-6" />
        <span className="sr-only">Previous</span>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 text-white hover:bg-black/50 rounded-full"
        onClick={nextSlide}
      >
        <ChevronRight className="h-6 w-6" />
        <span className="sr-only">Next</span>
      </Button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-0 right-0">
        <div className="flex justify-center gap-2">
          {carouselItems.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full ${index === currentSlide ? "bg-white" : "bg-white/50"}`}
              onClick={() => setCurrentSlide(index)}
            >
              <span className="sr-only">Slide {index + 1}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
