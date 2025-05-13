"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Users,
  ShoppingBag,
  Store,
  AlertTriangle,
  LogOut,
  Home,
  Settings,
  BarChart3,
  FileText,
  Bell,
  Globe,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/auth-provider"
import { cn } from "@/lib/utils"

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()
  const { t, isRTL } = useLanguage()
  const { logout } = useAuth()
  const [isMobile, setIsMobile] = useState(false)

  // Check if mobile on mount and on resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  const navigation = [
    {
      name: t("dashboard"),
      href: "/admin/dashboard",
      icon: Home,
      current: pathname === "/admin/dashboard",
    },
    {
      name: t("users"),
      href: "/admin/users",
      icon: Users,
      current: pathname === "/admin/users" || pathname.startsWith("/admin/users/"),
    },
    {
      name: t("vendors"),
      href: "/admin/vendors",
      icon: Store,
      current: pathname === "/admin/vendors" || pathname.startsWith("/admin/vendors/"),
    },
    {
      name: t("products"),
      href: "/admin/products",
      icon: ShoppingBag,
      current: pathname === "/admin/products" || pathname.startsWith("/admin/products/"),
    },
    {
      name: t("orders"),
      href: "/admin/orders",
      icon: Package,
      current: pathname === "/admin/orders" || pathname.startsWith("/admin/orders/"),
    },
    {
      name: t("reports"),
      href: "/admin/reports",
      icon: AlertTriangle,
      current: pathname === "/admin/reports" || pathname.startsWith("/admin/reports/"),
    },
    {
      name: t("analytics"),
      href: "/admin/analytics",
      icon: BarChart3,
      current: pathname === "/admin/analytics",
    },
    {
      name: t("site_settings"),
      href: "/admin/settings",
      icon: Settings,
      current: pathname === "/admin/settings",
    },
    {
      name: t("content"),
      href: "/admin/content",
      icon: FileText,
      current: pathname === "/admin/content",
    },
    {
      name: t("notifications"),
      href: "/admin/notifications",
      icon: Bell,
      current: pathname === "/admin/notifications",
    },
    {
      name: t("languages"),
      href: "/admin/languages",
      icon: Globe,
      current: pathname === "/admin/languages",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10 py-8">
        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="mb-6 md:hidden">
                <Menu className="mr-2 h-4 w-4" />
                {t("menu")}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[240px]">
              <nav className="flex flex-col gap-2 mt-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium",
                      item.current ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                ))}
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium justify-start hover:bg-muted"
                  onClick={logout}
                >
                  <LogOut className="h-5 w-5" />
                  {t("logout")}
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        ) : (
          <aside className={cn("sticky top-20 -mt-4 hidden md:block", isRTL ? "ml-6" : "mr-6")}>
            <nav className="flex flex-col gap-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium",
                    item.current ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              ))}
              <Button
                variant="ghost"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium justify-start hover:bg-muted"
                onClick={logout}
              >
                <LogOut className="h-5 w-5" />
                {t("logout")}
              </Button>
            </nav>
          </aside>
        )}
        <main className="flex w-full flex-col">{children}</main>
      </div>
      <SiteFooter />
    </div>
  )
}

function Menu(props: React.SVGProps<SVGSVGElement>) {
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
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  )
}

function Package(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  )
}
