"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Package, Heart, Bell, User, LogOut, Home, Settings, Flag } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/auth-provider"
import { cn } from "@/lib/utils"

interface CustomerLayoutProps {
  children: React.ReactNode
}

export function CustomerLayout({ children }: CustomerLayoutProps) {
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
      href: "/customer/dashboard",
      icon: Home,
      current: pathname === "/customer/dashboard",
    },
    {
      name: t("my_orders"),
      href: "/customer/orders",
      icon: Package,
      current: pathname === "/customer/orders" || pathname.startsWith("/customer/orders/"),
    },
    {
      name: t("wishlist"),
      href: "/customer/wishlist",
      icon: Heart,
      current: pathname === "/customer/wishlist",
    },
    {
      name: t("notifications"),
      href: "/customer/notifications",
      icon: Bell,
      current: pathname === "/customer/notifications",
    },
    {
      name: t("profile"),
      href: "/customer/profile",
      icon: User,
      current: pathname === "/customer/profile",
    },
    {
      name: t("report"),
      href: "/customer/report",
      icon: Flag,
      current: pathname === "/customer/report",
    },
    {
      name: t("settings"),
      href: "/customer/settings",
      icon: Settings,
      current: pathname === "/customer/settings",
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
