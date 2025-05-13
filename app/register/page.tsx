"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Mail, Lock, User, Store, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/auth-provider"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userType, setUserType] = useState<"customer" | "vendor">("customer")

  // Vendor specific fields
  const [storeName, setStoreName] = useState("")
  const [storeDescription, setStoreDescription] = useState("")
  const [documents, setDocuments] = useState<File[]>([])

  const { t } = useLanguage()
  const { register } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError(t("passwords_dont_match"))
      return
    }

    setIsLoading(true)

    try {
      const userData = {
        name,
        email,
        password,
        role: userType,
        ...(userType === "vendor" && {
          storeName,
          storeDescription,
          // In a real app, we would handle document uploads
        }),
      }

      await register(userData)
      // Redirect is handled in the auth provider
    } catch (err) {
      setError(t("registration_failed"))
      setIsLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setDocuments(Array.from(e.target.files))
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="container max-w-md">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">{t("register")}</CardTitle>
              <CardDescription>{t("create_account_description")}</CardDescription>
            </CardHeader>
            <Tabs defaultValue="customer" onValueChange={(value) => setUserType(value as "customer" | "vendor")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="customer">{t("register_as_customer")}</TabsTrigger>
                <TabsTrigger value="vendor">{t("register_as_vendor")}</TabsTrigger>
              </TabsList>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4 pt-4">
                  {error && <div className="p-3 rounded-md bg-red-50 text-red-500 text-sm">{error}</div>}

                  {/* Common fields for both customer and vendor */}
                  <div className="space-y-2">
                    <Label htmlFor="name">{t("full_name")}</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        type="text"
                        className="pl-10"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">{t("email")}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        className="pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">{t("password")}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        className="pl-10 pr-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-10 w-10"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        <span className="sr-only">{showPassword ? t("hide_password") : t("show_password")}</span>
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">{t("confirm_password")}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        className="pl-10"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Vendor specific fields */}
                  <TabsContent value="vendor" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="storeName">{t("store_name")}</Label>
                      <div className="relative">
                        <Store className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="storeName"
                          type="text"
                          className="pl-10"
                          value={storeName}
                          onChange={(e) => setStoreName(e.target.value)}
                          required={userType === "vendor"}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="storeDescription">{t("store_description")}</Label>
                      <textarea
                        id="storeDescription"
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={storeDescription}
                        onChange={(e) => setStoreDescription(e.target.value)}
                        required={userType === "vendor"}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="documents">{t("upload_documents")}</Label>
                      <div className="border border-dashed border-input rounded-md p-4">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Upload className="h-8 w-8 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground text-center">{t("drag_drop_documents")}</p>
                          <Input
                            id="documents"
                            type="file"
                            multiple
                            className="hidden"
                            onChange={handleFileChange}
                            required={userType === "vendor"}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById("documents")?.click()}
                          >
                            {t("select_files")}
                          </Button>
                        </div>
                        {documents.length > 0 && (
                          <div className="mt-4">
                            <p className="text-sm font-medium">{t("selected_files")}:</p>
                            <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                              {documents.map((file, index) => (
                                <li key={index}>{file.name}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{t("document_verification_note")}</p>
                    </div>
                  </TabsContent>
                </CardContent>
                <CardFooter className="flex flex-col">
                  <Button className="w-full" type="submit" disabled={isLoading}>
                    {isLoading ? t("loading") : t("register")}
                  </Button>
                  <p className="mt-4 text-center text-sm text-muted-foreground">
                    {t("already_have_account")}{" "}
                    <Link href="/login" className="text-primary hover:underline">
                      {t("login")}
                    </Link>
                  </p>
                </CardFooter>
              </form>
            </Tabs>
          </Card>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
