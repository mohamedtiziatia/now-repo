"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart, Star, Truck, Shield, Share2, Flag } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { useLanguage } from "@/components/language-provider"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { FeaturedProducts } from "@/components/home/featured-products"

// Mock product data
const product = {
  id: 1,
  name: {
    fr: "Smartphone Galaxy S22",
    ar: "هاتف جالاكسي S22",
  },
  description: {
    fr: "Le Samsung Galaxy S22 est un smartphone haut de gamme doté d'un écran Dynamic AMOLED 2X de 6,1 pouces, d'un processeur Exynos 2200, de 8 Go de RAM et d'un appareil photo principal de 50 MP. Il offre une expérience utilisateur fluide et des performances exceptionnelles.",
    ar: "سامسونج جالاكسي S22 هو هاتف ذكي متطور مزود بشاشة Dynamic AMOLED 2X مقاس 6.1 بوصة، ومعالج Exynos 2200، وذاكرة وصول عشوائي 8 جيجابايت، وكاميرا رئيسية بدقة 50 ميجابكسل. يوفر تجربة مستخدم سلسة وأداء استثنائي.",
  },
  price: 89900,
  oldPrice: 99900,
  discount: 10,
  images: [
    "/placeholder.svg?height=600&width=600",
    "/placeholder.svg?height=600&width=600",
    "/placeholder.svg?height=600&width=600",
    "/placeholder.svg?height=600&width=600",
  ],
  rating: 4.5,
  reviewCount: 128,
  stock: 15,
  specifications: {
    fr: [
      { name: "Écran", value: "6,1 pouces, Dynamic AMOLED 2X" },
      { name: "Processeur", value: "Exynos 2200" },
      { name: "RAM", value: "8 Go" },
      { name: "Stockage", value: "128 Go" },
      { name: "Caméra principale", value: "50 MP" },
      { name: "Batterie", value: "3700 mAh" },
      { name: "Système d'exploitation", value: "Android 12" },
    ],
    ar: [
      { name: "الشاشة", value: "6.1 بوصة، Dynamic AMOLED 2X" },
      { name: "المعالج", value: "Exynos 2200" },
      { name: "ذاكرة الوصول العشوائي", value: "8 جيجابايت" },
      { name: "التخزين", value: "128 جيجابايت" },
      { name: "الكاميرا الرئيسية", value: "50 ميجابكسل" },
      { name: "البطارية", value: "3700 مللي أمبير" },
      { name: "نظام التشغيل", value: "أندرويد 12" },
    ],
  },
  vendor: {
    id: 1,
    name: "ElectroShop",
    logo: "/placeholder.svg?height=100&width=100",
    rating: 4.8,
    reviewCount: 256,
    location: {
      fr: "Alger",
      ar: "الجزائر",
    },
    isVerified: true,
  },
  reviews: [
    {
      id: 1,
      user: "Ahmed K.",
      rating: 5,
      date: "2023-12-15",
      comment: {
        fr: "Excellent téléphone, livraison rapide et produit conforme à la description.",
        ar: "هاتف ممتاز، توصيل سريع والمنتج مطابق للوصف.",
      },
    },
    {
      id: 2,
      user: "Samira B.",
      rating: 4,
      date: "2023-12-10",
      comment: {
        fr: "Très bon rapport qualité-prix. L'appareil photo est impressionnant.",
        ar: "قيمة جيدة جدا مقابل المال. الكاميرا مثيرة للإعجاب.",
      },
    },
    {
      id: 3,
      user: "Karim M.",
      rating: 4,
      date: "2023-12-05",
      comment: {
        fr: "Bonne batterie et performances. Seul bémol, il chauffe un peu lors d'une utilisation intensive.",
        ar: "بطارية وأداء جيد. العيب الوحيد هو أنه يسخن قليلاً عند الاستخدام المكثف.",
      },
    },
  ],
}

// Format price in Algerian Dinar
function formatPrice(price: number, language: string) {
  return new Intl.NumberFormat(language === "fr" ? "fr-DZ" : "ar-DZ", {
    style: "currency",
    currency: "DZD",
    maximumFractionDigits: 0,
  }).format(price)
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const { t, language, isRTL } = useLanguage()
  const [mainImage, setMainImage] = useState(product.images[0])
  const [quantity, setQuantity] = useState(1)

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container py-6">
          {/* Breadcrumb */}
          <div className="flex items-center mb-6 text-sm">
            <Link href="/" className="text-muted-foreground hover:text-foreground">
              {t("home")}
            </Link>
            <span className="mx-2 text-muted-foreground">/</span>
            <Link href="/products" className="text-muted-foreground hover:text-foreground">
              {t("products")}
            </Link>
            <span className="mx-2 text-muted-foreground">/</span>
            <span className="font-medium">{product.name[language]}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Product images */}
            <div className="space-y-4">
              <div className="relative aspect-square overflow-hidden rounded-lg border">
                <Image
                  src={mainImage || "/placeholder.svg"}
                  alt={product.name[language]}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    className={cn(
                      "relative aspect-square overflow-hidden rounded-md border",
                      mainImage === image && "ring-2 ring-primary",
                    )}
                    onClick={() => setMainImage(image)}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.name[language]} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Link
                    href={`/vendors/${product.vendor.id}`}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {product.vendor.name}
                  </Link>
                  {product.vendor.isVerified && (
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                      {language === "fr" ? "Vérifié" : "موثق"}
                    </Badge>
                  )}
                </div>

                <h1 className="text-2xl md:text-3xl font-bold">{product.name[language]}</h1>

                <div className="flex items-center mt-2">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        className={cn(
                          "h-5 w-5",
                          index < Math.floor(product.rating)
                            ? "fill-primary text-primary"
                            : index < product.rating
                              ? "fill-primary text-primary" // For half stars, we'll just use full for simplicity
                              : "text-muted-foreground",
                        )}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm font-medium">{product.rating}</span>
                  <span className="mx-2 text-muted-foreground">•</span>
                  <Link href="#reviews" className="text-sm text-muted-foreground hover:text-foreground">
                    {product.reviewCount} {language === "fr" ? "avis" : "تقييم"}
                  </Link>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold">{formatPrice(product.price, language)}</span>
                  {product.oldPrice && (
                    <>
                      <span className="text-lg text-muted-foreground line-through">
                        {formatPrice(product.oldPrice, language)}
                      </span>
                      <Badge className="bg-red-500 text-white">-{product.discount}%</Badge>
                    </>
                  )}
                </div>

                <div className="flex items-center text-sm">
                  <Truck className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {language === "fr" ? "Livraison disponible à Alger" : "التوصيل متاح في الجزائر"}
                  </span>
                </div>

                <div className="flex items-center text-sm">
                  <Shield className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {language === "fr" ? "Garantie 12 mois" : "ضمان 12 شهر"}
                  </span>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-2">{t("quantity")}</h3>
                <div className="flex items-center">
                  <Button variant="outline" size="icon" onClick={decrementQuantity} disabled={quantity <= 1}>
                    <span>-</span>
                  </Button>
                  <span className="w-12 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={incrementQuantity}
                    disabled={quantity >= product.stock}
                  >
                    <span>+</span>
                  </Button>
                  <span className="ml-4 text-sm text-muted-foreground">
                    {product.stock} {t("in_stock")}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button className="flex-1">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {t("add_to_cart")}
                </Button>
                <Button variant="outline" size="icon">
                  <Heart className="h-5 w-5" />
                  <span className="sr-only">{t("add_to_wishlist")}</span>
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="h-5 w-5" />
                  <span className="sr-only">{t("share")}</span>
                </Button>
              </div>

              <div className="flex justify-end">
                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                  <Flag className="mr-2 h-4 w-4" />
                  {t("report_product")}
                </Button>
              </div>
            </div>
          </div>

          {/* Product details tabs */}
          <Tabs defaultValue="description" className="mb-12">
            <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0">
              <TabsTrigger
                value="description"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary bg-transparent px-4 py-3 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                {t("description")}
              </TabsTrigger>
              <TabsTrigger
                value="specifications"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary bg-transparent px-4 py-3 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                {t("specifications")}
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary bg-transparent px-4 py-3 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                {t("reviews")}
              </TabsTrigger>
            </TabsList>
            <div className="mt-6">
              <TabsContent value="description" className="mt-0">
                <div className="prose max-w-none dark:prose-invert">
                  <p>{product.description[language]}</p>
                </div>
              </TabsContent>
              <TabsContent value="specifications" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.specifications[language].map((spec, index) => (
                    <div key={index} className="flex justify-between py-2 border-b">
                      <span className="font-medium">{spec.name}</span>
                      <span className="text-muted-foreground">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="reviews" className="mt-0" id="reviews">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center">
                      <span className="text-4xl font-bold">{product.rating}</span>
                      <div className="flex mt-1">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Star
                            key={index}
                            className={cn(
                              "h-4 w-4",
                              index < Math.floor(product.rating)
                                ? "fill-primary text-primary"
                                : index < product.rating
                                  ? "fill-primary text-primary"
                                  : "text-muted-foreground",
                            )}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground mt-1">
                        {product.reviewCount} {language === "fr" ? "avis" : "تقييم"}
                      </span>
                    </div>
                    <div className="flex-1">
                      {[5, 4, 3, 2, 1].map((rating) => {
                        // Calculate percentage (mock data)
                        const percentage =
                          rating === 5 ? 70 : rating === 4 ? 20 : rating === 3 ? 7 : rating === 2 ? 2 : 1
                        return (
                          <div key={rating} className="flex items-center gap-2">
                            <span className="text-sm w-2">{rating}</span>
                            <Star className="h-3 w-3 fill-primary text-primary" />
                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-primary" style={{ width: `${percentage}%` }} />
                            </div>
                            <span className="text-sm text-muted-foreground w-8">{percentage}%</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-6">
                    {product.reviews.map((review) => (
                      <div key={review.id} className="space-y-2">
                        <div className="flex justify-between">
                          <div>
                            <span className="font-medium">{review.user}</span>
                            <div className="flex mt-1">
                              {Array.from({ length: 5 }).map((_, index) => (
                                <Star
                                  key={index}
                                  className={cn(
                                    "h-4 w-4",
                                    index < review.rating ? "fill-primary text-primary" : "text-muted-foreground",
                                  )}
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {new Date(review.date).toLocaleDateString(language === "fr" ? "fr-FR" : "ar-DZ")}
                          </span>
                        </div>
                        <p className="text-sm">{review.comment[language]}</p>
                        <Separator />
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>

          {/* Related products */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">{t("related_products")}</h2>
            <FeaturedProducts />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
