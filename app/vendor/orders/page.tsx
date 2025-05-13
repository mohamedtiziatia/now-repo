"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Search,
  MoreVertical,
  Download,
  Eye,
  Clock,
  XCircle,
  CheckCircle,
  TruckIcon,
  PackageOpen,
  AlertCircle,
  Calendar,
  Printer,
  MessageSquare,
  RefreshCcw,
  Send,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VendorLayout } from "@/components/layouts/vendor-layout"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/auth-provider"

// Mock data for orders
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
  {
    id: "ORD-12348",
    customer: {
      name: "Amina Khelif",
      email: "amina.k@example.com",
      phone: "+213 555 234 567",
    },
    items: [{ id: 5, name: { fr: "Cafetière automatique", ar: "ماكينة قهوة أوتوماتيكية" }, quantity: 1, price: 24900 }],
    total: 24900,
    paymentMethod: "cash_on_delivery",
    status: "delivered",
    createdAt: "2023-12-15T16:30:00Z",
    updatedAt: "2023-12-18T14:20:00Z",
    shippingAddress: {
      address: "12 Rue de Tripoli",
      city: "Annaba",
      province: "Annaba",
      postalCode: "23000",
      country: "Algérie",
    },
    billingAddress: {
      address: "12 Rue de Tripoli",
      city: "Annaba",
      province: "Annaba",
      postalCode: "23000",
      country: "Algérie",
    },
    notes: "",
    statusHistory: [
      { status: "pending", timestamp: "2023-12-15T16:30:00Z", comment: "Order placed" },
      { status: "confirmed", timestamp: "2023-12-16T09:45:00Z", comment: "Order confirmed" },
      { status: "shipped", timestamp: "2023-12-17T10:15:00Z", comment: "Order shipped via EMS" },
      { status: "delivered", timestamp: "2023-12-18T14:20:00Z", comment: "Order delivered" },
    ],
  },
  {
    id: "ORD-12349",
    customer: {
      name: "Youcef Belaili",
      email: "youcef.b@example.com",
      phone: "+213 555 876 543",
    },
    items: [{ id: 6, name: { fr: "Tapis berbère", ar: "سجادة أمازيغية" }, quantity: 1, price: 35000 }],
    total: 35000,
    paymentMethod: "cash_on_delivery",
    status: "cancelled",
    createdAt: "2023-12-16T11:20:00Z",
    updatedAt: "2023-12-17T15:40:00Z",
    shippingAddress: {
      address: "56 Avenue de l'ALN",
      city: "Sétif",
      province: "Sétif",
      postalCode: "19000",
      country: "Algérie",
    },
    billingAddress: {
      address: "56 Avenue de l'ALN",
      city: "Sétif",
      province: "Sétif",
      postalCode: "19000",
      country: "Algérie",
    },
    notes: "",
    statusHistory: [
      { status: "pending", timestamp: "2023-12-16T11:20:00Z", comment: "Order placed" },
      { status: "cancelled", timestamp: "2023-12-17T15:40:00Z", comment: "Customer requested cancellation" },
    ],
  },
  {
    id: "ORD-12350",
    customer: {
      name: "Nassima Benhouda",
      email: "nassima.b@example.com",
      phone: "+213 555 345 678",
    },
    items: [{ id: 7, name: { fr: "Montre connectée", ar: "ساعة ذكية" }, quantity: 1, price: 18500 }],
    total: 18500,
    paymentMethod: "cash_on_delivery",
    status: "confirmed",
    createdAt: "2023-12-19T13:10:00Z",
    updatedAt: "2023-12-19T14:25:00Z",
    shippingAddress: {
      address: "23 Rue Larbi Ben M'Hidi",
      city: "Batna",
      province: "Batna",
      postalCode: "05000",
      country: "Algérie",
    },
    billingAddress: {
      address: "23 Rue Larbi Ben M'Hidi",
      city: "Batna",
      province: "Batna",
      postalCode: "05000",
      country: "Algérie",
    },
    notes: "Contact through WhatsApp before delivery",
    statusHistory: [
      { status: "pending", timestamp: "2023-12-19T13:10:00Z", comment: "Order placed" },
      { status: "confirmed", timestamp: "2023-12-19T14:25:00Z", comment: "Order confirmed" },
    ],
  },
  {
    id: "ORD-12351",
    customer: {
      name: "Mohammed Salah",
      email: "mohammed.s@example.com",
      phone: "+213 555 901 234",
    },
    items: [{ id: 8, name: { fr: "Parfum Ambre Noir", ar: "عطر العنبر الأسود" }, quantity: 2, price: 8900 }],
    total: 17800,
    paymentMethod: "cash_on_delivery",
    status: "pending",
    createdAt: "2023-12-20T09:05:00Z",
    updatedAt: "2023-12-20T09:05:00Z",
    shippingAddress: {
      address: "89 Boulevard Frantz Fanon",
      city: "Tlemcen",
      province: "Tlemcen",
      postalCode: "13000",
      country: "Algérie",
    },
    billingAddress: {
      address: "89 Boulevard Frantz Fanon",
      city: "Tlemcen",
      province: "Tlemcen",
      postalCode: "13000",
      country: "Algérie",
    },
    notes: "",
    statusHistory: [{ status: "pending", timestamp: "2023-12-20T09:05:00Z", comment: "Order placed" }],
  },
  {
    id: "ORD-12352",
    customer: {
      name: "Riad Mahrez",
      email: "riad.m@example.com",
      phone: "+213 555 678 901",
    },
    items: [{ id: 9, name: { fr: "Ensemble de vaisselle", ar: "طقم أواني المائدة" }, quantity: 1, price: 14500 }],
    total: 14500,
    paymentMethod: "cash_on_delivery",
    status: "shipped",
    createdAt: "2023-12-17T15:35:00Z",
    updatedAt: "2023-12-19T10:15:00Z",
    shippingAddress: {
      address: "34 Rue des Palmiers",
      city: "Blida",
      province: "Blida",
      postalCode: "09000",
      country: "Algérie",
    },
    billingAddress: {
      address: "34 Rue des Palmiers",
      city: "Blida",
      province: "Blida",
      postalCode: "09000",
      country: "Algérie",
    },
    notes: "",
    statusHistory: [
      { status: "pending", timestamp: "2023-12-17T15:35:00Z", comment: "Order placed" },
      { status: "confirmed", timestamp: "2023-12-18T09:20:00Z", comment: "Order confirmed" },
      { status: "shipped", timestamp: "2023-12-19T10:15:00Z", comment: "Order shipped via YASSIR Express" },
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

export default function VendorOrdersPage() {
  const { t, language, isRTL } = useLanguage()
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  // State for orders and filters
  const [orders, setOrders] = useState(mockOrders)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [dateRangeFilter, setDateRangeFilter] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedOrder, setSelectedOrder] = useState<(typeof mockOrders)[0] | null>(null)
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false)
  const [statusUpdateOpen, setStatusUpdateOpen] = useState(false)
  const [newStatus, setNewStatus] = useState<string>("")
  const [statusComment, setStatusComment] = useState<string>("")
  const [messageDialogOpen, setMessageDialogOpen] = useState(false)
  const [messageText, setMessageText] = useState("")
  const ordersPerPage = 5

  // Summary stats
  const totalOrders = orders.length
  const pendingOrders = orders.filter((order) => order.status === "pending").length
  const inProgressOrders = orders.filter((order) => ["confirmed", "shipped"].includes(order.status)).length
  const completedOrders = orders.filter((order) => order.status === "delivered").length
  const totalRevenue = orders.reduce((total, order) => total + order.total, 0)

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    let matchesSearch = true
    let matchesStatus = true
    let matchesDateRange = true

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      matchesSearch =
        order.id.toLowerCase().includes(query) ||
        order.customer.name.toLowerCase().includes(query) ||
        order.items.some((item) => item.name[language].toLowerCase().includes(query))
    }

    // Status filter
    if (statusFilter && statusFilter !== "all") {
      matchesStatus = order.status === statusFilter
    }

    // Date range filter
    if (dateRangeFilter) {
      const now = new Date()
      const orderDate = new Date(order.createdAt)

      switch (dateRangeFilter) {
        case "today":
          matchesDateRange = orderDate.toDateString() === now.toDateString()
          break
        case "yesterday": {
          const yesterday = new Date(now)
          yesterday.setDate(now.getDate() - 1)
          matchesDateRange = orderDate.toDateString() === yesterday.toDateString()
          break
        }
        case "last7days": {
          const last7Days = new Date(now)
          last7Days.setDate(now.getDate() - 7)
          matchesDateRange = orderDate >= last7Days
          break
        }
        case "thisMonth": {
          matchesDateRange = orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear()
          break
        }
        case "lastMonth": {
          const lastMonth = new Date(now)
          lastMonth.setMonth(now.getMonth() - 1)
          matchesDateRange =
            orderDate.getMonth() === lastMonth.getMonth() && orderDate.getFullYear() === lastMonth.getFullYear()
          break
        }
        default:
          matchesDateRange = true
      }
    }

    return matchesSearch && matchesStatus && matchesDateRange
  })

  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder)
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage)

  // Reset filters
  const resetFilters = () => {
    setSearchQuery("")
    setStatusFilter(null)
    setDateRangeFilter(null)
    setCurrentPage(1)
  }

  // View order details
  const openOrderDetails = (order: (typeof mockOrders)[0]) => {
    setSelectedOrder(order)
    setOrderDetailsOpen(true)
  }

  // Open status update dialog
  const openStatusUpdateDialog = (order: (typeof mockOrders)[0]) => {
    setSelectedOrder(order)
    setNewStatus(order.status)
    setStatusComment("")
    setStatusUpdateOpen(true)
  }

  // Update order status
  const updateOrderStatus = () => {
    if (!selectedOrder || !newStatus) return

    const timestamp = new Date().toISOString()

    setOrders(
      orders.map((order) => {
        if (order.id === selectedOrder.id) {
          return {
            ...order,
            status: newStatus,
            updatedAt: timestamp,
            statusHistory: [
              ...order.statusHistory,
              {
                status: newStatus,
                timestamp,
                comment: statusComment || `Status updated to ${newStatus}`,
              },
            ],
          }
        }
        return order
      }),
    )

    setStatusUpdateOpen(false)
  }

  // Open message dialog
  const openMessageDialog = (order: (typeof mockOrders)[0]) => {
    setSelectedOrder(order)
    setMessageText("")
    setMessageDialogOpen(true)
  }

  // Send message to customer (mock implementation)
  const sendMessage = () => {
    // In a real app, this would send a message to the customer
    console.log(`Message to ${selectedOrder?.customer.name}:`, messageText)
    setMessageDialogOpen(false)

    // Show success feedback (in a real app)
    alert(t("message_sent_success"))
  }

  // "Download" invoice (mock implementation)
  const downloadInvoice = (order: (typeof mockOrders)[0]) => {
    // In a real app, this would generate and download a PDF invoice
    console.log("Downloading invoice for order:", order.id)
    alert(t("invoice_download_started"))
  }

  return (
    <VendorLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("orders_management")}</h1>
          <p className="text-muted-foreground">{t("orders_management_description")}</p>
        </div>

        {/* Summary stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("total_orders")}</CardTitle>
              <ShoppingBagIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrders}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("pending_orders")}</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingOrders}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("in_progress_orders")}</CardTitle>
              <TruckIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inProgressOrders}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("completed_orders")}</CardTitle>
              <PackageOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedOrders}</div>
              <p className="text-xs text-muted-foreground">{formatPrice(totalRevenue, language)}</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
          <Tabs
            defaultValue="all"
            className="w-full md:w-auto"
            onValueChange={(value) => {
              setStatusFilter(value === "all" ? null : value)
            }}
          >
            <TabsList>
              <TabsTrigger value="all">{t("all_orders")}</TabsTrigger>
              <TabsTrigger value="pending">{t("pending")}</TabsTrigger>
              <TabsTrigger value="confirmed">{t("confirmed")}</TabsTrigger>
              <TabsTrigger value="shipped">{t("shipped")}</TabsTrigger>
              <TabsTrigger value="delivered">{t("delivered")}</TabsTrigger>
              <TabsTrigger value="cancelled">{t("cancelled")}</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-[250px]">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("search_orders")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <Calendar className="mr-2 h-4 w-4" />
                  {t("date_range")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-0" align="end">
                <div className="p-2 space-y-1">
                  <Button
                    variant={dateRangeFilter === "today" ? "secondary" : "ghost"}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setDateRangeFilter("today")}
                  >
                    {t("today")}
                  </Button>
                  <Button
                    variant={dateRangeFilter === "yesterday" ? "secondary" : "ghost"}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setDateRangeFilter("yesterday")}
                  >
                    {t("yesterday")}
                  </Button>
                  <Button
                    variant={dateRangeFilter === "last7days" ? "secondary" : "ghost"}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setDateRangeFilter("last7days")}
                  >
                    {t("last_7_days")}
                  </Button>
                  <Button
                    variant={dateRangeFilter === "thisMonth" ? "secondary" : "ghost"}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setDateRangeFilter("thisMonth")}
                  >
                    {t("this_month")}
                  </Button>
                  <Button
                    variant={dateRangeFilter === "lastMonth" ? "secondary" : "ghost"}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setDateRangeFilter("lastMonth")}
                  >
                    {t("last_month")}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setDateRangeFilter(null)}
                  >
                    {t("all_time")}
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            {(searchQuery || statusFilter || dateRangeFilter) && (
              <Button variant="ghost" onClick={resetFilters}>
                {t("reset_filters")}
              </Button>
            )}
          </div>
        </div>

        {/* Orders table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("order_id")}</TableHead>
                  <TableHead>{t("customer")}</TableHead>
                  <TableHead className="hidden md:table-cell">{t("items")}</TableHead>
                  <TableHead className="hidden lg:table-cell text-right">{t("total")}</TableHead>
                  <TableHead className="hidden md:table-cell">{t("payment_method")}</TableHead>
                  <TableHead className="text-center">{t("status")}</TableHead>
                  <TableHead className="hidden lg:table-cell">{t("date")}</TableHead>
                  <TableHead>{t("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex flex-col items-center justify-center">
                        <div className="rounded-full bg-muted p-3 mb-3">
                          <PackageIcon className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <p className="text-lg font-medium mb-1">{t("no_orders_found")}</p>
                        <p className="text-sm text-muted-foreground max-w-md mb-4">
                          {t("no_orders_found_description")}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  currentOrders.map((order) => {
                    const statusBadge = getOrderStatusBadge(order.status)
                    const StatusIcon = statusBadge.icon
                    return (
                      <TableRow key={order.id}>
                        <TableCell>
                          <div className="font-medium">{order.id}</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{order.customer.name}</div>
                          <div className="text-xs text-muted-foreground hidden md:block">{order.customer.email}</div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="text-sm">
                            {order.items.map((item, idx) => (
                              <div key={item.id}>
                                {item.name[language]} x {item.quantity}
                                {idx < order.items.length - 1 && ", "}
                              </div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-right">
                          {formatPrice(order.total, language)}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {order.paymentMethod === "cash_on_delivery" ? t("cash_on_delivery") : order.paymentMethod}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center">
                            <Badge variant={statusBadge.variant} className="flex items-center gap-1">
                              <StatusIcon className="h-3 w-3" />
                              <span>{statusBadge.label[language]}</span>
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">{formatDate(order.createdAt, language)}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                                <span className="sr-only">{t("open_menu")}</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openOrderDetails(order)}>
                                <Eye className="mr-2 h-4 w-4" />
                                {t("view_details")}
                              </DropdownMenuItem>

                              <DropdownMenuItem onClick={() => downloadInvoice(order)}>
                                <Download className="mr-2 h-4 w-4" />
                                {t("download_invoice")}
                              </DropdownMenuItem>

                              <DropdownMenuSeparator />

                              {order.status !== "delivered" && order.status !== "cancelled" && (
                                <DropdownMenuItem onClick={() => openStatusUpdateDialog(order)}>
                                  <RefreshCcw className="mr-2 h-4 w-4" />
                                  {t("update_status")}
                                </DropdownMenuItem>
                              )}

                              <DropdownMenuItem onClick={() => openMessageDialog(order)}>
                                <MessageSquare className="mr-2 h-4 w-4" />
                                {t("message_customer")}
                              </DropdownMenuItem>

                              <DropdownMenuSeparator />

                              <DropdownMenuItem asChild>
                                <Link href={`/vendor/orders/${order.id}`}>
                                  <Printer className="mr-2 h-4 w-4" />
                                  {t("print_order")}
                                </Link>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Pagination */}
        {filteredOrders.length > 0 && (
          <div className="flex items-center justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (currentPage > 1) setCurrentPage(currentPage - 1)
                    }}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }).map((_, index) => {
                  const page = index + 1
                  if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault()
                            setCurrentPage(page)
                          }}
                          isActive={page === currentPage}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  } else if (
                    (page === 2 && currentPage > 3) ||
                    (page === totalPages - 1 && currentPage < totalPages - 2)
                  ) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )
                  }
                  return null
                })}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (currentPage < totalPages) setCurrentPage(currentPage + 1)
                    }}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}

        {/* Order Details Dialog */}
        <Dialog open={orderDetailsOpen} onOpenChange={setOrderDetailsOpen}>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {t("order_details")} - {selectedOrder?.id}
              </DialogTitle>
              <DialogDescription>{formatDate(selectedOrder?.createdAt || "", language)}</DialogDescription>
            </DialogHeader>

            {selectedOrder && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Customer Info */}
                  <div>
                    <h3 className="font-semibold mb-2">{t("customer_information")}</h3>
                    <div className="space-y-1">
                      <p>{selectedOrder.customer.name}</p>
                      <p className="text-sm text-muted-foreground">{selectedOrder.customer.email}</p>
                      <p className="text-sm text-muted-foreground">{selectedOrder.customer.phone}</p>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div>
                    <h3 className="font-semibold mb-2">{t("order_summary")}</h3>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t("status")}:</span>
                        <Badge variant={getOrderStatusBadge(selectedOrder.status).variant}>
                          {getOrderStatusBadge(selectedOrder.status).label[language]}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t("payment_method")}:</span>
                        <span>
                          {selectedOrder.paymentMethod === "cash_on_delivery"
                            ? t("cash_on_delivery")
                            : selectedOrder.paymentMethod}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t("total")}:</span>
                        <span className="font-medium">{formatPrice(selectedOrder.total, language)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Shipping & Billing */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Shipping Address */}
                  <div>
                    <h3 className="font-semibold mb-2">{t("shipping_address")}</h3>
                    <div className="space-y-1">
                      <p>{selectedOrder.shippingAddress.address}</p>
                      <p>
                        {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}
                      </p>
                      <p>{selectedOrder.shippingAddress.province}</p>
                      <p>{selectedOrder.shippingAddress.country}</p>
                    </div>
                  </div>

                  {/* Billing Address */}
                  <div>
                    <h3 className="font-semibold mb-2">{t("billing_address")}</h3>
                    <div className="space-y-1">
                      <p>{selectedOrder.billingAddress.address}</p>
                      <p>
                        {selectedOrder.billingAddress.city}, {selectedOrder.billingAddress.postalCode}
                      </p>
                      <p>{selectedOrder.billingAddress.province}</p>
                      <p>{selectedOrder.billingAddress.country}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Order Items */}
                <div>
                  <h3 className="font-semibold mb-2">{t("order_items")}</h3>
                  <div className="rounded-md border divide-y">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex justify-between px-4 py-3">
                        <div>
                          <p>{item.name[language]}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.quantity} x {formatPrice(item.price, language)}
                          </p>
                        </div>
                        <div className="font-medium">{formatPrice(item.price * item.quantity, language)}</div>
                      </div>
                    ))}

                    <div className="flex justify-between px-4 py-3 bg-muted/50">
                      <div className="font-medium">{t("total")}</div>
                      <div className="font-bold">{formatPrice(selectedOrder.total, language)}</div>
                    </div>
                  </div>
                </div>

                {/* Customer Notes */}
                {selectedOrder.notes && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-2">{t("customer_notes")}</h3>
                      <div className="bg-muted/50 rounded-md p-3">
                        <p>{selectedOrder.notes}</p>
                      </div>
                    </div>
                  </>
                )}

                {/* Status History */}
                {selectedOrder.statusHistory.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-2">{t("status_history")}</h3>
                      <div className="space-y-4">
                        {selectedOrder.statusHistory.map((status, index) => (
                          <div key={index} className="flex items-start gap-2">
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
                                <span className="font-medium">
                                  {getOrderStatusBadge(status.status).label[language]}
                                </span>
                                <span className="text-muted-foreground">{formatDate(status.timestamp, language)}</span>
                              </div>
                              {status.comment && <p className="text-sm">{status.comment}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  selectedOrder && downloadInvoice(selectedOrder)
                }}
              >
                <Download className="mr-2 h-4 w-4" />
                {t("download_invoice")}
              </Button>

              {selectedOrder && selectedOrder.status !== "delivered" && selectedOrder.status !== "cancelled" && (
                <Button
                  onClick={() => {
                    setOrderDetailsOpen(false)
                    openStatusUpdateDialog(selectedOrder)
                  }}
                >
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  {t("update_status")}
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Status Update Dialog */}
        <Dialog open={statusUpdateOpen} onOpenChange={setStatusUpdateOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{t("update_order_status")}</DialogTitle>
              <DialogDescription>
                {selectedOrder?.id} - {selectedOrder?.customer.name}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("current_status")}</label>
                <div className="flex items-center gap-2">
                  <Badge variant={getOrderStatusBadge(selectedOrder?.status || "").variant}>
                    {getOrderStatusBadge(selectedOrder?.status || "").label[language]}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t("new_status")}</label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("select_status")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">{t("pending")}</SelectItem>
                    <SelectItem value="confirmed">{t("confirmed")}</SelectItem>
                    <SelectItem value="shipped">{t("shipped")}</SelectItem>
                    <SelectItem value="delivered">{t("delivered")}</SelectItem>
                    <SelectItem value="cancelled">{t("cancelled")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("comment")} ({t("optional")})
                </label>
                <Textarea
                  value={statusComment}
                  onChange={(e) => setStatusComment(e.target.value)}
                  placeholder={t("status_update_comment_placeholder")}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setStatusUpdateOpen(false)}>
                {t("cancel")}
              </Button>
              <Button onClick={updateOrderStatus}>{t("update_status")}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Message to Customer Dialog */}
        <Dialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{t("message_to_customer")}</DialogTitle>
              <DialogDescription>
                {selectedOrder?.customer.name} - {selectedOrder?.customer.email}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("message")} <span className="text-red-500">*</span>
                </label>
                <Textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder={t("message_placeholder")}
                  rows={5}
                  required
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setMessageDialogOpen(false)}>
                {t("cancel")}
              </Button>
              <Button onClick={sendMessage} disabled={!messageText.trim()}>
                <Send className="mr-2 h-4 w-4" />
                {t("send_message")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </VendorLayout>
  )
}

// Icons
function ShoppingBagIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  )
}

function PackageIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="m16.5 9.4-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.29 7 12 12 20.71 7" />
      <line x1="12" x2="12" y1="22" y2="12" />
    </svg>
  )
}

function RefreshCcwIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 21h5v-5" />
    </svg>
  )
}

function SendIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  )
}
