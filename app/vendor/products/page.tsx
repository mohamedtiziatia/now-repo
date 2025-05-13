"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Plus, Search, Filter, MoreVertical, Trash2, Eye, EyeOff, ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { VendorLayout } from "@/components/layouts/vendor-layout"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/auth-provider"

// Mock data for products
const mockProducts = [
  {
    id: 1,
    name: {
      fr: "Smartphone Galaxy S22",
      ar: "هاتف جالاكسي S22",
    },
    image: "/placeholder.svg?height=50&width=50",
    category: {
      fr: "Électronique",
      ar: "إلكترونيات",
    },
    price: 89900,
    stock: 15,
    salesCount: 42,
    status: "active",
    createdAt: "2023-10-15",
    updatedAt: "2023-12-20",
  },
  {
    id: 2,
    name: {
      fr: "Laptop Lenovo ThinkPad",
      ar: "لابتوب لينوفو ثينك باد",
    },
    image: "/placeholder.svg?height=50&width=50",
    category: {
      fr: "Électronique",
      ar: "إلكترونيات",
    },
    price: 159900,
    stock: 8,
    salesCount: 23,
    status: "active",
    createdAt: "2023-09-05",
    updatedAt: "2023-12-10",
  },
  {
    id: 3,
    name: {
      fr: "Écouteurs sans fil",
      ar: "سماعات لاسلكية",
    },
    image: "/placeholder.svg?height=50&width=50",
    category: {
      fr: "Électronique",
      ar: "إلكترونيات",
    },
    price: 5900,
    stock: 45,
    salesCount: 87,
    status: "active",
    createdAt: "2023-11-20",
    updatedAt: "2023-12-15",
  },
  {
    id: 4,
    name: {
      fr: "Canapé moderne en cuir",
      ar: "أريكة جلدية حديثة",
    },
    image: "/placeholder.svg?height=50&width=50",
    category: {
      fr: "Maison",
      ar: "منزل",
    },
    price: 87500,
    stock: 3,
    salesCount: 6,
    status: "active",
    createdAt: "2023-08-12",
    updatedAt: "2023-11-05",
  },
  {
    id: 5,
    name: {
      fr: "Robe traditionnelle",
      ar: "فستان تقليدي",
    },
    image: "/placeholder.svg?height=50&width=50",
    category: {
      fr: "Mode",
      ar: "أزياء",
    },
    price: 12500,
    stock: 20,
    salesCount: 18,
    status: "inactive",
    createdAt: "2023-07-25",
    updatedAt: "2023-10-30",
  },
  {
    id: 6,
    name: {
      fr: "Cafetière automatique",
      ar: "ماكينة قهوة أوتوماتيكية",
    },
    image: "/placeholder.svg?height=50&width=50",
    category: {
      fr: "Maison",
      ar: "منزل",
    },
    price: 24900,
    stock: 0,
    salesCount: 34,
    status: "out_of_stock",
    createdAt: "2023-09-18",
    updatedAt: "2023-11-28",
  },
  {
    id: 7,
    name: {
      fr: "Ensemble de vaisselle",
      ar: "طقم أواني المائدة",
    },
    image: "/placeholder.svg?height=50&width=50",
    category: {
      fr: "Maison",
      ar: "منزل",
    },
    price: 14500,
    stock: 12,
    salesCount: 15,
    status: "active",
    createdAt: "2023-10-05",
    updatedAt: "2023-12-08",
  },
  {
    id: 8,
    name: {
      fr: "Montre connectée",
      ar: "ساعة ذكية",
    },
    image: "/placeholder.svg?height=50&width=50",
    category: {
      fr: "Électronique",
      ar: "إلكترونيات",
    },
    price: 18500,
    stock: 6,
    salesCount: 29,
    status: "active",
    createdAt: "2023-11-10",
    updatedAt: "2023-12-18",
  },
  {
    id: 9,
    name: {
      fr: "Parfum Ambre Noir",
      ar: "عطر العنبر الأسود",
    },
    image: "/placeholder.svg?height=50&width=50",
    category: {
      fr: "Beauté",
      ar: "جمال",
    },
    price: 8900,
    stock: 25,
    salesCount: 52,
    status: "active",
    createdAt: "2023-08-30",
    updatedAt: "2023-11-15",
  },
  {
    id: 10,
    name: {
      fr: "Tapis berbère",
      ar: "سجادة أمازيغية",
    },
    image: "/placeholder.svg?height=50&width=50",
    category: {
      fr: "Maison",
      ar: "منزل",
    },
    price: 35000,
    stock: 4,
    salesCount: 7,
    status: "active",
    createdAt: "2023-07-15",
    updatedAt: "2023-10-25",
  },
]

// Mock categories data
const categories = [
  { id: "electronics", name: { fr: "Électronique", ar: "إلكترونيات" } },
  { id: "fashion", name: { fr: "Mode", ar: "أزياء" } },
  { id: "home", name: { fr: "Maison", ar: "منزل" } },
  { id: "beauty", name: { fr: "Beauté", ar: "جمال" } },
  { id: "sports", name: { fr: "Sports", ar: "رياضة" } },
  { id: "handmade", name: { fr: "Artisanat", ar: "حرف يدوية" } },
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

export default function VendorProductsPage() {
  const { t, language, isRTL } = useLanguage()
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  // State for products and filters
  const [products, setProducts] = useState(mockProducts)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<string>("newest")
  const [selectedProducts, setSelectedProducts] = useState<number[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 7

  // State for deletion confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<number | null>(null)
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false)

  // State for status change dialog
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [productToChangeStatus, setProductToChangeStatus] = useState<{ id: number; status: string } | null>(null)

  // Check if user is authenticated as vendor
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "vendor")) {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, router, user?.role])

  // Filter and sort products
  const filteredProducts = products.filter((product) => {
    let matchesSearch = true
    let matchesCategory = true
    let matchesStatus = true

    if (searchQuery) {
      matchesSearch = product.name[language].toLowerCase().includes(searchQuery.toLowerCase())
    }

    if (categoryFilter) {
      // This is a simplified filter by category name, in a real app you might filter by category ID
      matchesCategory = product.category[language].toLowerCase() === categoryFilter.toLowerCase()
    }

    if (statusFilter) {
      matchesStatus = product.status === statusFilter
    }

    return matchesSearch && matchesCategory && matchesStatus
  })

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case "name_asc":
        return a.name[language].localeCompare(b.name[language])
      case "name_desc":
        return b.name[language].localeCompare(a.name[language])
      case "price_asc":
        return a.price - b.price
      case "price_desc":
        return b.price - a.price
      case "stock_asc":
        return a.stock - b.stock
      case "stock_desc":
        return b.stock - a.stock
      case "sales_asc":
        return a.salesCount - b.salesCount
      case "sales_desc":
        return b.salesCount - a.salesCount
      default:
        return 0
    }
  })

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct)
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage)

  // Handle checkbox selection
  const handleSelectAll = () => {
    if (selectedProducts.length === currentProducts.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(currentProducts.map((product) => product.id))
    }
  }

  const handleSelectProduct = (productId: number) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId))
    } else {
      setSelectedProducts([...selectedProducts, productId])
    }
  }

  // Handle product deletion
  const openDeleteDialog = (productId: number) => {
    setProductToDelete(productId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (productToDelete) {
      setProducts(products.filter((product) => product.id !== productToDelete))
      setSelectedProducts(selectedProducts.filter((id) => id !== productToDelete))
      setDeleteDialogOpen(false)
      setProductToDelete(null)
    }
  }

  // Handle bulk deletion
  const openBulkDeleteDialog = () => {
    if (selectedProducts.length > 0) {
      setBulkDeleteDialogOpen(true)
    }
  }

  const confirmBulkDelete = () => {
    setProducts(products.filter((product) => !selectedProducts.includes(product.id)))
    setSelectedProducts([])
    setBulkDeleteDialogOpen(false)
  }

  // Handle status change
  const openStatusDialog = (productId: number, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active"
    setProductToChangeStatus({ id: productId, status: newStatus })
    setStatusDialogOpen(true)
  }

  const confirmStatusChange = () => {
    if (productToChangeStatus) {
      setProducts(
        products.map((product) =>
          product.id === productToChangeStatus.id ? { ...product, status: productToChangeStatus.status } : product,
        ),
      )
      setStatusDialogOpen(false)
      setProductToChangeStatus(null)
    }
  }

  // Reset filters
  const resetFilters = () => {
    setSearchQuery("")
    setCategoryFilter(null)
    setStatusFilter(null)
    setSortBy("newest")
    setCurrentPage(1)
  }

  // Render product status badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
            {t("active")}
          </Badge>
        )
      case "inactive":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
            {t("inactive")}
          </Badge>
        )
      case "out_of_stock":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
            {t("out_of_stock")}
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Render stock status
  const renderStockStatus = (stock: number) => {
    if (stock === 0) {
      return <span className="text-red-500">{t("out_of_stock")}</span>
    } else if (stock < 5) {
      return (
        <span className="text-amber-500">
          {t("low_stock")}: {stock}
        </span>
      )
    } else {
      return <span className="text-green-600">{stock}</span>
    }
  }

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">{t("loading")}</div>
  }

  if (!isAuthenticated || user?.role !== "vendor") {
    return null
  }

  return (
    <VendorLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{t("my_products")}</h1>
            <p className="text-muted-foreground">{t("manage_your_products_description")}</p>
          </div>
          <Button asChild>
            <Link href="/vendor/products/new">
              <Plus className="mr-2 h-4 w-4" />
              {t("add_product")}
            </Link>
          </Button>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
            <TabsList className="mb-2 md:mb-0">
              <TabsTrigger value="all">{t("all_products")}</TabsTrigger>
              <TabsTrigger value="active">{t("active")}</TabsTrigger>
              <TabsTrigger value="inactive">{t("inactive")}</TabsTrigger>
              <TabsTrigger value="out_of_stock">{t("out_of_stock")}</TabsTrigger>
            </TabsList>

            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <div className="relative w-full md:w-[300px]">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("search_products")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="ml-auto">
                    <Filter className="mr-2 h-4 w-4" />
                    {t("filter")}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <div className="p-2">
                    <p className="text-sm font-medium mb-2">{t("category")}</p>
                    <Select value={categoryFilter || ""} onValueChange={(value) => setCategoryFilter(value || null)}>
                      <SelectTrigger>
                        <SelectValue placeholder={t("all_categories")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t("all_categories")}</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.name[language]}>
                            {category.name[language]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <DropdownMenuSeparator />
                  <div className="p-2">
                    <p className="text-sm font-medium mb-2">{t("status")}</p>
                    <Select value={statusFilter || ""} onValueChange={(value) => setStatusFilter(value || null)}>
                      <SelectTrigger>
                        <SelectValue placeholder={t("all_statuses")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t("all_statuses")}</SelectItem>
                        <SelectItem value="active">{t("active")}</SelectItem>
                        <SelectItem value="inactive">{t("inactive")}</SelectItem>
                        <SelectItem value="out_of_stock">{t("out_of_stock")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <DropdownMenuSeparator />
                  <div className="p-2">
                    <p className="text-sm font-medium mb-2">{t("sort_by")}</p>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger>
                        <SelectValue placeholder={t("sort_by")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">{t("newest")}</SelectItem>
                        <SelectItem value="oldest">{t("oldest")}</SelectItem>
                        <SelectItem value="name_asc">{t("name_a_z")}</SelectItem>
                        <SelectItem value="name_desc">{t("name_z_a")}</SelectItem>
                        <SelectItem value="price_asc">{t("price_low_to_high")}</SelectItem>
                        <SelectItem value="price_desc">{t("price_high_to_low")}</SelectItem>
                        <SelectItem value="stock_asc">{t("stock_low_to_high")}</SelectItem>
                        <SelectItem value="stock_desc">{t("stock_high_to_low")}</SelectItem>
                        <SelectItem value="sales_asc">{t("sales_low_to_high")}</SelectItem>
                        <SelectItem value="sales_desc">{t("sales_high_to_low")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <DropdownMenuSeparator />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start font-normal px-2"
                    onClick={resetFilters}
                  >
                    {t("reset_filters")}
                  </Button>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <TabsContent value="all" className="mt-0">
            <ProductTable
              products={currentProducts}
              selectedProducts={selectedProducts}
              onSelectAll={handleSelectAll}
              onSelectProduct={handleSelectProduct}
              onDeleteProduct={openDeleteDialog}
              onChangeStatus={openStatusDialog}
              renderStatusBadge={renderStatusBadge}
              renderStockStatus={renderStockStatus}
              language={language}
              t={t}
            />
          </TabsContent>
          <TabsContent value="active" className="mt-0">
            <ProductTable
              products={currentProducts.filter((product) => product.status === "active")}
              selectedProducts={selectedProducts}
              onSelectAll={handleSelectAll}
              onSelectProduct={handleSelectProduct}
              onDeleteProduct={openDeleteDialog}
              onChangeStatus={openStatusDialog}
              renderStatusBadge={renderStatusBadge}
              renderStockStatus={renderStockStatus}
              language={language}
              t={t}
            />
          </TabsContent>
          <TabsContent value="inactive" className="mt-0">
            <ProductTable
              products={currentProducts.filter((product) => product.status === "inactive")}
              selectedProducts={selectedProducts}
              onSelectAll={handleSelectAll}
              onSelectProduct={handleSelectProduct}
              onDeleteProduct={openDeleteDialog}
              onChangeStatus={openStatusDialog}
              renderStatusBadge={renderStatusBadge}
              renderStockStatus={renderStockStatus}
              language={language}
              t={t}
            />
          </TabsContent>
          <TabsContent value="out_of_stock" className="mt-0">
            <ProductTable
              products={currentProducts.filter((product) => product.status === "out_of_stock")}
              selectedProducts={selectedProducts}
              onSelectAll={handleSelectAll}
              onSelectProduct={handleSelectProduct}
              onDeleteProduct={openDeleteDialog}
              onChangeStatus={openStatusDialog}
              renderStatusBadge={renderStatusBadge}
              renderStockStatus={renderStockStatus}
              language={language}
              t={t}
            />
          </TabsContent>
        </Tabs>

        {/* Bulk Actions and Pagination */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {selectedProducts.length > 0 ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {selectedProducts.length} {t("items_selected")}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={openBulkDeleteDialog}
                className="text-red-500 hover:text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {t("delete_selected")}
              </Button>
            </div>
          ) : (
            <div />
          )}

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
              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1
                // Show first page, last page, and pages around current page
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

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("confirm_deletion")}</DialogTitle>
              <DialogDescription>{t("delete_product_confirmation")}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                {t("cancel")}
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                {t("delete")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Bulk Delete Confirmation Dialog */}
        <Dialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("confirm_bulk_deletion")}</DialogTitle>
              <DialogDescription>
                {t("delete_multiple_products_confirmation", { count: selectedProducts.length })}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setBulkDeleteDialogOpen(false)}>
                {t("cancel")}
              </Button>
              <Button variant="destructive" onClick={confirmBulkDelete}>
                {t("delete")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Status Change Confirmation Dialog */}
        <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("confirm_status_change")}</DialogTitle>
              <DialogDescription>
                {productToChangeStatus?.status === "active"
                  ? t("activate_product_confirmation")
                  : t("deactivate_product_confirmation")}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setStatusDialogOpen(false)}>
                {t("cancel")}
              </Button>
              <Button variant="default" onClick={confirmStatusChange}>
                {t("confirm")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </VendorLayout>
  )
}

// Product Table Component
function ProductTable({
  products,
  selectedProducts,
  onSelectAll,
  onSelectProduct,
  onDeleteProduct,
  onChangeStatus,
  renderStatusBadge,
  renderStockStatus,
  language,
  t,
}: {
  products: any[]
  selectedProducts: number[]
  onSelectAll: () => void
  onSelectProduct: (id: number) => void
  onDeleteProduct: (id: number) => void
  onChangeStatus: (id: number, status: string) => void
  renderStatusBadge: (status: string) => JSX.Element
  renderStockStatus: (stock: number) => JSX.Element
  language: string
  t: (key: string, options?: any) => string
}) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={products.length > 0 && products.every((product) => selectedProducts.includes(product.id))}
                    onCheckedChange={onSelectAll}
                    aria-label={t("select_all")}
                  />
                </TableHead>
                <TableHead>{t("product")}</TableHead>
                <TableHead className="hidden md:table-cell">{t("category")}</TableHead>
                <TableHead className="text-right">{t("price")}</TableHead>
                <TableHead className="text-center hidden md:table-cell">{t("stock")}</TableHead>
                <TableHead className="text-center hidden lg:table-cell">{t("sales")}</TableHead>
                <TableHead className="text-center">{t("status")}</TableHead>
                <TableHead className="hidden lg:table-cell">{t("created")}</TableHead>
                <TableHead>{t("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center">
                      <div className="rounded-full bg-muted p-3 mb-3">
                        <ShoppingBagIcon className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <p className="text-lg font-medium mb-1">{t("no_products_found")}</p>
                      <p className="text-sm text-muted-foreground max-w-md mb-4">
                        {t("no_products_found_description")}
                      </p>
                      <Button asChild>
                        <Link href="/vendor/products/new">
                          <Plus className="mr-2 h-4 w-4" />
                          {t("add_product")}
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedProducts.includes(product.id)}
                        onCheckedChange={() => onSelectProduct(product.id)}
                        aria-label={`Select ${product.name[language]}`}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 rounded overflow-hidden border">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name[language]}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="font-medium">{product.name[language]}</div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{product.category[language]}</TableCell>
                    <TableCell className="text-right">{formatPrice(product.price, language)}</TableCell>
                    <TableCell className="text-center hidden md:table-cell">
                      {renderStockStatus(product.stock)}
                    </TableCell>
                    <TableCell className="text-center hidden lg:table-cell">{product.salesCount}</TableCell>
                    <TableCell className="text-center">{renderStatusBadge(product.status)}</TableCell>
                    <TableCell className="hidden lg:table-cell">{formatDate(product.createdAt, language)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">{t("open_menu")}</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/vendor/products/${product.id}`}>{t("view")}</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/vendor/products/${product.id}/edit`}>{t("edit")}</Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => onChangeStatus(product.id, product.status)}>
                            {product.status === "active" ? (
                              <>
                                <EyeOff className="mr-2 h-4 w-4" />
                                {t("deactivate")}
                              </>
                            ) : (
                              <>
                                <Eye className="mr-2 h-4 w-4" />
                                {t("activate")}
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => onDeleteProduct(product.id)} className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            {t("delete")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

// ShoppingBag icon component for the empty state
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
