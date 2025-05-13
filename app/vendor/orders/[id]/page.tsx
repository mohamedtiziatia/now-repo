"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  CheckCircle,
  Clock,
  TruckIcon,
  PackageOpen,
  XCircle,
  AlertCircle,
  ArrowLeft,
  Download,
  Printer,
} from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/auth-provider"
import { VendorLayout } from "@/components/layouts/vendor-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

// Mock orders data - this would come from an API in production
const mockOrders = [
  {
    id: "ORD-12345",
    customer: {
      name: "Ahmed Benaissa",
      email: "ahmed.b@example.com",
      phone: "+213 555 123 456",
    },
    items: [{ id: 1, name: { fr: "Smartphone Galaxy S22", ar: "هاتف جالاكسي S22" }, quantity: 1, price: 89900 }],
    total: 89900,
    paymentMethod: "cash_on_delivery",
    status: "pending",
    createdAt: "2023-12-20T10:30:00Z",
    updatedAt: "2023-12-20T10:30:00Z",
    shippingAddress: {
      address: "123 Rue Didouche Mourad",
      city: "Alger",
      province: "Alger",
      postalCode: "16000",
      country: "Algérie",
    },
    billingAddress: {
      address: "123 Rue Didouche Mourad",
      city: "Alger",
      province: "Alger",
      postalCode: "16000",
      country: "Algérie",
    },
    notes: "",
    statusHistory: [{ status: "pending", timestamp: "2023-12-20T10:30:00Z", comment: "Order placed" }],
  },
  {
    id: "ORD-12346",
    customer: {
      name: "Fatima Zahra",
      email: "fatima.z@example.com",
      phone: "+213 555 789 012",
    },
    items: [{ id: 2, name: { fr: "Écouteurs sans fil", ar: "سماعات لاسلكية" }, quantity: 2, price: 5900 }],
    total: 11800,
    paymentMethod: "cash_on_delivery",
    status: "confirmed",
    createdAt: "2023-12-19T14:45:00Z",
    updatedAt: "2023-12-19T15:20:00Z",
    shippingAddress: {
      address: "45 Boulevard Mohammed V",
      city: "Oran",
      province: "Oran",
      postalCode: "31000",
      country: "Algérie",
    },
    billingAddress: {
      address: "45 Boulevard Mohammed V",
      city: "Oran",
      province: "Oran",
      postalCode: "31000",
      country: "Algérie",
    },
    notes: "Please call before delivery",
    statusHistory: [
      { status: "pending", timestamp: "2023-12-19T14:45:00Z", comment: "Order placed" },
      { status: "confirmed", timestamp: "2023-12-19T15:20:00Z", comment: "Order confirmed" },
    ],
  },
  {
    id: "ORD-12347",
    customer: {
      name: "Karim Boudiaf",
      email: "karim.b@example.com",
      phone: "+213 555 456 789",
    },
    items: [
      { id: 3, name: { fr: "Laptop Lenovo ThinkPad", ar: "لابتوب لينوفو ثينك باد" }, quantity: 1, price: 159900 },
      { id: 4, name: { fr: "Souris sans fil", ar: "فأرة لاسلكية" }, quantity: 1, price: 2500 },
    ],
    total: 162400,
    paymentMethod: "cash_on_delivery",
    status: "shipped",
    createdAt: "2023-12-18T09:15:00Z",
    updatedAt: "2023-12-19T11:30:00Z",
    shippingAddress: {
      address: "78 Rue des Frères Bouadou",
      city: "Constantine",
      province: "Constantine",
      postalCode: "25000",
      country: "Algérie",
    },
    billingAddress: {
      address: "78 Rue des Frères Bouadou",
      city: "Constantine",
      province: "Constantine",
      postalCode: "25000",
      country: "Algérie",
    },
    notes: "",
    statusHistory: [
      { status: "pending", timestamp: "2023-12-18T09:15:00Z", comment: "Order placed" },
      { status: "confirmed", timestamp: "2023-12-18T10:20:00Z", comment: "Order confirmed" },
      { status: "shipped", timestamp: "2023-12-19T11:30:00Z", comment: "Order shipped via EMS" },
    ],
  },
  // Add more orders here if needed
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
  return new Date(dateString).toLocaleDateString(language === "fr" ? "fr-FR" : "ar-DZ", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

// Get order status badge
function getOrderStatusBadge(status: string) {
  switch (status) {
    case "pending":
      return {
        label: { fr: "En attente", ar: "قيد الانتظار" },
        variant: "outline" as const,
        icon: Clock,
      }
    case "confirmed":
      return {
        label: { fr: "Confirmé", ar: "مؤكد" },
        variant: "outline" as const,
        icon: CheckCircle,
      }
    case "shipped":
      return {
        label: { fr: "Expédié", ar: "تم الشحن" },
        variant: "secondary" as const,
        icon: TruckIcon,
      }
    case "delivered":
      return {
        label: { fr: "Livré", ar: "تم التوصيل" },
        variant: "default" as const,
        icon: PackageOpen,
      }
    case "cancelled":
      return {
        label: { fr: "Annulé", ar: "ملغي" },
        variant: "destructive" as const,
        icon: XCircle,
      }
    default:
      return {
        label: { fr: status, ar: status },
        variant: "outline" as const,
        icon: AlertCircle,
      }
  }
}

export default function OrderDetailsPage() {
  const { t, language } = useLanguage()
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const { id } = useParams() as { id: string }

  // Find the order by ID
  const [order, setOrder] = useState<(typeof mockOrders)[0] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would be an API call
    const foundOrder = mockOrders.find((o) => o.id === id)
    setOrder(foundOrder || null)
    setLoading(false)
  }, [id])

  // Handle back button
  const handleBack = () => {
    router.push("/vendor/orders")
  }

  // "Download" invoice (mock implementation)
  const downloadInvoice = () => {
    // In a real app, this would generate and download a PDF invoice
    console.log("Downloading invoice for order:", id)
    alert(t("invoice_download_started"))
  }

  // Print order
  const printOrder = () => {
    window.print()
  }

  if (loading) {
    return (
      <VendorLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </VendorLayout>
    )
  }

  if (!order) {
    return (
      <VendorLayout>
        <div className="space-y-6">
          <Button variant="ghost" onClick={handleBack} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("back_to_orders")}
          </Button>

          <div className="flex flex-col items-center justify-center h-[40vh]">
            <XCircle className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">{t("order_not_found")}</h2>
            <p className="text-muted-foreground mb-6">{t("order_not_found_description")}</p>
            <Button onClick={handleBack}>{t("back_to_orders")}</Button>
          </div>
        </div>
      </VendorLayout>
    )
  }

  const statusBadge = getOrderStatusBadge(order.status)
  const StatusIcon = statusBadge.icon

  return (
    <VendorLayout>
      <div className="space-y-6 print:p-6">
        {/* Non-printable controls */}
        <div className="print:hidden">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <Button variant="ghost" onClick={handleBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("back_to_orders")}
            </Button>

            <div className="flex gap-2">
              <Button variant="outline" onClick={downloadInvoice}>
                <Download className="mr-2 h-4 w-4" />
                {t("download_invoice")}
              </Button>
              <Button variant="outline" onClick={printOrder}>
                <Printer className="mr-2 h-4 w-4" />
                {t("print_order")}
              </Button>
            </div>
          </div>
        </div>

        {/* Order header - visible in print */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight print:text-3xl">
              {t("order")} #{order.id}
            </h1>
            <p className="text-muted-foreground">{formatDate(order.createdAt, language)}</p>
          </div>

          <div className="mt-2 md:mt-0">
            <Badge variant={statusBadge.variant} className="text-base px-3 py-1">
              <StatusIcon className="mr-1 h-4 w-4" />
              {statusBadge.label[language]}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle>{t("customer_information")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-1">{t("contact_details")}</h3>
                <div className="space-y-1">
                  <p>{order.customer.name}</p>
                  <p className="text-sm text-muted-foreground">{order.customer.email}</p>
                  <p className="text-sm text-muted-foreground">{order.customer.phone}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-1">{t("shipping_address")}</h3>
                <div className="space-y-1">
                  <p>{order.shippingAddress.address}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                  </p>
                  <p>{order.shippingAddress.province}</p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-1">{t("billing_address")}</h3>
                <div className="space-y-1">
                  <p>{order.billingAddress.address}</p>
                  <p>
                    {order.billingAddress.city}, {order.billingAddress.postalCode}
                  </p>
                  <p>{order.billingAddress.province}</p>
                  <p>{order.billingAddress.country}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>{t("order_summary")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-1">{t("order_details")}</h3>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("order_id")}:</span>
                    <span>{order.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("order_date")}:</span>
                    <span>{formatDate(order.createdAt, language)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("payment_method")}:</span>
                    <span>
                      {order.paymentMethod === "cash_on_delivery" ? t("cash_on_delivery") : order.paymentMethod}
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-1">{t("order_items")}</h3>
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <div>
                        <p>{item.name[language]}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity} x {formatPrice(item.price, language)}
                        </p>
                      </div>
                      <div className="font-medium">{formatPrice(item.price * item.quantity, language)}</div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <div className="flex justify-between text-lg font-bold">
                  <span>{t("total")}</span>
                  <span>{formatPrice(order.total, language)}</span>
                </div>
              </div>

              {order.notes && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold mb-1">{t("customer_notes")}</h3>
                    <p className="text-sm bg-muted/50 p-2 rounded">{order.notes}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Status History */}
        <Card>
          <CardHeader>
            <CardTitle>{t("status_history")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.statusHistory.map((status, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="min-w-8 mt-1">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      {getOrderStatusBadge(status.status).icon &&
                        (status.status === "cancelled" ? (
                          <XCircle className="h-4 w-4 text-destructive" />
                        ) : (
                          getOrderStatusBadge(status.status).icon({
                            className: "h-4 w-4 text-primary",
                          })
                        ))}
                    </div>
                  </div>
                  <div>
                    <div className="flex gap-2 mb-0.5">
                      <span className="font-medium">{getOrderStatusBadge(status.status).label[language]}</span>
                      <span className="text-muted-foreground">{formatDate(status.timestamp, language)}</span>
                    </div>
                    {status.comment && <p className="text-sm">{status.comment}</p>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Print footer */}
        <div className="hidden print:block mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>{t("thank_you_for_your_order")}</p>
          <p>{t("contact_for_questions")}</p>
        </div>
      </div>
    </VendorLayout>
  )
}
