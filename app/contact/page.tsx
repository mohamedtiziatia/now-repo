"use client"

import type React from "react"

import { useState } from "react"
import { Mail, Phone, MapPin, Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { useLanguage } from "@/components/language-provider"
import { cn } from "@/lib/utils"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ContactPage() {
  const { t, language, isRTL } = useLanguage()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)
      setName("")
      setEmail("")
      setSubject("")
      setMessage("")

      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSuccess(false)
      }, 5000)
    }, 1500)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold mb-2">{t("contact_us")}</h1>
              <p className="text-muted-foreground">
                {language === "fr"
                  ? "Nous sommes là pour vous aider. Envoyez-nous un message et nous vous répondrons dans les plus brefs délais."
                  : "نحن هنا للمساعدة. أرسل لنا رسالة وسنرد عليك في أقرب وقت ممكن."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center">
                    <Phone className="h-5 w-5 mr-2 text-primary" />
                    {t("phone")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">+213 123 456 789</p>
                  <p className="text-muted-foreground">+213 987 654 321</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center">
                    <Mail className="h-5 w-5 mr-2 text-primary" />
                    {t("email")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">contact@souk.dz</p>
                  <p className="text-muted-foreground">support@souk.dz</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-primary" />
                    {t("address")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {language === "fr"
                      ? "123 Rue Didouche Mourad, Alger, Algérie"
                      : "123 شارع ديدوش مراد، الجزائر، الجزائر"}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>{t("send_message")}</CardTitle>
                <CardDescription>
                  {language === "fr"
                    ? "Remplissez le formulaire ci-dessous pour nous envoyer un message."
                    : "املأ النموذج أدناه لإرسال رسالة إلينا."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isSuccess && (
                  <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
                    <AlertDescription>
                      {language === "fr"
                        ? "Votre message a été envoyé avec succès. Nous vous répondrons bientôt."
                        : "تم إرسال رسالتك بنجاح. سنرد عليك قريبًا."}
                    </AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t("full_name")}</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className={cn(isRTL && "text-right")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">{t("email")}</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className={cn(isRTL && "text-right")}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">{t("subject")}</Label>
                    <Input
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                      className={cn(isRTL && "text-right")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">{t("message")}</Label>
                    <Textarea
                      id="message"
                      rows={6}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      className={cn(isRTL && "text-right")}
                    />
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? (
                      <span>{t("sending")}</span>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        {t("send_message")}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
