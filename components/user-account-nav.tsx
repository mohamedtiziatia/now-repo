"use client"

import Link from "next/link"
import { User, LogOut, ShoppingBag, Heart, Settings, Store, ShieldCheck } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/auth-provider"

interface UserAccountNavProps {
  user: {
    name: string
    email: string
    image?: string
    role: "customer" | "vendor" | "admin"
  }
}

export function UserAccountNav({ user }: UserAccountNavProps) {
  const { t, isRTL } = useLanguage()
  const { logout } = useAuth()

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.image || "/placeholder.svg"} alt={user.name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align={isRTL ? "start" : "end"} forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {user.role === "customer" && (
            <>
              <DropdownMenuItem asChild>
                <Link href="/customer/dashboard">
                  <User className="mr-2 h-4 w-4" />
                  <span>{t("dashboard")}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/customer/orders">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  <span>{t("my_orders")}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/customer/wishlist">
                  <Heart className="mr-2 h-4 w-4" />
                  <span>{t("wishlist")}</span>
                </Link>
              </DropdownMenuItem>
            </>
          )}

          {user.role === "vendor" && (
            <>
              <DropdownMenuItem asChild>
                <Link href="/vendor/dashboard">
                  <Store className="mr-2 h-4 w-4" />
                  <span>{t("vendor_dashboard")}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/vendor/products">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  <span>{t("my_products")}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/vendor/orders">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  <span>{t("orders")}</span>
                </Link>
              </DropdownMenuItem>
            </>
          )}

          {user.role === "admin" && (
            <>
              <DropdownMenuItem asChild>
                <Link href="/admin/dashboard">
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  <span>{t("admin_dashboard")}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/users">
                  <User className="mr-2 h-4 w-4" />
                  <span>{t("users")}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/products">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  <span>{t("products")}</span>
                </Link>
              </DropdownMenuItem>
            </>
          )}

          <DropdownMenuItem asChild>
            <Link href={`/${user.role}/profile`}>
              <Settings className="mr-2 h-4 w-4" />
              <span>{t("settings")}</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>{t("logout")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
