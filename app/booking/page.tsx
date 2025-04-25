"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { CalendarIcon, Check, Scissors } from "lucide-react"
import { useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

export default function BookingPage() {
  const searchParams = useSearchParams()
  const preSelectedServiceId = searchParams.get("service")

  const [date, setDate] = useState<Date | undefined>(undefined)
  const [time, setTime] = useState<string | undefined>(undefined)
  const [service, setService] = useState<string | undefined>(preSelectedServiceId || undefined)
  const [step, setStep] = useState(1)
  const [bookingComplete, setBookingComplete] = useState(false)
  const [selectedBarber, setSelectedBarber] = useState<string | undefined>(undefined)

  const services = [
    {
      id: "1",
      name: "Corte de Cabelo",
      price: 45.0,
      duration: 30,
    },
    {
      id: "2",
      name: "Barba",
      price: 35.0,
      duration: 20,
    },
    {
      id: "3",
      name: "Combo (Cabelo + Barba)",
      price: 70.0,
      duration: 50,
    },
    {
      id: "4",
      name: "Corte Infantil",
      price: 35.0,
      duration: 20,
    },
    {
      id: "5",
      name: "Coloração",
      price: 80.0,
      duration: 60,
    },
    {
      id: "6",
      name: "Hidratação",
      price: 50.0,
      duration: 40,
    },
  ]

  const availableTimes = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
  ]

  const [barbers, setBarbers] = useState([
    {
      id: "1",
      nome: "Carlos Silva",
      especialidade: "Corte Clássico, Barba",
      foto: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "2",
      nome: "Rafael Oliveira",
      especialidade: "Corte Moderno, Coloração",
      foto: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "3",
      nome: "André Santos",
      especialidade: "Barba, Tratamentos",
      foto: "/placeholder.svg?height=100&width=100",
    },
  ])

  // Carregar barbeiros do localStorage
  useEffect(() => {
    const savedBarbers = localStorage.getItem("barberBarbers")
    if (savedBarbers) {
      setBarbers(JSON.parse(savedBarbers))
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Obter os elementos do formulário com verificação de nulidade
    const form = e.target as HTMLFormElement;
    const nameEl = form.querySelector("#name");
    const emailEl = form.querySelector("#email");
    const phoneEl = form.querySelector("#phone");
    const notesEl = form.querySelector("#notes");
    
    // Criar o novo agendamento
    const newAppointment = {
      id: Date.now().toString(),
      clientName: nameEl ? (nameEl as HTMLInputElement).value : "",
      clientEmail: emailEl ? (emailEl as HTMLInputElement).value : "",
      clientPhone: phoneEl ? (phoneEl as HTMLInputElement).value : "",
      serviceId: service,
      barberId: selectedBarber,
      date: date,
      time: time,
      status: "confirmed",
      notes: notesEl ? (notesEl as HTMLTextAreaElement).value : "",
    }

    // Obter agendamentos existentes do localStorage
    const existingAppointments = localStorage.getItem("barberAppointments")
    const appointments = existingAppointments ? JSON.parse(existingAppointments) : []

    // Adicionar o novo agendamento
    appointments.push(newAppointment)

    // Salvar no localStorage
    localStorage.setItem("barberAppointments", JSON.stringify(appointments))

    // Mostrar confirmação
    setBookingComplete(true)
  }

  const nextStep = () => {
    if (step === 1 && service) {
      setStep(2)
    } else if (step === 2 && selectedBarber) {
      setStep(3)
    } else if (step === 3 && date && time) {
      setStep(4)
    }
  }

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const selectedService = services.find((s) => s.id === service)

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
        </div>
      </header>
      <main className="flex-1 bg-gradient-to-b from-gray-900 to-black">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
                  Agendar Horário
                </h1>
                <p className="mx-auto max-w-[700px] text-purple-200 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Escolha o serviço, data e horário para o seu atendimento.
                </p>
              </div>

              {!bookingComplete ? (
                <div className="w-full max-w-md mx-auto mt-8">
                  <div className="flex justify-between mb-8">
                    <div className={`flex flex-col items-center ${step >= 1 ? "text-purple-400" : "text-gray-500"}`}>
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? "bg-purple-600 text-white" : "bg-gray-800"}`}
                      >
                        1
                      </div>
                      <span className="text-sm mt-2">Serviço</span>
                    </div>
                    <div className="flex-1 flex items-center">
                      <div className={`h-1 w-full ${step >= 2 ? "bg-purple-600" : "bg-gray-800"}`}></div>
                    </div>
                    <div className={`flex flex-col items-center ${step >= 2 ? "text-purple-400" : "text-gray-500"}`}>
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? "bg-purple-600 text-white" : "bg-gray-800"}`}
                      >
                        2
                      </div>
                      <span className="text-sm mt-2">Barbeiro</span>
                    </div>
                    <div className="flex-1 flex items-center">
                      <div className={`h-1 w-full ${step >= 3 ? "bg-purple-600" : "bg-gray-800"}`}></div>
                    </div>
                    <div className={`flex flex-col items-center ${step >= 3 ? "text-purple-400" : "text-gray-500"}`}>
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? "bg-purple-600 text-white" : "bg-gray-800"}`}
                      >
                        3
                      </div>
                      <span className="text-sm mt-2">Data/Hora</span>
                    </div>
                    <div className="flex-1 flex items-center">
                      <div className={`h-1 w-full ${step >= 4 ? "bg-purple-600" : "bg-gray-800"}`}></div>
                    </div>
                    <div className={`flex flex-col items-center ${step >= 4 ? "text-purple-400" : "text-gray-500"}`}>
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 4 ? "bg-purple-600 text-white" : "bg-gray-800"}`}
                      >
                        4
                      </div>
                      <span className="text-sm mt-2">Dados</span>
                    </div>
                  </div>

                  <Card className="bg-gray-900 border-purple-900/30">
                    <CardHeader>
                      <CardTitle className="text-white">
                        {step === 1 && "Escolha o serviço"}
                        {step === 2 && "Escolha o barbeiro"}
                        {step === 3 && "Escolha a data e horário"}
                        {step === 4 && "Seus dados"}
                      </CardTitle>
                      <CardDescription className="text-purple-300">
                        {step === 1 && "Selecione o serviço desejado"}
                        {step === 2 && "Selecione o profissional de sua preferência"}
                        {step === 3 && "Selecione a data e horário disponíveis"}
                        {step === 4 && "Preencha seus dados para confirmar o agendamento"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {step === 1 && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 gap-4">
                            {services.map((s) => (
                              <div
                                key={s.id}
                                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                                  service === s.id
                                    ? "border-purple-500 bg-purple-900/30"
                                    : "border-gray-700 hover:border-purple-500/50"
                                }`}
                                onClick={() => setService(s.id)}
                              >
                                <div className="flex justify-between items-center">
                                  <div>
                                    <h3 className="font-medium text-white">{s.name}</h3>
                                    <p className="text-sm text-purple-300">Duração: {s.duration} min</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-purple-400">R$ {s.price.toFixed(2)}</span>
                                    {service === s.id && <Check className="h-5 w-5 text-purple-400" />}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {step === 2 && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 gap-4">
                            {barbers.map((barber) => (
                              <div
                                key={barber.id}
                                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                                  selectedBarber === barber.id
                                    ? "border-purple-500 bg-purple-900/30"
                                    : "border-gray-700 hover:border-purple-500/50"
                                }`}
                                onClick={() => setSelectedBarber(barber.id)}
                              >
                                <div className="flex items-center">
                                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                                    <img
                                      src={barber.foto || "/placeholder.svg"}
                                      alt={barber.nome}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div>
                                    <h3 className="font-medium text-white">{barber.nome}</h3>
                                    <p className="text-sm text-purple-300">{barber.especialidade}</p>
                                  </div>
                                  {selectedBarber === barber.id && (
                                    <Check className="h-5 w-5 text-purple-400 ml-auto" />
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {step === 3 && (
                        <div className="space-y-4">
                          <div className="flex flex-col space-y-2">
                            <Label htmlFor="date" className="text-white">
                              Data
                            </Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full justify-start text-left font-normal border-gray-700 bg-gray-800 hover:bg-gray-700",
                                    !date && "text-gray-400",
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4 text-purple-400" />
                                  {date ? format(date, "PPP") : <span>Selecione uma data</span>}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700">
                                <Calendar
                                  mode="single"
                                  selected={date}
                                  onSelect={setDate}
                                  initialFocus
                                  disabled={(date) =>
                                    date < new Date(new Date().setHours(0, 0, 0, 0)) || date.getDay() === 0
                                  }
                                  className="bg-gray-800 text-white"
                                />
                              </PopoverContent>
                            </Popover>
                          </div>

                          {date && (
                            <div className="flex flex-col space-y-2">
                              <Label htmlFor="time" className="text-white">
                                Horário
                              </Label>
                              <div className="grid grid-cols-3 gap-2">
                                {availableTimes.map((t) => (
                                  <Button
                                    key={t}
                                    type="button"
                                    variant={time === t ? "default" : "outline"}
                                    className={
                                      time === t
                                        ? "bg-purple-600 hover:bg-purple-700 text-white"
                                        : "border-gray-700 bg-gray-800 text-white hover:bg-gray-700"
                                    }
                                    onClick={() => setTime(t)}
                                  >
                                    {t}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {step === 4 && (
                        <form onSubmit={handleSubmit} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="name" className="text-white">
                              Nome completo
                            </Label>
                            <Input
                              id="name"
                              placeholder="Seu nome completo"
                              required
                              className="bg-gray-800 border-gray-700 text-white"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email" className="text-white">
                              E-mail
                            </Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder="seu@email.com"
                              required
                              className="bg-gray-800 border-gray-700 text-white"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone" className="text-white">
                              Telefone
                            </Label>
                            <Input
                              id="phone"
                              placeholder="(00) 00000-0000"
                              required
                              className="bg-gray-800 border-gray-700 text-white"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="notes" className="text-white">
                              Observações (opcional)
                            </Label>
                            <Textarea
                              id="notes"
                              placeholder="Alguma observação especial?"
                              className="bg-gray-800 border-gray-700 text-white"
                            />
                          </div>

                          <div className="border rounded-lg p-4 bg-gray-800/50 border-gray-700">
                            <h3 className="font-medium mb-2 text-white">Resumo do agendamento</h3>
                            <div className="space-y-1 text-sm">
                              <p className="text-purple-200">
                                <span className="font-medium text-white">Serviço:</span> {selectedService?.name}
                              </p>
                              <p className="text-purple-200">
                                <span className="font-medium text-white">Barbeiro:</span>{" "}
                                {barbers.find((b) => b.id === selectedBarber)?.nome}
                              </p>
                              <p className="text-purple-200">
                                <span className="font-medium text-white">Data:</span> {date ? format(date, "PPP") : ""}
                              </p>
                              <p className="text-purple-200">
                                <span className="font-medium text-white">Horário:</span> {time}
                              </p>
                              <p className="text-purple-200">
                                <span className="font-medium text-white">Valor:</span> R${" "}
                                {selectedService?.price.toFixed(2)}
                              </p>
                            </div>
                          </div>

                          <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                            Confirmar Agendamento
                          </Button>
                        </form>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button
                        variant="outline"
                        onClick={prevStep}
                        disabled={step === 1}
                        className="border-gray-700 bg-gray-800 text-white hover:bg-gray-700"
                      >
                        Voltar
                      </Button>
                      {step < 4 ? (
                        <Button
                          onClick={nextStep}
                          disabled={
                            (step === 1 && !service) ||
                            (step === 2 && !selectedBarber) ||
                            (step === 3 && (!date || !time))
                          }
                          className="bg-purple-600 hover:bg-purple-700 text-white"
                        >
                          Próximo
                        </Button>
                      ) : null}
                    </CardFooter>
                  </Card>
                </div>
              ) : (
                <div className="w-full max-w-md mx-auto mt-8">
                  <Card className="bg-gray-900 border-purple-900/30">
                    <CardHeader>
                      <div className="mx-auto bg-purple-600/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                        <Check className="h-6 w-6 text-purple-400" />
                      </div>
                      <CardTitle className="text-center text-white">Agendamento Confirmado!</CardTitle>
                      <CardDescription className="text-center text-purple-300">
                        Seu horário foi agendado com sucesso.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="border rounded-lg p-4 bg-gray-800/50 border-gray-700">
                        <h3 className="font-medium mb-2 text-white">Detalhes do agendamento</h3>
                        <div className="space-y-1 text-sm">
                          <p className="text-purple-200">
                            <span className="font-medium text-white">Serviço:</span> {selectedService?.name}
                          </p>
                          <p className="text-purple-200">
                            <span className="font-medium text-white">Barbeiro:</span>{" "}
                            {barbers.find((b) => b.id === selectedBarber)?.nome}
                          </p>
                          <p className="text-purple-200">
                            <span className="font-medium text-white">Data:</span> {date ? format(date, "PPP") : ""}
                          </p>
                          <p className="text-purple-200">
                            <span className="font-medium text-white">Horário:</span> {time}
                          </p>
                          <p className="text-purple-200">
                            <span className="font-medium text-white">Valor:</span> R${" "}
                            {selectedService?.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <p className="text-center text-purple-300 mt-4">
                        Enviamos um e-mail de confirmação com os detalhes do seu agendamento.
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                      <Link href="/">
                        <Button className="bg-purple-600 hover:bg-purple-700 text-white">Voltar para a Home</Button>
                      </Link>
                    </CardFooter>
                  </Card>
                </div>
              )}
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
        </div>
      </footer>
    </div>
  )
}

function Label({ htmlFor, children, className }: { htmlFor: string; children: React.ReactNode; className?: string }) {
  return (
    <label
      htmlFor={htmlFor}
      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
    >
      {children}
    </label>
  )
}

function format(date: Date, format: string) {
  const day = date.getDate().toString().padStart(2, "0")
  const month = (date.getMonth() + 1).toString().padStart(2, "0")
  const year = date.getFullYear()

  return `${day}/${month}/${year}`
}
