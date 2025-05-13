"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Filter, ChevronDown, Star, X } from "lucide-react"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/components/language-provider"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { FeaturedProducts } from "@/components/home/featured-products"

// Mock data for categories and locations
const categories = [
  { id: "electronics", name: { fr: "Électronique", ar: "إلكترونيات" } },
  { id: "fashion", name: { fr: "Mode", ar: "أزياء" } },
  { id: "home", name: { fr: "Maison", ar: "منزل" } },
  { id: "beauty", name: { fr: "Beauté", ar: "جمال" } },
  { id: "sports", name: { fr: "Sports", ar: "رياضة" } },
  { id: "handmade", name: { fr: "Artisanat", ar: "حرف يدوية" } },
]

const locations = [
  { id: "algiers", name: { fr: "Alger", ar: "الجزائر" } },
  { id: "oran", name: { fr: "Oran", ar: "وهران" } },
  { id: "constantine", name: { fr: "Constantine", ar: "قسنطينة" } },
  { id: "annaba", name: { fr: "Annaba", ar: "عنابة" } },
  { id: "setif", name: { fr: "Sétif", ar: "سطيف" } },
]

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const { t, language, isRTL } = useLanguage()

  // Get initial category from URL if present
  const initialCategory = searchParams.get("category") || ""

  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategory ? [initialCategory] : [])
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000])
  const [rating, setRating] = useState<number | null>(null)
  const [sortBy, setSortBy] = useState("newest")
  const [searchQuery, setSearchQuery] = useState("")

  // Mobile filter sheet state
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  const handleLocationChange = (locationId: string) => {
    setSelectedLocations((prev) =>
      prev.includes(locationId) ? prev.filter((id) => id !== locationId) : [...prev, locationId],
    )
  }

  const handleRatingChange = (value: number) => {
    setRating(rating === value ? null : value)
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedLocations([])
    setPriceRange([0, 100000])
    setRating(null)
    setSortBy("newest")
    setSearchQuery("")
  }

  const hasActiveFilters = () => {
    return (
      selectedCategories.length > 0 ||
      selectedLocations.length > 0 ||
      priceRange[0] > 0 ||
      priceRange[1] < 100000 ||
      rating !== null ||
      sortBy !== "newest" ||
      searchQuery !== ""
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Input
                  placeholder={t("search_products")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-10 w-10"
                    onClick={() => setSearchQuery("")}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">{t("clear")}</span>
                  </Button>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={t("sort_by")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">{t("newest")}</SelectItem>
                  <SelectItem value="price_asc">{t("price_low_to_high")}</SelectItem>
                  <SelectItem value="price_desc">{t("price_high_to_low")}</SelectItem>
                  <SelectItem value="rating">{t("highest_rated")}</SelectItem>
                </SelectContent>
              </Select>

              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="md:hidden">
                    <Filter className="h-4 w-4 mr-2" />
                    {t("filters")}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                  <SheetHeader>
                    <SheetTitle>{t("filters")}</SheetTitle>
                  </SheetHeader>
                  <div className="py-4">
                    <MobileFilters
                      categories={categories}
                      locations={locations}
                      selectedCategories={selectedCategories}
                      selectedLocations={selectedLocations}
                      priceRange={priceRange}
                      rating={rating}
                      onCategoryChange={handleCategoryChange}
                      onLocationChange={handleLocationChange}
                      onPriceChange={setPriceRange}
                      onRatingChange={handleRatingChange}
                      onClearFilters={clearFilters}
                      language={language}
                      t={t}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Active filters */}
          {hasActiveFilters() && (
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedCategories.map((categoryId) => {
                const category = categories.find((c) => c.id === categoryId)
                return (
                  <Badge key={categoryId} variant="secondary" className="flex items-center gap-1">
                    {category?.name[language]}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => handleCategoryChange(categoryId)}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">{t("remove")}</span>
                    </Button>
                  </Badge>
                )
              })}

              {selectedLocations.map((locationId) => {
                const location = locations.find((l) => l.id === locationId)
                return (
                  <Badge key={locationId} variant="secondary" className="flex items-center gap-1">
                    {location?.name[language]}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => handleLocationChange(locationId)}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">{t("remove")}</span>
                    </Button>
                  </Badge>
                )
              })}

              {(priceRange[0] > 0 || priceRange[1] < 100000) && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {`${priceRange[0]} - ${priceRange[1]} DZD`}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => setPriceRange([0, 100000])}
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">{t("remove")}</span>
                  </Button>
                </Badge>
              )}

              {rating !== null && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {`${rating}+ ${t("stars")}`}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => setRating(null)}
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">{t("remove")}</span>
                  </Button>
                </Badge>
              )}

              <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={clearFilters}>
                {t("clear_all")}
              </Button>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-6">
            {/* Desktop sidebar filters */}
            <div className="hidden md:block w-64 shrink-0">
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-4 flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    {t("categories")}
                  </h3>
                  <div className="space-y-3">
                    {categories.map((category) => (
                      <div key={category.id} className="flex items-center space-x-2 rtl:space-x-reverse">
                        <Checkbox
                          id={`category-${category.id}`}
                          checked={selectedCategories.includes(category.id)}
                          onCheckedChange={() => handleCategoryChange(category.id)}
                        />
                        <Label htmlFor={`category-${category.id}`} className="text-sm font-normal cursor-pointer">
                          {category.name[language]}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-4">{t("price_range")}</h3>
                  <div className="px-2">
                    <Slider
                      defaultValue={[0, 100000]}
                      value={priceRange}
                      min={0}
                      max={100000}
                      step={1000}
                      onValueChange={(value) => setPriceRange(value as [number, number])}
                      className="mb-6"
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{priceRange[0]} DZD</span>
                      <span className="text-sm">{priceRange[1]} DZD</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-4">{t("rating")}</h3>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((value) => (
                      <button
                        key={value}
                        className={cn(
                          "flex items-center w-full text-sm py-1 px-2 rounded-md",
                          rating === value ? "bg-primary/10 text-primary" : "hover:bg-muted",
                        )}
                        onClick={() => handleRatingChange(value)}
                      >
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <Star
                              key={index}
                              className={cn(
                                "h-4 w-4",
                                index < value ? "fill-primary text-primary" : "text-muted-foreground",
                              )}
                            />
                          ))}
                        </div>
                        <span className="ml-2">{t("and_up")}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-4">{t("vendor_location")}</h3>
                  <div className="space-y-3">
                    {locations.map((location) => (
                      <div key={location.id} className="flex items-center space-x-2 rtl:space-x-reverse">
                        <Checkbox
                          id={`location-${location.id}`}
                          checked={selectedLocations.includes(location.id)}
                          onCheckedChange={() => handleLocationChange(location.id)}
                        />
                        <Label htmlFor={`location-${location.id}`} className="text-sm font-normal cursor-pointer">
                          {location.name[language]}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button variant="outline" className="w-full" onClick={clearFilters}>
                  {t("clear_filters")}
                </Button>
              </div>
            </div>

            {/* Product grid */}
            <div className="flex-1">
              <FeaturedProducts />
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

interface MobileFiltersProps {
  categories: typeof categories
  locations: typeof locations
  selectedCategories: string[]
  selectedLocations: string[]
  priceRange: [number, number]
  rating: number | null
  onCategoryChange: (id: string) => void
  onLocationChange: (id: string) => void
  onPriceChange: (range: [number, number]) => void
  onRatingChange: (value: number) => void
  onClearFilters: () => void
  language: "fr" | "ar"
  t: (key: string) => string
}

function MobileFilters({
  categories,
  locations,
  selectedCategories,
  selectedLocations,
  priceRange,
  rating,
  onCategoryChange,
  onLocationChange,
  onPriceChange,
  onRatingChange,
  onClearFilters,
  language,
  t,
}: MobileFiltersProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">{t("categories")}</h3>
          <ChevronDown className="h-4 w-4" />
        </div>
        <div className="pl-2 space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2 rtl:space-x-reverse">
              <Checkbox
                id={`mobile-category-${category.id}`}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={() => onCategoryChange(category.id)}
              />
              <Label htmlFor={`mobile-category-${category.id}`} className="text-sm font-normal cursor-pointer">
                {category.name[language]}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">{t("price_range")}</h3>
          <ChevronDown className="h-4 w-4" />
        </div>
        <div className="px-2">
          <Slider
            defaultValue={[0, 100000]}
            value={priceRange}
            min={0}
            max={100000}
            step={1000}
            onValueChange={(value) => onPriceChange(value as [number, number])}
            className="mb-6"
          />
          <div className="flex items-center justify-between">
            <span className="text-sm">{priceRange[0]} DZD</span>
            <span className="text-sm">{priceRange[1]} DZD</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">{t("rating")}</h3>
          <ChevronDown className="h-4 w-4" />
        </div>
        <div className="pl-2 space-y-2">
          {[5, 4, 3, 2, 1].map((value) => (
            <button
              key={value}
              className={cn(
                "flex items-center w-full text-sm py-1 px-2 rounded-md text-left",
                rating === value ? "bg-primary/10 text-primary" : "hover:bg-muted",
              )}
              onClick={() => onRatingChange(value)}
            >
              <div className="flex">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className={cn("h-4 w-4", index < value ? "fill-primary text-primary" : "text-muted-foreground")}
                  />
                ))}
              </div>
              <span className="ml-2">{t("and_up")}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">{t("vendor_location")}</h3>
          <ChevronDown className="h-4 w-4" />
        </div>
        <div className="pl-2 space-y-3">
          {locations.map((location) => (
            <div key={location.id} className="flex items-center space-x-2 rtl:space-x-reverse">
              <Checkbox
                id={`mobile-location-${location.id}`}
                checked={selectedLocations.includes(location.id)}
                onCheckedChange={() => onLocationChange(location.id)}
              />
              <Label htmlFor={`mobile-location-${location.id}`} className="text-sm font-normal cursor-pointer">
                {location.name[language]}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Button variant="outline" className="w-full" onClick={onClearFilters}>
        {t("clear_filters")}
      </Button>
    </div>
  )
}
