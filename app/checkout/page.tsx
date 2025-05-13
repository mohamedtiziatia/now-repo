"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeft, CreditCard, Truck, MapPin, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/auth-provider"

// Mock cart summary data
const cartSummary = {
  subtotal: 103200,
  shipping: 1000,
  tax: 19608,
  total: 123808,
  items: 4,
}

// Format price in Algerian Dinar
function formatPrice(price: number, language: string) {
  return new Intl.NumberFormat(language === "fr" ? "fr-DZ" : "ar-DZ", {
    style: "currency",
    currency: "DZD",
    maximumFractionDigits: 0,
  }).format(price)
}

export default function CheckoutPage() {
  const { t, language, isRTL } = useLanguage()
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("cash_on_delivery")
  const [shippingMethod, setShippingMethod] = useState("standard")

  // Form state
  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    notes: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      // Redirect to order confirmation
      router.push("/checkout/confirmation")
    }, 2000)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container py-8">
          <div className="flex items-center mb-6">
            <Button variant="ghost" size="sm" asChild className="mr-2">
              <Link href="/cart">
                <ChevronLeft className="h-4 w-4 mr-1" />
                {t("back_to_cart")}
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">{t("checkout")}</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit}>
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-primary" />
                      {t("shipping_information")}
                    </CardTitle>
                    <CardDescription>{t("enter_shipping_details")}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">{t("full_name")}</Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          required
                          className={cn(isRTL && "text-right")}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">{t("email")}</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className={cn(isRTL && "text-right")}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">{t("phone")}</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className={cn(isRTL && "text-right")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">{t("address")}</Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        className={cn(isRTL && "text-right")}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">{t("city")}</Label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                          className={cn(isRTL && "text-right")}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="postalCode">{t("postal_code")}</Label>
                        <Input
                          id="postalCode"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          required
                          className={cn(isRTL && "text-right")}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notes">{t("order_notes")}</Label>
                      <Textarea
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        placeholder={t("order_notes_placeholder")}
                        className={cn(isRTL && "text-right")}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Truck className="h-5 w-5 mr-2 text-primary" />
                      {t("shipping_method")}
                    </CardTitle>
                    <CardDescription>{t("choose_shipping_method")}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup value={shippingMethod} onValueChange={setShippingMethod} className="space-y-3">
                      <div className="flex items-center justify-between space-x-2 rtl:space-x-reverse border rounded-md p-4">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <RadioGroupItem value="standard" id="standard" />
                          <Label htmlFor="standard" className="font-normal cursor-pointer">
                            {t("standard_shipping")}
                            <p className="text-sm text-muted-foreground">{t("standard_shipping_description")}</p>
                          </Label>
                        </div>
                        <div className="font-medium">{formatPrice(1000, language)}</div>
                      </div>
                      <div className="flex items-center justify-between space-x-2 rtl:space-x-reverse border rounded-md p-4">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <RadioGroupItem value="express" id="express" />
                          <Label htmlFor="express" className="font-normal cursor-pointer">
                            {t("express_shipping")}
                            <p className="text-sm text-muted-foreground">{t("express_shipping_description")}</p>
                          </Label>
                        </div>
                        <div className="font-medium">{formatPrice(2500, language)}</div>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>

                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CreditCard className="h-5 w-5 mr-2 text-primary" />
                      {t("payment_method")}
                    </CardTitle>
                    <CardDescription>{t("choose_payment_method")}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="cash_on_delivery" onValueChange={setPaymentMethod}>
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="cash_on_delivery">{t("cash_on_delivery")}</TabsTrigger>
                        <TabsTrigger value="card" disabled>
                          {t("card_payment")}
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="cash_on_delivery" className="mt-4 space-y-4">
                        <div className="flex items-center p-4 border rounded-md bg-muted/50">
                          <Check className="h-5 w-5 mr-2 text-green-500" />
                          <div>
                            <p className="font-medium">{t("cash_on_delivery")}</p>
                            <p className="text-sm text-muted-foreground">{t("cash_on_delivery_description")}</p>
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="card" className="mt-4 space-y-4">
                        <div className="p-4 border rounded-md bg-muted/50 text-center">
                          <p className="text-muted-foreground">{t("card_payment_coming_soon")}</p>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle>{t("order_summary")}</CardTitle>
                  <CardDescription>
                    {cartSummary.items} {t("items_in_cart")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("subtotal")}</span>
                      <span>{formatPrice(cartSummary.subtotal, language)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("shipping")}</span>
                      <span>{formatPrice(cartSummary.shipping, language)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("tax")} (19%)</span>
                      <span>{formatPrice(cartSummary.tax, language)}</span>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>{t("total")}</span>
                    <span>{formatPrice(cartSummary.total, language)}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" size="lg" type="submit" disabled={isSubmitting} onClick={handleSubmit}>
                    {isSubmitting ? t("processing") : t("place_order")}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

// Helper function for RTL support
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ")
}
