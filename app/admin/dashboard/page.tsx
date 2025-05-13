"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Users, ShoppingBag, Store, AlertTriangle, BarChart3 } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/auth-provider"
import { AdminLayout } from "@/components/layouts/admin-layout"

// Mock data for pending vendors
const pendingVendors = [
  {
    id: 1,
    name: "TechZone",
    email: "contact@techzone.dz",
    date: "2023-12-18",
    documents: 3,
  },
  {
    id: 2,
    name: "Artisanat du Sud",
    email: "info@artisanat-sud.dz",
    date: "2023-12-15",
    documents: 2,
  },
  {
    id: 3,
    name: "Parfumerie Orientale",
    email: "contact@parfumerie-orientale.dz",
    date: "2023-12-12",
    documents: 4,
  },
]

// Mock data for reported items
const reportedItems = [
  {
    id: 1,
    type: "product",
    name: {
      fr: "Smartphone contrefait",
      ar: "هاتف ذكي مقلد",
    },
    vendor: "MobilePlus",
    date: "2023-12-19",
    reportCount: 5,
  },
  {
    id: 2,
    type: "vendor",
    name: {
      fr: "FashionFake",
      ar: "FashionFake",
    },
    vendor: "FashionFake",
    date: "2023-12-17",
    reportCount: 8,
  },
  {
    id: 3,
    type: "product",
    name: {
      fr: "Parfum non conforme",
      ar: "عطر غير مطابق",
    },
    vendor: "BeautyStore",
    date: "2023-12-14",
    reportCount: 3,
  },
]

// Format date
function formatDate(dateString: string, language: string) {
  return new Date(dateString).toLocaleDateString(language === "fr" ? "fr-FR" : "ar-DZ")
}

export default function AdminDashboard() {
  const { t, language, isRTL } = useLanguage()
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  // Redirect if not authenticated or not an admin
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "admin")) {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, router, user?.role])

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">{t("loading")}</div>
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return null
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">
            {language === "fr" ? `Tableau de bord administrateur` : `لوحة تحكم المدير`}
          </h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("total_users")}</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,248</div>
              <p className="text-xs text-muted-foreground">+86 {t("this_month")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("total_products")}</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3,456</div>
              <p className="text-xs text-muted-foreground">+124 {t("this_month")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("active_vendors")}</CardTitle>
              <Store className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">78</div>
              <p className="text-xs text-muted-foreground">+5 {t("this_month")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("pending_approvals")}</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">{t("requires_attention")}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-6">
          <Card className="md:col-span-3">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{t("pending_vendor_approvals")}</CardTitle>
                <CardDescription>{t("pending_vendor_approvals_description")}</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/vendors">{t("view_all")}</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingVendors.map((vendor) => (
                  <div key={vendor.id} className="flex items-center justify-between border-b pb-4">
                    <div>
                      <div className="font-medium">{vendor.name}</div>
                      <div className="text-sm text-muted-foreground">{vendor.email}</div>
                      <div className="text-sm text-muted-foreground">
                        {t("applied_on")}: {formatDate(vendor.date, language)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {vendor.documents} {t("documents")}
                      </Badge>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/vendors/${vendor.id}`}>{t("review")}</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-3">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{t("reported_items")}</CardTitle>
                <CardDescription>{t("reported_items_description")}</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/reports">{t("view_all")}</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportedItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between border-b pb-4">
                    <div>
                      <div className="font-medium">{item.name[language]}</div>
                      <div className="text-sm text-muted-foreground">
                        {t("type")}: {item.type === "product" ? t("product") : t("vendor")}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {t("vendor")}: {item.vendor}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive">
                        {item.reportCount} {t("reports")}
                      </Badge>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/reports/${item.id}`}>{t("investigate")}</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{t("platform_analytics")}</CardTitle>
              <CardDescription>{t("platform_analytics_description")}</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/analytics">{t("detailed_view")}</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <BarChart3 className="h-24 w-24 text-muted-foreground/50" />
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
