"use client"

import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"

import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"

export function SiteFooter() {
  const { t } = useLanguage()

  return (
    <footer className="bg-background border-t">
      <div className="container px-4 py-10 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-lg font-semibold">{t("about_us")}</h3>
            <p className="mt-4 text-sm text-muted-foreground">{t("footer_about_text")}</p>
            <div className="mt-4 flex space-x-4">
              <Button variant="ghost" size="icon">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Button>
              <Button variant="ghost" size="icon">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Button>
              <Button variant="ghost" size="icon">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Button>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold">{t("quick_links")}</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground">
                  {t("home")}
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-muted-foreground hover:text-foreground">
                  {t("products")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                  {t("contact")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold">{t("customer_service")}</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-foreground">
                  {t("faq")}
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-muted-foreground hover:text-foreground">
                  {t("shipping_info")}
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-muted-foreground hover:text-foreground">
                  {t("returns_policy")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold">{t("contact_us")}</h3>
            <address className="mt-4 not-italic text-sm text-muted-foreground">
              <p>123 Rue Didouche Mourad</p>
              <p>Algiers, Algeria</p>
              <p className="mt-2">contact@souk.dz</p>
              <p>+213 123 456 789</p>
            </address>
          </div>
        </div>
        <div className="mt-10 border-t pt-6 text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} Souk. {t("all_rights_reserved")}
          </p>
        </div>
      </div>
    </footer>
  )
}
