"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Package, ShoppingBag, DollarSign, TrendingUp, Clock, ChevronRight, BarChart3 } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/auth-provider"
import { VendorLayout } from "@/components/layouts/vendor-layout"

// Mock data for recent orders
const recentOrders = [
  {
    id: "ORD-12345",
    date: "2023-12-20",
    status: "pending",
    total: 15900,
    customer: "Ahmed K.",
    items: [
      {
        id: 1,
        name: {
          fr: "Écouteurs sans fil",
          ar: "سماعات لاسلكية",
        },
        quantity: 1,
      },
      {
        id: 2,
        name: {
          fr: "Coque de téléphone",
          ar: "غطاء هاتف",
        },
        quantity: 2,
      },
    ],
  },
  {
    id: "ORD-12344",
    date: "2023-12-15",
    status: "confirmed",
    total: 89900,
    customer: "Samira B.",
    items: [
      {
        id: 3,
        name: {
          fr: "Smartphone Galaxy S22",
          ar: "هاتف جالاكسي S22",
        },
        quantity: 1,
      },
    ],
  },
  {
    id: "ORD-12343",
    date: "2023-12-10",
    status: "shipped",
    total: 24900,
    customer: "Karim M.",
    items: [
      {
        id: 4,
        name: {
          fr: "Cafetière automatique",
          ar: "ماكينة قهوة أوتوماتيكية",
        },
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

export default function VendorDashboard() {
  const { t, language, isRTL } = useLanguage()
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  // Redirect if not authenticated or not a vendor
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "vendor")) {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, router, user?.role])

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">{t("loading")}</div>
  }

  if (!isAuthenticated || user?.role !== "vendor") {
    return null
  }

  return (
    <VendorLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">
            {language === "fr" ? `Tableau de bord vendeur` : `لوحة تحكم البائع`}
          </h1>
          <Button asChild>
            <Link href="/vendor/products/new">{t("add_product")}</Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("total_sales")}</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPrice(1250000, language)}</div>
              <p className="text-xs text-muted-foreground">+18% {t("from_last_month")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("total_orders")}</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45</div>
              <p className="text-xs text-muted-foreground">+12 {t("this_month")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("products")}</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">3 {t("out_of_stock")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("conversion_rate")}</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.3%</div>
              <p className="text-xs text-muted-foreground">+0.5% {t("from_last_week")}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-6">
          <Card className="md:col-span-4">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{t("recent_orders")}</CardTitle>
                <CardDescription>{t("recent_orders_description")}</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/vendor/orders">{t("view_all")}</Link>
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

                      <div className="grid gap-1">
                        <div className="text-sm">
                          <span className="font-medium">{t("customer")}: </span>
                          <span>{order.customer}</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">{t("items")}: </span>
                          <span>
                            {order.items.map((item, index) => (
                              <span key={item.id}>
                                {item.name[language]} × {item.quantity}
                                {index < order.items.length - 1 ? ", " : ""}
                              </span>
                            ))}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t pt-2">
                        <div className="font-medium">
                          {t("total")}: {formatPrice(order.total, language)}
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/vendor/orders/${order.id}`}>
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
              <CardTitle>{t("sales_overview")}</CardTitle>
              <CardDescription>{t("monthly_sales_summary")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] flex items-center justify-center">
                <BarChart3 className="h-16 w-16 text-muted-foreground/50" />
              </div>
              <div className="space-y-2 mt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t("this_month")}</span>
                  <span className="font-medium">{formatPrice(350000, language)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t("last_month")}</span>
                  <span className="font-medium">{formatPrice(295000, language)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t("growth")}</span>
                  <span className="font-medium text-green-600">+18%</span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-6" asChild>
                <Link href="/vendor/analytics">{t("detailed_analytics")}</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </VendorLayout>
  )
}
