"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Package, ShoppingBag, Heart, Bell, User, Clock, ChevronRight } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/auth-provider"
import { CustomerLayout } from "@/components/layouts/customer-layout"

// Mock data for recent orders
const recentOrders = [
  {
    id: "ORD-12345",
    date: "2023-12-20",
    status: "delivered",
    total: 15900,
    items: [
      {
        id: 1,
        name: {
          fr: "Écouteurs sans fil",
          ar: "سماعات لاسلكية",
        },
        image: "/placeholder.svg?height=80&width=80",
        price: 5900,
        quantity: 1,
      },
      {
        id: 2,
        name: {
          fr: "Coque de téléphone",
          ar: "غطاء هاتف",
        },
        image: "/placeholder.svg?height=80&width=80",
        price: 1500,
        quantity: 2,
      },
    ],
  },
  {
    id: "ORD-12344",
    date: "2023-12-15",
    status: "shipped",
    total: 89900,
    items: [
      {
        id: 3,
        name: {
          fr: "Smartphone Galaxy S22",
          ar: "هاتف جالاكسي S22",
        },
        image: "/placeholder.svg?height=80&width=80",
        price: 89900,
        quantity: 1,
      },
    ],
  },
  {
    id: "ORD-12343",
    date: "2023-12-10",
    status: "delivered",
    total: 24900,
    items: [
      {
        id: 4,
        name: {
          fr: "Cafetière automatique",
          ar: "ماكينة قهوة أوتوماتيكية",
        },
        image: "/placeholder.svg?height=80&width=80",
        price: 24900,
        quantity: 1,
      },
    ],
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

// Format date
function formatDate(dateString: string, language: string) {
  return new Date(dateString).toLocaleDateString(language === "fr" ? "fr-FR" : "ar-DZ")
}

// Get status badge
function getStatusBadge(status: string, language: string) {
  switch (status) {
    case "pending":
      return {
        label: language === "fr" ? "En attente" : "قيد الانتظار",
        variant: "outline" as const,
      }
    case "confirmed":
      return {
        label: language === "fr" ? "Confirmé" : "مؤكد",
        variant: "outline" as const,
      }
    case "shipped":
      return {
        label: language === "fr" ? "Expédié" : "تم الشحن",
        variant: "secondary" as const,
      }
    case "delivered":
      return {
        label: language === "fr" ? "Livré" : "تم التوصيل",
        variant: "default" as const,
      }
    case "cancelled":
      return {
        label: language === "fr" ? "Annulé" : "ملغي",
        variant: "destructive" as const,
      }
    default:
      return {
        label: status,
        variant: "outline" as const,
      }
  }
}

export default function CustomerDashboard() {
  const { t, language, isRTL } = useLanguage()
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  // Redirect if not authenticated or not a customer
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "customer")) {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, router, user?.role])

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">{t("loading")}</div>
  }

  if (!isAuthenticated || user?.role !== "customer") {
    return null
  }

  return (
    <CustomerLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">
            {language === "fr" ? `Bonjour, ${user.name}` : `مرحبًا، ${user.name}`}
          </h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("total_orders")}</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+2 {t("this_month")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("active_orders")}</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">{t("in_transit")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("wishlist_items")}</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7</div>
              <p className="text-xs text-muted-foreground">+3 {t("last_week")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("notifications")}</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">{t("unread_notifications")}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-6">
          <Card className="md:col-span-4">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{t("recent_orders")}</CardTitle>
                <CardDescription>{t("recent_purchases_description")}</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/customer/orders">{t("view_all")}</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {recentOrders.map((order) => {
                  const status = getStatusBadge(order.status, language)
                  return (
                    <div key={order.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="font-medium">{order.id}</div>
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{formatDate(order.date, language)}</span>
                        </div>
                      </div>

                      <div className="grid gap-4">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-4">
                            <div className="relative h-16 w-16 overflow-hidden rounded-md border">
                              <Image
                                src={item.image || "/placeholder.svg"}
                                alt={item.name[language]}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 space-y-1">
                              <h4 className="font-medium">{item.name[language]}</h4>
                              <div className="flex text-sm text-muted-foreground">
                                <span>{formatPrice(item.price, language)}</span>
                                <span className="mx-1">×</span>
                                <span>{item.quantity}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between border-t pt-2">
                        <div className="font-medium">
                          {t("total")}: {formatPrice(order.total, language)}
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/customer/orders/${order.id}`}>
                            {t("view_details")}
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>{t("account_info")}</CardTitle>
              <CardDescription>{t("manage_your_account")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{t("profile")}</span>
                </div>
                <div className="rounded-md border p-3">
                  <div className="text-sm">{user.name}</div>
                  <div className="text-sm text-muted-foreground">{user.email}</div>
                </div>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="/customer/profile">{t("edit_profile")}</Link>
                </Button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{t("shipping_address")}</span>
                </div>
                <div className="rounded-md border p-3">
                  <div className="text-sm">
                    {language === "fr"
                      ? "123 Rue Didouche Mourad, Alger, 16000"
                      : "123 شارع ديدوش مراد، الجزائر، 16000"}
                  </div>
                  <div className="text-sm text-muted-foreground">{language === "fr" ? "Algérie" : "الجزائر"}</div>
                </div>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="/customer/addresses">{t("manage_addresses")}</Link>
                </Button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{t("payment_method")}</span>
                </div>
                <div className="rounded-md border p-3">
                  <div className="text-sm font-medium">{t("cash_on_delivery")}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </CustomerLayout>
  )
}

// Import missing icon
function MapPin(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function CreditCard(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  )
}
