"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Scissors, Lock, User, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Senha para acesso ao painel administrativo
const ADMIN_PASSWORD = "barber2024"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Verificar se já está autenticado
  useEffect(() => {
    const isAuth = localStorage.getItem("barberAdmin") === "true";
    setIsAuthenticated(isAuth);
    
    if (isAuth) {
      router.push("/admin")
    }
  }, [router])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simular um pequeno delay para dar feedback visual
    setTimeout(() => {
      if (username.trim() === "admin" && password === ADMIN_PASSWORD) {
        // Salvar autenticação no localStorage
        localStorage.setItem("barberAdmin", "true")
        setIsAuthenticated(true)
        router.push("/admin")
      } else {
        setError("Usuário ou senha incorretos. Tente novamente.")
        setIsLoading(false)
      }
    }, 1000)
  }

  return (
    <div className="flex flex-col min-h-screen dark">
      <header className="border-b border-purple-900/20 bg-black sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Scissors className="h-6 w-6 text-purple-400" />
            <span className="text-xl font-bold text-white">BarberStyle</span>
          </Link>
        </div>
      </header>
      <main className="flex-1 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center bg-fixed relative">
        {/* Overlay com gradiente */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-purple-950/90 to-black opacity-90"></div>
        
        {/* Elementos decorativos */}
        <motion.div
          className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-purple-600/20 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />

        <motion.div
          className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-purple-800/20 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            delay: 1,
          }}
        />
        
        <div className="container relative z-10 flex items-center justify-center min-h-full py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
          >
            <Card className="backdrop-blur-md bg-gray-900/70 border border-purple-900/30 shadow-xl shadow-purple-900/20">
              <CardHeader className="space-y-1">
                <div className="flex justify-center mb-4">
                  <motion.div 
                    className="p-3 bg-purple-600/20 rounded-full border border-purple-500/20"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Lock className="h-8 w-8 text-purple-400" />
                  </motion.div>
                </div>
                <CardTitle className="text-2xl font-bold text-center text-white">Acesso Administrativo</CardTitle>
                <CardDescription className="text-center text-purple-300">
                  Entre com suas credenciais para acessar o painel
                </CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert variant="destructive" className="mb-4 bg-red-900/20 border-red-800 text-red-300">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-white">
                      Usuário
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-5 w-5 text-purple-400" />
                      <Input
                        id="username"
                        placeholder="Digite seu usuário"
                        className="pl-10 bg-gray-800/70 border-gray-700 focus:border-purple-500 h-12 text-white"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white">
                      Senha
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-purple-400" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Digite sua senha"
                        className="pl-10 bg-gray-800/70 border-gray-700 focus:border-purple-500 h-12 text-white"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white h-12 mt-4 shadow-lg shadow-purple-600/20 hover:shadow-purple-600/40 transition-all duration-300"
                      disabled={isLoading}
                    >
                      {isLoading ? "Autenticando..." : "Entrar"}
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-center">
                <p className="text-sm text-purple-300">
                  <span className="mr-1">Esqueceu a senha?</span>
                  <Link href="/" className="text-purple-400 hover:text-purple-300 transition-colors">
                    Contate o administrador
                  </Link>
                </p>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </main>
      <footer className="border-t border-purple-900/20 py-6 md:py-8 bg-black">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Scissors className="h-6 w-6 text-purple-400" />
            <span className="text-xl font-bold text-white">BarberStyle</span>
          </div>
          <p className="text-center text-sm text-purple-200 md:text-left">
            &copy; {new Date().getFullYear()} BarberStyle. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
