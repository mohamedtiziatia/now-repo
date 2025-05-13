"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"

import { translations } from "@/lib/translations"

type Language = "ar" | "fr"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  isRTL: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("fr")
  const [isRTL, setIsRTL] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check localStorage or browser language preference
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "ar" || savedLanguage === "fr")) {
      setLanguageState(savedLanguage)
    } else {
      // Default to French if no preference is found
      setLanguageState("fr")
    }
  }, [])

  useEffect(() => {
    // Update RTL status and document direction
    const isArabic = language === "ar"
    setIsRTL(isArabic)
    document.documentElement.dir = isArabic ? "rtl" : "ltr"
    document.documentElement.lang = language

    // Save language preference
    localStorage.setItem("language", language)
  }, [language])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    // Refresh the current page to apply language changes
    router.refresh()
  }

  const t = (key: string): string => {
    return translations[language]?.[key] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>{children}</LanguageContext.Provider>
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
