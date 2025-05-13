"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, Upload, X, Trash2, AlertCircle, PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { VendorLayout } from "@/components/layouts/vendor-layout"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/auth-provider"
import { cn } from "@/lib/utils"

// Mock categories data
const categories = [
  { id: "electronics", name: { fr: "Électronique", ar: "إلكترونيات" } },
  { id: "fashion", name: { fr: "Mode", ar: "أزياء" } },
  { id: "home", name: { fr: "Maison", ar: "منزل" } },
  { id: "beauty", name: { fr: "Beauté", ar: "جمال" } },
  { id: "sports", name: { fr: "Sports", ar: "رياضة" } },
  { id: "handmade", name: { fr: "Artisanat", ar: "حرف يدوية" } },
]

// Format price for input
function formatInputPrice(price: number) {
  return (price / 100).toFixed(2)
}

// Parse price from input
function parseInputPrice(price: string) {
  return Math.round(Number.parseFloat(price) * 100) || 0
}

export default function NewProductPage() {
  const { t, language, isRTL } = useLanguage()
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  // Form state
  const [formData, setFormData] = useState({
    name: {
      fr: "",
      ar: "",
    },
    description: {
      fr: "",
      ar: "",
    },
    price: 0,
    salePrice: 0, // Optional sale price
    cost: 0, // Cost price for profit calculation
    sku: "",
    barcode: "",
    category: "",
    stock: 1,
    weight: "", // Weight in grams
    dimensions: {
      length: "",
      width: "",
      height: "",
    },
    status: "active",
    isFeatured: false,
    isNew: true,
    tags: [],
    attributes: [{ name: "", value: "" }], // For custom attributes like color, size, etc.
  })

  // Images state
  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [currentTab, setCurrentTab] = useState("basic") // For form tabs
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // Check if user is authenticated as vendor
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "vendor")) {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, router, user?.role])

  // Handle text input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value,
        },
      }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  // Handle number input changes
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const numericValue = value === "" ? 0 : Number.parseInt(value, 10)

    setFormData((prev) => ({ ...prev, [name]: numericValue }))
  }

  // Handle price input changes
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    // Allow for decimal input (will be stored as integer)
    setFormData((prev) => ({ ...prev, [name]: parseInputPrice(value) }))
  }

  // Handle checkbox changes
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle tag input
  const [tagInput, setTagInput] = useState("")

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }))
      setTagInput("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }))
  }

  // Handle attributes
  const handleAddAttribute = () => {
    setFormData((prev) => ({
      ...prev,
      attributes: [...prev.attributes, { name: "", value: "" }],
    }))
  }

  const handleRemoveAttribute = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      attributes: prev.attributes.filter((_, i) => i !== index),
    }))
  }

  const handleAttributeChange = (index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      attributes: prev.attributes.map((attr, i) => (i === index ? { ...attr, [field]: value } : attr)),
    }))
  }

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files)
      setImages((prev) => [...prev, ...newImages])

      // Create and store image previews
      const newPreviews = newImages.map((file) => URL.createObjectURL(file))
      setImagePreviews((prev) => [...prev, ...newPreviews])
    }
  }

  const handleRemoveImage = (index: number) => {
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(imagePreviews[index])

    setImages((prev) => prev.filter((_, i) => i !== index))
    setImagePreviews((prev) => prev.filter((_, i) => i !== index))
  }

  // Validate form
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    // Basic validation
    if (!formData.name.fr) newErrors["name.fr"] = t("name_required_fr")
    if (!formData.name.ar) newErrors["name.ar"] = t("name_required_ar")
    if (!formData.description.fr) newErrors["description.fr"] = t("description_required_fr")
    if (!formData.description.ar) newErrors["description.ar"] = t("description_required_ar")
    if (formData.price <= 0) newErrors.price = t("price_required")
    if (!formData.category) newErrors.category = t("category_required")
    if (formData.stock < 0) newErrors.stock = t("stock_invalid")
    if (images.length === 0) newErrors.images = t("image_required")

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const isValid = validateForm()
    if (!isValid) {
      // If there are errors, switch to the tab that contains the first error
      const firstError = Object.keys(errors)[0]
      if (
        firstError.includes("name") ||
        firstError.includes("description") ||
        firstError.includes("category") ||
        firstError.includes("price") ||
        firstError === "images"
      ) {
        setCurrentTab("basic")
      } else if (firstError.includes("stock") || firstError.includes("dimensions") || firstError.includes("weight")) {
        setCurrentTab("inventory")
      } else if (firstError.includes("attributes")) {
        setCurrentTab("attributes")
      }
      return
    }

    setIsSubmitting(true)

    try {
      // In a real app, this would send the form data and images to an API
      console.log("Submitting product:", formData)
      console.log("Images:", images)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setSubmitSuccess(true)

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push("/vendor/products")
      }, 2000)
    } catch (error) {
      console.error("Error submitting product:", error)
      setErrors((prev) => ({ ...prev, form: t("submission_error") }))
    } finally {
      setIsSubmitting(false)
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
        <div className="flex items-center">
          <Button variant="ghost" size="sm" asChild className="mr-2">
            <Link href="/vendor/products">
              <ChevronLeft className="h-4 w-4 mr-1" />
              {t("back_to_products")}
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">{t("add_new_product")}</h1>
        </div>

        {submitSuccess ? (
          <Alert className="bg-green-50 text-green-800 border-green-200">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t("product_added_success")}</AlertTitle>
            <AlertDescription>{t("product_added_success_description")}</AlertDescription>
          </Alert>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <Tabs value={currentTab} onValueChange={setCurrentTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="basic">{t("basic_info")}</TabsTrigger>
                    <TabsTrigger value="inventory">{t("inventory")}</TabsTrigger>
                    <TabsTrigger value="attributes">{t("attributes")}</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-6 mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>{t("basic_information")}</CardTitle>
                        <CardDescription>{t("basic_information_description")}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Product Name - French */}
                        <div className="space-y-2">
                          <Label htmlFor="name.fr">
                            {t("product_name_fr")} <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="name.fr"
                            name="name.fr"
                            value={formData.name.fr}
                            onChange={handleInputChange}
                            className={cn(errors["name.fr"] && "border-red-500")}
                          />
                          {errors["name.fr"] && <p className="text-sm text-red-500">{errors["name.fr"]}</p>}
                        </div>

                        {/* Product Name - Arabic */}
                        <div className="space-y-2">
                          <Label htmlFor="name.ar">
                            {t("product_name_ar")} <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="name.ar"
                            name="name.ar"
                            value={formData.name.ar}
                            onChange={handleInputChange}
                            className={cn(errors["name.ar"] && "border-red-500", "text-right")}
                            dir="rtl"
                          />
                          {errors["name.ar"] && <p className="text-sm text-red-500">{errors["name.ar"]}</p>}
                        </div>

                        {/* Product Description - French */}
                        <div className="space-y-2">
                          <Label htmlFor="description.fr">
                            {t("product_description_fr")} <span className="text-red-500">*</span>
                          </Label>
                          <Textarea
                            id="description.fr"
                            name="description.fr"
                            value={formData.description.fr}
                            onChange={handleInputChange}
                            rows={5}
                            className={cn(errors["description.fr"] && "border-red-500")}
                          />
                          {errors["description.fr"] && (
                            <p className="text-sm text-red-500">{errors["description.fr"]}</p>
                          )}
                        </div>

                        {/* Product Description - Arabic */}
                        <div className="space-y-2">
                          <Label htmlFor="description.ar">
                            {t("product_description_ar")} <span className="text-red-500">*</span>
                          </Label>
                          <Textarea
                            id="description.ar"
                            name="description.ar"
                            value={formData.description.ar}
                            onChange={handleInputChange}
                            rows={5}
                            className={cn(errors["description.ar"] && "border-red-500", "text-right")}
                            dir="rtl"
                          />
                          {errors["description.ar"] && (
                            <p className="text-sm text-red-500">{errors["description.ar"]}</p>
                          )}
                        </div>

                        {/* Category */}
                        <div className="space-y-2">
                          <Label htmlFor="category">
                            {t("category")} <span className="text-red-500">*</span>
                          </Label>
                          <Select
                            value={formData.category}
                            onValueChange={(value) => handleSelectChange("category", value)}
                          >
                            <SelectTrigger id="category" className={cn(errors.category && "border-red-500")}>
                              <SelectValue placeholder={t("select_category")} />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                  {category.name[language]}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Regular Price */}
                          <div className="space-y-2">
                            <Label htmlFor="price">
                              {t("price")} (DZD) <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="price"
                              name="price"
                              type="number"
                              step="0.01"
                              min="0"
                              value={formatInputPrice(formData.price)}
                              onChange={handlePriceChange}
                              className={cn(errors.price && "border-red-500")}
                            />
                            {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
                          </div>

                          {/* Sale Price (optional) */}
                          <div className="space-y-2">
                            <Label htmlFor="salePrice">
                              {t("sale_price")} (DZD){" "}
                              <span className="text-muted-foreground text-xs">({t("optional")})</span>
                            </Label>
                            <Input
                              id="salePrice"
                              name="salePrice"
                              type="number"
                              step="0.01"
                              min="0"
                              value={formatInputPrice(formData.salePrice)}
                              onChange={handlePriceChange}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* SKU */}
                          <div className="space-y-2">
                            <Label htmlFor="sku">
                              {t("sku")} <span className="text-muted-foreground text-xs">({t("optional")})</span>
                            </Label>
                            <Input id="sku" name="sku" value={formData.sku} onChange={handleInputChange} />
                          </div>

                          {/* Barcode */}
                          <div className="space-y-2">
                            <Label htmlFor="barcode">
                              {t("barcode")} <span className="text-muted-foreground text-xs">({t("optional")})</span>
                            </Label>
                            <Input id="barcode" name="barcode" value={formData.barcode} onChange={handleInputChange} />
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="space-y-2">
                          <Label htmlFor="tags">{t("tags")}</Label>
                          <div className="flex space-x-2 rtl:space-x-reverse">
                            <Input
                              id="tagInput"
                              value={tagInput}
                              onChange={(e) => setTagInput(e.target.value)}
                              placeholder={t("enter_tag")}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault()
                                  handleAddTag()
                                }
                              }}
                            />
                            <Button type="button" variant="outline" onClick={handleAddTag}>
                              {t("add")}
                            </Button>
                          </div>

                          {formData.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {formData.tags.map((tag, index) => (
                                <div key={index} className="flex items-center bg-muted rounded-full px-3 py-1 text-sm">
                                  <span>{tag}</span>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-4 w-4 ml-1 text-muted-foreground hover:text-foreground"
                                    onClick={() => handleRemoveTag(tag)}
                                  >
                                    <X className="h-3 w-3" />
                                    <span className="sr-only">{t("remove")}</span>
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Product Status */}
                        <div className="space-y-2">
                          <Label>{t("product_status")}</Label>
                          <RadioGroup
                            value={formData.status}
                            onValueChange={(value) => handleSelectChange("status", value)}
                            className="flex flex-col space-y-1"
                          >
                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                              <RadioGroupItem value="active" id="active" />
                              <Label htmlFor="active" className="font-normal cursor-pointer">
                                {t("active")}
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                              <RadioGroupItem value="inactive" id="inactive" />
                              <Label htmlFor="inactive" className="font-normal cursor-pointer">
                                {t("inactive")}
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            <Checkbox
                              id="isFeatured"
                              checked={formData.isFeatured}
                              onCheckedChange={(checked) => handleCheckboxChange("isFeatured", !!checked)}
                            />
                            <Label htmlFor="isFeatured" className="font-normal cursor-pointer">
                              {t("featured_product")}
                            </Label>
                          </div>

                          <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            <Checkbox
                              id="isNew"
                              checked={formData.isNew}
                              onCheckedChange={(checked) => handleCheckboxChange("isNew", !!checked)}
                            />
                            <Label htmlFor="isNew" className="font-normal cursor-pointer">
                              {t("mark_as_new")}
                            </Label>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Product Images */}
                    <Card>
                      <CardHeader>
                        <CardTitle>{t("product_images")}</CardTitle>
                        <CardDescription>{t("product_images_description")}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div
                            className={cn(
                              "border-2 border-dashed rounded-lg p-6 text-center",
                              errors.images ? "border-red-500" : "border-muted-foreground/25",
                            )}
                          >
                            <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                            <h3 className="font-medium mb-1">{t("upload_images")}</h3>
                            <p className="text-sm text-muted-foreground mb-4">{t("drag_and_drop_images")}</p>
                            <Input
                              id="images"
                              type="file"
                              accept="image/*"
                              multiple
                              className="hidden"
                              onChange={handleImageUpload}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => document.getElementById("images")?.click()}
                            >
                              {t("select_files")}
                            </Button>
                            {errors.images && <p className="text-sm text-red-500 mt-2">{errors.images}</p>}
                          </div>

                          {/* Image Previews */}
                          {imagePreviews.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                              {imagePreviews.map((preview, index) => (
                                <div
                                  key={index}
                                  className="relative aspect-square border rounded-md overflow-hidden group"
                                >
                                  <Image
                                    src={preview || "/placeholder.svg"}
                                    alt={`Preview ${index + 1}`}
                                    fill
                                    className="object-cover"
                                  />
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => handleRemoveImage(index)}
                                  >
                                    <X className="h-3 w-3" />
                                    <span className="sr-only">{t("remove_image")}</span>
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="inventory" className="space-y-6 mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>{t("inventory_management")}</CardTitle>
                        <CardDescription>{t("inventory_management_description")}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Stock Quantity */}
                          <div className="space-y-2">
                            <Label htmlFor="stock">
                              {t("stock_quantity")} <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="stock"
                              name="stock"
                              type="number"
                              min="0"
                              value={formData.stock}
                              onChange={handleNumberChange}
                              className={cn(errors.stock && "border-red-500")}
                            />
                            {errors.stock && <p className="text-sm text-red-500">{errors.stock}</p>}
                          </div>

                          {/* Cost Price */}
                          <div className="space-y-2">
                            <Label htmlFor="cost">
                              {t("cost_price")} (DZD){" "}
                              <span className="text-muted-foreground text-xs">({t("optional")})</span>
                            </Label>
                            <Input
                              id="cost"
                              name="cost"
                              type="number"
                              step="0.01"
                              min="0"
                              value={formatInputPrice(formData.cost)}
                              onChange={handlePriceChange}
                            />
                            <p className="text-xs text-muted-foreground">{t("cost_price_description")}</p>
                          </div>
                        </div>

                        {/* Weight & Dimensions */}
                        <div className="space-y-2">
                          <Label htmlFor="weight">
                            {t("weight")} (g) <span className="text-muted-foreground text-xs">({t("optional")})</span>
                          </Label>
                          <Input
                            id="weight"
                            name="weight"
                            type="number"
                            min="0"
                            value={formData.weight}
                            onChange={handleInputChange}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>{t("dimensions")} (cm)</Label>
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <Label htmlFor="dimensions.length" className="text-sm text-muted-foreground">
                                {t("length")}
                              </Label>
                              <Input
                                id="dimensions.length"
                                name="dimensions.length"
                                type="number"
                                min="0"
                                step="0.1"
                                value={formData.dimensions.length}
                                onChange={handleInputChange}
                              />
                            </div>
                            <div>
                              <Label htmlFor="dimensions.width" className="text-sm text-muted-foreground">
                                {t("width")}
                              </Label>
                              <Input
                                id="dimensions.width"
                                name="dimensions.width"
                                type="number"
                                min="0"
                                step="0.1"
                                value={formData.dimensions.width}
                                onChange={handleInputChange}
                              />
                            </div>
                            <div>
                              <Label htmlFor="dimensions.height" className="text-sm text-muted-foreground">
                                {t("height")}
                              </Label>
                              <Input
                                id="dimensions.height"
                                name="dimensions.height"
                                type="number"
                                min="0"
                                step="0.1"
                                value={formData.dimensions.height}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="attributes" className="space-y-6 mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>{t("product_attributes")}</CardTitle>
                        <CardDescription>{t("product_attributes_description")}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {formData.attributes.map((attr, index) => (
                          <div key={index} className="grid grid-cols-1 gap-4 border-b pb-4 last:border-0">
                            <div className="flex justify-between items-center">
                              <h4 className="font-medium text-sm">
                                {t("attribute")} {index + 1}
                              </h4>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveAttribute(index)}
                                className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8"
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                {t("remove")}
                              </Button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor={`attribute-${index}-name`}>{t("attribute_name")}</Label>
                                <Input
                                  id={`attribute-${index}-name`}
                                  value={attr.name}
                                  onChange={(e) => handleAttributeChange(index, "name", e.target.value)}
                                  placeholder={t("attribute_name_placeholder")}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`attribute-${index}-value`}>{t("attribute_value")}</Label>
                                <Input
                                  id={`attribute-${index}-value`}
                                  value={attr.value}
                                  onChange={(e) => handleAttributeChange(index, "value", e.target.value)}
                                  placeholder={t("attribute_value_placeholder")}
                                />
                              </div>
                            </div>
                          </div>
                        ))}

                        <Button type="button" variant="outline" onClick={handleAddAttribute} className="w-full">
                          <PlusCircle className="h-4 w-4 mr-2" />
                          {t("add_attribute")}
                        </Button>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Right Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t("product_summary")}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">{t("name")}</h3>
                      <p className="font-medium">{formData.name[language] || t("not_specified")}</p>
                    </div>
                    <Separator />
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">{t("price")}</h3>
                      <p className="font-medium">
                        {formData.price ? formatInputPrice(formData.price) + " DZD" : t("not_specified")}
                      </p>
                    </div>
                    <Separator />
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">{t("stock")}</h3>
                      <p className="font-medium">{formData.stock}</p>
                    </div>
                    <Separator />
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">{t("category")}</h3>
                      <p className="font-medium">
                        {formData.category
                          ? categories.find((c) => c.id === formData.category)?.name[language]
                          : t("not_specified")}
                      </p>
                    </div>
                    <Separator />
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">{t("status")}</h3>
                      <p className="font-medium">{t(formData.status)}</p>
                    </div>
                    <Separator />
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">{t("images")}</h3>
                      <p className="font-medium">
                        {imagePreviews.length} {t("images_selected")}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{t("save_product")}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {errors.form && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{errors.form}</AlertDescription>
                      </Alert>
                    )}
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? t("saving") : t("save_product")}
                    </Button>
                    <Button type="button" variant="outline" className="w-full" asChild>
                      <Link href="/vendor/products">{t("cancel")}</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        )}
      </div>
    </VendorLayout>
  )
}
