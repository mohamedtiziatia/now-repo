"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  name: string
  email: string
  role: "customer" | "vendor" | "admin"
  image?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: any) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock user data for demonstration
const MOCK_USERS = [
  {
    id: "1",
    email: "customer@example.com",
    password: "password",
    name: "John Customer",
    role: "customer" as const,
  },
  {
    id: "2",
    email: "vendor@example.com",
    password: "password",
    name: "Sarah Vendor",
    role: "vendor" as const,
  },
  {
    id: "3",
    email: "admin@example.com",
    password: "password",
    name: "Admin User",
    role: "admin" as const,
  },
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Failed to parse stored user:", error)
        localStorage.removeItem("user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Mock authentication - in a real app, this would be an API call
      const foundUser = MOCK_USERS.find((u) => u.email === email && u.password === password)

      if (!foundUser) {
        console.log("Login attempt failed:", { email, availableUsers: MOCK_USERS.map((u) => u.email) })
        setIsLoading(false)
        throw new Error("Invalid credentials")
      }

      const { password: _, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)
      localStorage.setItem("user", JSON.stringify(userWithoutPassword))

      // Redirect based on role
      if (foundUser.role === "customer") {
        router.push("/customer/dashboard")
      } else if (foundUser.role === "vendor") {
        router.push("/vendor/dashboard")
      } else if (foundUser.role === "admin") {
        router.push("/admin/dashboard")
      }
    } catch (error) {
      console.error("Login failed:", error)
      setIsLoading(false)
      throw error
    }
  }

  const register = async (userData: any) => {
    setIsLoading(true)
    try {
      // Mock registration - in a real app, this would be an API call
      // For now, just simulate a successful registration
      console.log("Registering user:", userData)

      // Redirect to login page after registration
      router.push("/login")
    } catch (error) {
      console.error("Registration failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
