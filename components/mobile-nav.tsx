"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, ShoppingBag, Phone, LogIn, UserPlus } from "lucide-react"

import { useLanguage } from "@/components/language-provider"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

export function MobileNav() {
  const pathname = usePathname()
  const { t } = useLanguage()
  const { isAuthenticated, user } = useAuth()

  const routes = [
    {
      href: "/",
      label: t("home"),
      icon: <Home className="mr-2 h-4 w-4" />,
      active: pathname === "/",
    },
    {
      href: "/products",
      label: t("products"),
      icon: <ShoppingBag className="mr-2 h-4 w-4" />,
      active: pathname === "/products",
    },
    {
      href: "/contact",
      label: t("contact"),
      icon: <Phone className="mr-2 h-4 w-4" />,
      active: pathname === "/contact",
    },
  ]

  return (
    <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10">
      <div className="flex flex-col space-y-3">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center rounded-md px-3 py-2 text-sm font-medium",
              route.active ? "bg-primary text-primary-foreground" : "hover:bg-accent",
            )}
          >
            {route.icon}
            {route.label}
          </Link>
        ))}

        {!isAuthenticated ? (
          <>
            <Link href="/login">
              <Button variant="outline" className="w-full justify-start">
                <LogIn className="mr-2 h-4 w-4" />
                {t("login")}
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" className="w-full justify-start">
                <UserPlus className="mr-2 h-4 w-4" />
                {t("register")}
              </Button>
            </Link>
          </>
        ) : (
          <>
            {user?.role === "customer" && (
              <Link href="/customer/dashboard">
                <Button variant="outline" className="w-full justify-start">
                  {t("customer_dashboard")}
                </Button>
              </Link>
            )}
            {user?.role === "vendor" && (
              <Link href="/vendor/dashboard">
                <Button variant="outline" className="w-full justify-start">
                  {t("vendor_dashboard")}
                </Button>
              </Link>
            )}
            {user?.role === "admin" && (
              <Link href="/admin/dashboard">
                <Button variant="outline" className="w-full justify-start">
                  {t("admin_dashboard")}
                </Button>
              </Link>
            )}
          </>
        )}
      </div>
    </ScrollArea>
  )
}
