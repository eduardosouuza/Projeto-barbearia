"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Scissors } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function ServicesPage() {
  const [services, setServices] = useState([
    {
      id: 1,
      name: "Corte de Cabelo",
      description: "Cortes modernos e clássicos para todos os estilos. Inclui lavagem e finalização.",
      price: 45.0,
      duration: 30,
    },
    {
      id: 2,
      name: "Barba",
      description: "Modelagem e aparagem de barba com toalha quente e produtos especiais.",
      price: 35.0,
      duration: 20,
    },
    {
      id: 3,
      name: "Combo (Cabelo + Barba)",
      description: "Corte de cabelo e barba com desconto especial. O pacote completo.",
      price: 70.0,
      duration: 50,
    },
    {
      id: 4,
      name: "Corte Infantil",
      description: "Corte especial para crianças até 12 anos.",
      price: 35.0,
      duration: 20,
    },
    {
      id: 5,
      name: "Coloração",
      description: "Coloração completa com produtos de qualidade.",
      price: 80.0,
      duration: 60,
    },
    {
      id: 6,
      name: "Hidratação",
      description: "Tratamento de hidratação profunda para cabelos.",
      price: 50.0,
      duration: 40,
    },
  ])

  // Carregar serviços do localStorage
  useEffect(() => {
    const savedServices = localStorage.getItem("barberServices")
    if (savedServices) {
      setServices(JSON.parse(savedServices))
    }
  }, [])

  return (
    <div className="flex flex-col min-h-screen dark">
      <header className="border-b border-purple-900/20 bg-black">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Scissors className="h-6 w-6 text-purple-400" />
            <span className="text-xl font-bold text-white">BarberStyle</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="text-sm font-medium text-white hover:text-purple-400 transition-colors">
              Home
            </Link>
            <Link href="/services" className="text-sm font-medium text-white hover:text-purple-400 transition-colors">
              Serviços
            </Link>
            <Link href="/booking" className="text-sm font-medium text-white hover:text-purple-400 transition-colors">
              Agendar
            </Link>
            <Link href="/contact" className="text-sm font-medium text-white hover:text-purple-400 transition-colors">
              Contato
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/booking">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">Agendar Horário</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1 bg-gradient-to-b from-gray-900 to-black">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block p-2 bg-purple-600/20 rounded-full mb-4">
                  <Scissors className="h-6 w-6 text-purple-500" />
                </div>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
                  Nossos Serviços
                </h1>
                <p className="mx-auto max-w-[700px] text-purple-200 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Conheça todos os serviços oferecidos pela nossa barbearia.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 w-full">
              {services.map((service) => (
                <Card key={service.id} className="w-full bg-gray-900 border-purple-900/30 service-card-hover">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-white">{service.name}</CardTitle>
                    <CardDescription className="text-purple-300">Duração: {service.duration} minutos</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-purple-200">{service.description}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-2">
                    <p className="text-lg font-bold text-purple-400">R$ {service.price.toFixed(2)}</p>
                    <Link href={`/booking?service=${service.id}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-purple-400 text-purple-400 hover:bg-purple-400/10"
                      >
                        Agendar
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
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
          <div className="flex gap-4">
            <Link href="#" className="text-purple-400 hover:text-purple-300 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
              <span className="sr-only">Facebook</span>
            </Link>
            <Link href="#" className="text-purple-400 hover:text-purple-300 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
              <span className="sr-only">Instagram</span>
            </Link>
            <Link href="#" className="text-purple-400 hover:text-purple-300 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M22 4.01c-1 .49-1.98.689-3 .99-1.121-1.265-2.783-1.335-4.38-.737S11.977 6.323 12 8v1c-3.245.083-6.135-1.395-8-4 0 0-4.182 7.433 4 11-1.872 1.247-3.739 2.088-6 2 3.308 1.803 6.913 2.423 10.034 1.517 3.58-1.04 6.522-3.723 7.651-7.742a13.84 13.84 0 0 0 .497-3.753c0-.249 1.51-2.772 1.818-4.013z" />
              </svg>
              <span className="sr-only">Twitter</span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
