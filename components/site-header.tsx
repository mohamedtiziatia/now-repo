"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShoppingCart, User, Menu, Search, Heart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useLanguage } from "@/components/language-provider"
import { cn } from "@/lib/utils"
import { MobileNav } from "@/components/mobile-nav"
import { UserAccountNav } from "@/components/user-account-nav"
import { useAuth } from "@/components/auth-provider"

export function SiteHeader() {
  const pathname = usePathname()
  const { t, isRTL } = useLanguage()
  const { user, isAuthenticated } = useAuth()

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <MobileNav />
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center space-x-2">
            <span className="inline-block font-bold text-xl">SOUK</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link
              href="/"
              className={cn(
                "flex items-center text-sm font-medium transition-colors hover:text-primary",
                pathname === "/" ? "text-primary" : "text-muted-foreground",
              )}
            >
              {t("home")}
            </Link>
            <Link
              href="/products"
              className={cn(
                "flex items-center text-sm font-medium transition-colors hover:text-primary",
                pathname === "/products" ? "text-primary" : "text-muted-foreground",
              )}
            >
              {t("products")}
            </Link>
            <Link
              href="/contact"
              className={cn(
                "flex items-center text-sm font-medium transition-colors hover:text-primary",
                pathname === "/contact" ? "text-primary" : "text-muted-foreground",
              )}
            >
              {t("contact")}
            </Link>
          </nav>
        </div>
        <div className="hidden md:flex flex-1 items-center justify-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder={t("search_placeholder")} className={cn("pl-8", isRTL && "text-right")} />
          </div>
        </div>
        <div className="flex items-center justify-end space-x-4">
          <LanguageSwitcher />
          <nav className="flex items-center space-x-2">
            <Link href="/wishlist">
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
                <span className="sr-only">{t("wishlist")}</span>
              </Button>
            </Link>
            <Link href="/cart">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
                <span className="sr-only">{t("cart")}</span>
              </Button>
            </Link>
            {isAuthenticated ? (
              <UserAccountNav user={user} />
            ) : (
              <Link href="/login">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                  <span className="sr-only">{t("login")}</span>
                </Button>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
