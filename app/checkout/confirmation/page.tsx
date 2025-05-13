"use client"

import Link from "next/link"
import { CheckCircle, Package, Home, ShoppingBag } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { useLanguage } from "@/components/language-provider"

// Mock order data
const orderData = {
  id: "ORD-12346",
  date: new Date().toISOString(),
  total: 123808,
  paymentMethod: "cash_on_delivery",
  shippingAddress: {
    name: "John Doe",
    address: "123 Rue Didouche Mourad",
    city: "Alger",
    postalCode: "16000",
    country: "Algérie",
  },
}

// Format price in Algerian Dinar
function formatPrice(price: number, language: string) {
  return new Intl.NumberFormat(language === "fr" ? "fr-DZ" : "ar-DZ", {
    style: "currency",
    currency: "DZD",
    maximumFractionDigits: 0,
  }).format(price)
}

// Format date
function formatDate(dateString: string, language: string) {
  return new Date(dateString).toLocaleDateString(language === "fr" ? "fr-FR" : "ar-DZ", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function OrderConfirmationPage() {
  const { t, language } = useLanguage()

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container py-12">
          <div className="max-w-2xl mx-auto">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="rounded-full bg-green-100 p-3 mb-4">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold mb-2">{t("order_confirmed")}</h1>
              <p className="text-muted-foreground">
                {language === "fr"
                  ? `Votre commande #${orderData.id} a été confirmée et sera traitée dans les plus brefs délais.`
                  : `تم تأكيد طلبك رقم ${orderData.id} وسيتم معالجته في أقرب وقت ممكن.`}
              </p>
            </div>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{t("order_details")}</CardTitle>
                <CardDescription>
                  {t("order_number")}: {orderData.id}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground mb-1">{t("order_date")}</h3>
                    <p>{formatDate(orderData.date, language)}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground mb-1">{t("total_amount")}</h3>
                    <p>{formatPrice(orderData.total, language)}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground mb-1">{t("payment_method")}</h3>
                    <p>{t("cash_on_delivery")}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground mb-1">{t("order_status")}</h3>
                    <p>{t("processing")}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">{t("shipping_address")}</h3>
                  <p>{orderData.shippingAddress.name}</p>
                  <p>{orderData.shippingAddress.address}</p>
                  <p>
                    {orderData.shippingAddress.city}, {orderData.shippingAddress.postalCode}
                  </p>
                  <p>{orderData.shippingAddress.country}</p>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2 items-start">
                <p className="text-sm text-muted-foreground mb-2">
                  {language === "fr"
                    ? "Vous recevrez un e-mail de confirmation avec les détails de votre commande."
                    : "ستتلقى رسالة بريد إلكتروني للتأكيد مع تفاصيل طلبك."}
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/customer/orders/${orderData.id}`}>
                    <Package className="mr-2 h-4 w-4" />
                    {t("track_order")}
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" asChild>
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  {t("back_to_home")}
                </Link>
              </Button>
              <Button asChild>
                <Link href="/products">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  {t("continue_shopping")}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
