// Restaurando o cabeçalho para o estilo original
"use client"

import { DialogTrigger } from "@/components/ui/dialog"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import {
  CalendarIcon,
  Clock,
  DollarSign,
  Edit,
  LayoutDashboard,
  Menu,
  Plus,
  Scissors,
  Search,
  Trash2,
  TrendingUp,
  Users,
  Bell,
  ChevronDown,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { addDays, subDays } from "date-fns"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { RevenueChart } from "@/components/revenue-chart"
import { TimeSlotsManager } from "@/components/time-slots-manager"
import { BarbersManager } from "@/components/barbers-manager"

// Define the Service type
interface Service {
  id: string
  name: string
  description: string
  price: number
  duration: number
}

// Define the Appointment type
interface Appointment {
  id: string
  clientName: string
  clientPhone: string
  clientEmail: string
  serviceId: string
  date: Date
  time: string
  status: string
}

export default function AdminPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [date, setDate] = useState<Date>(new Date())
  const [addServiceOpen, setAddServiceOpen] = useState(false)
  const [addAppointmentOpen, setAddAppointmentOpen] = useState(false)
  const [editServiceOpen, setEditServiceOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Use localStorage hooks
  const [services, setServices] = useLocalStorage<Service[]>("barberServices", [
    {
      id: "1",
      name: "Corte de Cabelo",
      description: "Cortes modernos e clássicos para todos os estilos.",
      price: 45.0,
      duration: 30,
    },
    {
      id: "2",
      name: "Barba",
      description: "Modelagem e aparagem de barba com toalha quente.",
      price: 35.0,
      duration: 20,
    },
    {
      id: "3",
      name: "Combo (Cabelo + Barba)",
      description: "Corte de cabelo e barba com desconto especial.",
      price: 70.0,
      duration: 50,
    },
  ])

  // Converter as datas vindas do localStorage para objetos Date
  const parseAppointmentDates = (appts: any[]) => {
    return appts.map(appointment => ({
      ...appointment,
      date: new Date(appointment.date)
    }))
  }

  const [appointments, setAppointments] = useLocalStorage<Appointment[]>("barberAppointments", [])

  // Set sidebar open by default on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(true)
      } else {
        setSidebarOpen(false)
      }
    }

    // Set initial state
    handleResize()

    // Add event listener
    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Verificar autenticação
  useEffect(() => {
    const checkAuth = () => {
      const auth = localStorage.getItem("barberAdmin") === "true"
      setIsAuthenticated(auth)
      setIsLoading(false)

      if (!auth) {
        router.push("/login")
      }
    }

    checkAuth()
  }, [router])

  // Dados financeiros para o dashboard
  const dadosFinanceiros = {
    faturamentoHoje: 450,
    faturamentoSemana: 2850,
    faturamentoMes: 12500,
    servicosMaisVendidos: [
      { nome: "Combo (Cabelo + Barba)", quantidade: 42, valor: 2940, porcentagem: 42 },
      { nome: "Corte de Cabelo", quantidade: 38, valor: 1710, porcentagem: 28 },
      { nome: "Barba", quantidade: 25, valor: 875, porcentagem: 16 },
      { nome: "Coloração", quantidade: 12, valor: 960, porcentagem: 9 },
      { nome: "Hidratação", quantidade: 8, valor: 400, porcentagem: 5 },
    ],
    transacoesRecentes: [
      { id: "1", cliente: "João Silva", servico: "Corte de Cabelo", valor: 45, data: new Date() },
      { id: "2", cliente: "Carlos Oliveira", servico: "Combo (Cabelo + Barba)", valor: 70, data: new Date() },
      { id: "3", cliente: "Pedro Santos", servico: "Barba", valor: 35, data: subDays(new Date(), 1) },
      { id: "4", cliente: "Marcos Pereira", servico: "Corte de Cabelo", valor: 45, data: subDays(new Date(), 1) },
      {
        id: "5",
        cliente: "Lucas Ferreira",
        servico: "Combo (Cabelo + Barba)",
        valor: 70,
        data: subDays(new Date(), 2),
      },
    ],
    dadosGrafico: [
      { name: "Seg", valor: 350 },
      { name: "Ter", valor: 420 },
      { name: "Qua", valor: 380 },
      { name: "Qui", valor: 450 },
      { name: "Sex", valor: 520 },
      { name: "Sáb", valor: 730 },
      { name: "Dom", valor: 0 },
    ],
  }

  const handleAddService = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newService: Service = {
      id: crypto.randomUUID(),
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: parseFloat(formData.get("price") as string),
      duration: parseInt(formData.get("duration") as string),
    }
    
    // Usando o setter do useLocalStorage
    setServices([...services, newService])
    setAddServiceOpen(false)
  }

  const handleEditService = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingService) return

    const formData = new FormData(e.currentTarget)
    const updatedService: Service = {
      id: editingService.id,
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: parseFloat(formData.get("price") as string),
      duration: parseInt(formData.get("duration") as string),
    }

    // Usando o setter do useLocalStorage
    setServices(services.map((s: Service) => (s.id === editingService.id ? updatedService : s)))
    setEditServiceOpen(false)
    setEditingService(null)
  }

  const handleDeleteService = (index: number) => {
    // Usando o setter do useLocalStorage
    setServices(services.filter((s: Service) => s.id !== services[index].id))
  }

  const handleAddAppointment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newAppointment: Appointment = {
      id: (appointments.length + 1).toString(),
      clientName: formData.get("clientName") as string,
      clientPhone: formData.get("clientPhone") as string,
      clientEmail: formData.get("clientEmail") as string,
      serviceId: formData.get("serviceId") as string,
      date: new Date(formData.get("date") as string),
      time: formData.get("time") as string,
      status: "confirmed",
    }

    // Usando o setter do useLocalStorage
    setAppointments([...appointments, newAppointment])
    setAddAppointmentOpen(false)
  }

  const handleLogout = () => {
    localStorage.setItem("barberAdmin", "false")
    setIsAuthenticated(false)
    router.push("/login")
  }

  const filteredAppointments = appointments.filter(
    (appointment: Appointment) =>
      appointment.date.getDate() === date.getDate() &&
      appointment.date.getMonth() === date.getMonth() &&
      appointment.date.getFullYear() === date.getFullYear(),
  )

  // Função para verificar se uma data tem agendamentos
  const hasAppointments = (day: Date) => {
    return appointments.some(
      (appointment: Appointment) =>
        appointment.date.getDate() === day.getDate() &&
        appointment.date.getMonth() === day.getMonth() &&
        appointment.date.getFullYear() === day.getFullYear()
    );
  }

  // Função para obter o número de agendamentos para uma data específica
  const getAppointmentCount = (day: Date) => {
    return appointments.filter(
      (appointment: Appointment) =>
        appointment.date.getDate() === day.getDate() &&
        appointment.date.getMonth() === day.getMonth() &&
        appointment.date.getFullYear() === day.getFullYear()
    ).length;
  }

  const timeSlots = [
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

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-900/30 text-green-400"
      case "pending":
        return "bg-yellow-900/30 text-yellow-400"
      case "in_progress":
        return "bg-purple-900/30 text-purple-400"
      case "completed":
        return "bg-blue-900/30 text-blue-400"
      case "cancelled":
        return "bg-red-900/30 text-red-400"
      default:
        return "bg-gray-900/30 text-gray-400"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmado"
      case "pending":
        return "Pendente"
      case "in_progress":
        return "Em Andamento"
      case "completed":
        return "Concluído"
      case "cancelled":
        return "Cancelado"
      default:
        return "Agendado"
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const getRandomColor = (name: string) => {
    const colors = ["bg-blue-500", "bg-green-500", "bg-red-500", "bg-orange-500", "bg-purple-500", "bg-pink-500"]
    const index = name.charCodeAt(0) % colors.length
    return colors[index]
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    if (window.innerWidth < 768) {
      setSidebarOpen(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Será redirecionado pelo useEffect
  }

  return (
    <div className="w-full bg-gradient-to-br from-black to-purple-950 min-h-screen font-sans">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex h-full relative">
        {/* Sidebar */}
        <aside
          className={`fixed md:relative z-30 h-full bg-black border-r border-purple-700 transition-all duration-300 ease-in-out ${
            sidebarOpen ? "w-64 left-0" : "w-0 -left-64 md:left-0 md:w-16"
          } overflow-hidden`}
        >
          <div className="p-4 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-xl font-bold text-white flex items-center">
                <Scissors className="w-6 h-6 mr-3 text-purple-400" />
                {sidebarOpen && <span>BarberStyle</span>}
              </h1>
              <button className="text-gray-400 hover:text-purple-400 md:hidden" onClick={toggleSidebar}>
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1">
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => handleTabChange("dashboard")}
                    className={`flex items-center w-full ${activeTab === "dashboard" ? "text-purple-400 bg-purple-900/30" : "text-gray-400 hover:bg-purple-900/20 hover:text-purple-300"} px-4 py-3 rounded-lg transition-colors duration-200`}
                  >
                    <LayoutDashboard className="h-5 w-5 min-w-5" />
                    {sidebarOpen && <span className="ml-3">Dashboard</span>}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleTabChange("appointments")}
                    className={`flex items-center w-full ${activeTab === "appointments" ? "text-purple-500 bg-purple-900/30" : "text-gray-400 hover:bg-purple-900/20 hover:text-purple-300"} px-4 py-3 rounded-lg transition-colors duration-200`}
                  >
                    <CalendarIcon className="h-5 w-5 min-w-5" />
                    {sidebarOpen && <span className="ml-3">Agendamentos</span>}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleTabChange("services")}
                    className={`flex items-center w-full ${activeTab === "services" ? "text-purple-500 bg-purple-900/30" : "text-gray-400 hover:bg-purple-900/20 hover:text-purple-300"} px-4 py-3 rounded-lg transition-colors duration-200`}
                  >
                    <Scissors className="h-5 w-5 min-w-5" />
                    {sidebarOpen && <span className="ml-3">Serviços</span>}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleTabChange("barbers")}
                    className={`flex items-center w-full ${activeTab === "barbers" ? "text-purple-500 bg-purple-900/30" : "text-gray-400 hover:bg-purple-900/20 hover:text-purple-300"} px-4 py-3 rounded-lg transition-colors duration-200`}
                  >
                    <Users className="h-5 w-5 min-w-5" />
                    {sidebarOpen && <span className="ml-3">Funcionários</span>}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleTabChange("financial")}
                    className={`flex items-center w-full ${activeTab === "financial" ? "text-purple-500 bg-purple-900/30" : "text-gray-400 hover:bg-purple-900/20 hover:text-purple-300"} px-4 py-3 rounded-lg transition-colors duration-200`}
                  >
                    <DollarSign className="h-5 w-5 min-w-5" />
                    {sidebarOpen && <span className="ml-3">Financeiro</span>}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleTabChange("timeslots")}
                    className={`flex items-center w-full ${activeTab === "timeslots" ? "text-purple-500 bg-purple-900/30" : "text-gray-400 hover:bg-purple-900/20 hover:text-purple-300"} px-4 py-3 rounded-lg transition-colors duration-200`}
                  >
                    <Clock className="h-5 w-5 min-w-5" />
                    {sidebarOpen && <span className="ml-3">Horários</span>}
                  </button>
                </li>
              </ul>
            </nav>

            {sidebarOpen && (
              <div className="mt-auto pt-4 border-t border-gray-800">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full text-red-400 hover:bg-red-900/20 px-4 py-3 rounded-lg transition-colors duration-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  <span className="ml-3">Sair</span>
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Header */}
          <header className="bg-black border-b border-purple-700 p-2 md:p-4 flex justify-between items-center sticky top-0 z-10">
            <div className="flex items-center">
              <button className="p-2 text-gray-400 hover:text-purple-400 mr-2" onClick={toggleSidebar}>
                <Menu size={20} />
              </button>
              <div className="relative hidden sm:block">
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="bg-gray-900 text-gray-200 pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all w-40 md:w-64"
                />
                <Search className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" />
              </div>
            </div>

            <div className="flex items-center space-x-2 md:space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-purple-400 transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 bg-purple-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  3
                </span>
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center space-x-2 md:space-x-3 cursor-pointer focus:outline-none">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-purple-700 flex items-center justify-center text-white font-semibold border-2 border-purple-500">
                    AD
                  </div>
                  <div className="text-left hidden md:block">
                    <p className="text-sm font-medium text-white">Admin</p>
                    <p className="text-xs text-gray-400">Administrador</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-gray-800 border border-purple-900 rounded-lg shadow-lg py-2 w-48">
                  <DropdownMenuItem className="px-4 py-2 text-sm text-gray-300 hover:bg-purple-900/30 hover:text-purple-300 cursor-pointer">
                    Meu Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem className="px-4 py-2 text-sm text-gray-300 hover:bg-purple-900/30 hover:text-purple-300 cursor-pointer">
                    Configurações
                  </DropdownMenuItem>
                  <div className="border-t border-gray-700 my-1"></div>
                  <DropdownMenuItem
                    className="px-4 py-2 text-sm text-red-400 hover:bg-red-900/30 cursor-pointer"
                    onClick={handleLogout}
                  >
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Dashboard Content */}
          <div className="p-3 md:p-6 overflow-auto flex-1">
            {/* Dashboard Tab */}
            {activeTab === "dashboard" && (
              <>
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-0 mb-6">
                  <h2 className="text-xl md:text-2xl font-bold text-white">Dashboard</h2>
                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 space-x-0 sm:space-x-3">
                    <Button
                      className="bg-purple-600 hover:bg-purple-500 text-white flex items-center shadow-lg hover:shadow-purple-600/40 transform hover:scale-105 transition-all duration-300"
                      onClick={() => setAddAppointmentOpen(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Novo Agendamento
                    </Button>
                    <Button
                      variant="outline"
                      className="border-2 border-purple-500 text-purple-400 hover:bg-purple-900/40 flex items-center transition-all duration-300"
                    >
                      <span className="mr-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="6 9 6 2 18 2 18 9"></polyline>
                          <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                          <rect x="6" y="14" width="12" height="8"></rect>
                        </svg>
                      </span>
                      Relatório
                    </Button>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
                  <div className="bg-gradient-to-br from-gray-900 to-purple-950 border border-purple-800/30 rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 hover:border-purple-500/50 group">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-gray-400 text-xs sm:text-sm">Agendamentos hoje</p>
                        <h3 className="text-2xl md:text-3xl font-bold text-white mt-2">
                          {filteredAppointments.length}
                        </h3>
                        <p className="text-green-500 text-xs sm:text-sm mt-2 flex items-center">
                          <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          +12% de ontem
                        </p>
                      </div>
                      <div className="bg-purple-700/20 p-2 sm:p-3 rounded-lg text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                        <CalendarIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-gray-900 to-purple-950 border border-purple-800/30 rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 hover:border-purple-500/50 group">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-gray-400 text-xs sm:text-sm">Clientes atendidos</p>
                        <h3 className="text-2xl md:text-3xl font-bold text-white mt-2">18</h3>
                        <p className="text-green-500 text-xs sm:text-sm mt-2 flex items-center">
                          <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          +5% nesta semana
                        </p>
                      </div>
                      <div className="bg-purple-700/20 p-2 sm:p-3 rounded-lg text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                        <Users className="h-5 w-5 sm:h-6 sm:w-6" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-gray-900 to-purple-950 border border-purple-800/30 rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 hover:border-purple-500/50 group">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-gray-400 text-xs sm:text-sm">Receita diária</p>
                        <h3 className="text-2xl md:text-3xl font-bold text-white mt-2">
                          R$ {dadosFinanceiros.faturamentoHoje}
                        </h3>
                        <p className="text-green-500 text-xs sm:text-sm mt-2 flex items-center">
                          <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          +18% desta semana
                        </p>
                      </div>
                      <div className="bg-purple-700/20 p-2 sm:p-3 rounded-lg text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                        <DollarSign className="h-5 w-5 sm:h-6 sm:w-6" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-gray-900 to-purple-950 border border-purple-800/30 rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 hover:border-purple-500/50 group">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-gray-400 text-xs sm:text-sm">Avaliação média</p>
                        <h3 className="text-2xl md:text-3xl font-bold text-white mt-2">4.8</h3>
                        <div className="text-yellow-500 text-xs sm:text-sm mt-2 flex items-center">
                          {[1, 2, 3, 4].map((star) => (
                            <svg
                              key={star}
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="mr-1 h-3 w-3 sm:h-4 sm:w-4"
                            >
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                            </svg>
                          ))}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-3 w-3 sm:h-4 sm:w-4"
                          >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                          </svg>
                        </div>
                      </div>
                      <div className="bg-purple-700/20 p-2 sm:p-3 rounded-lg text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
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
                          className="h-5 w-5 sm:h-6 sm:w-6"
                        >
                          <path d="M7 10v12" />
                          <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Charts and Tables Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4">
                  {/* Agendamentos de Hoje */}
                  <div className="lg:col-span-2 bg-gradient-to-br from-gray-900 to-purple-950 border border-purple-800/30 rounded-xl overflow-hidden">
                    <div className="p-3 md:p-4 border-b border-purple-700 flex justify-between items-center">
                      <h3 className="text-base md:text-lg font-semibold text-white">Agendamentos de Hoje</h3>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="flex items-center text-purple-400 hover:text-purple-300 cursor-pointer">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="12" cy="12" r="1"></circle>
                            <circle cx="12" cy="5" r="1"></circle>
                            <circle cx="12" cy="19" r="1"></circle>
                          </svg>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-gray-800 border border-purple-900 rounded-lg shadow-lg py-2 w-40">
                          <DropdownMenuItem className="px-4 py-2 text-sm text-gray-300 hover:bg-purple-900/30 hover:text-purple-300 cursor-pointer">
                            Ver todos
                          </DropdownMenuItem>
                          <DropdownMenuItem className="px-4 py-2 text-sm text-gray-300 hover:bg-purple-900/30 hover:text-purple-300 cursor-pointer">
                            Exportar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="p-3 md:p-4">
                      <div className="overflow-x-auto -mx-3 md:mx-0">
                        <div className="inline-block min-w-full align-middle">
                          <div className="overflow-hidden">
                            <table className="min-w-full">
                              <thead>
                                <tr className="border-b border-gray-700">
                                  <th className="px-3 py-2 md:px-4 md:py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Cliente
                                  </th>
                                  <th className="px-3 py-2 md:px-4 md:py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Serviço
                                  </th>
                                  <th className="px-3 py-2 md:px-4 md:py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Horário
                                  </th>
                                  <th className="px-3 py-2 md:px-4 md:py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Status
                                  </th>
                                  <th className="px-3 py-2 md:px-4 md:py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Ações
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-700">
                                {filteredAppointments.length > 0 ? (
                                  filteredAppointments.map((appointment) => {
                                    const service = services.find((s) => s.id === appointment.serviceId)
                                    return (
                                      <tr key={appointment.id} className="hover:bg-gray-700/30 transition-colors">
                                        <td className="px-3 py-2 md:px-4 md:py-3 whitespace-nowrap">
                                          <div className="flex items-center">
                                            <div
                                              className={`h-7 w-7 md:h-8 md:w-8 rounded-full ${getRandomColor(appointment.clientName)} flex items-center justify-center text-white text-xs md:text-sm font-medium`}
                                            >
                                              {getInitials(appointment.clientName)}
                                            </div>
                                            <div className="ml-2 md:ml-3">
                                              <p className="text-xs md:text-sm font-medium text-white">
                                                {appointment.clientName}
                                              </p>
                                              <p className="text-xs text-gray-400 hidden sm:block">
                                                {appointment.clientPhone}
                                              </p>
                                            </div>
                                          </div>
                                        </td>
                                        <td className="px-3 py-2 md:px-4 md:py-3 whitespace-nowrap text-xs md:text-sm text-gray-300">
                                          {service?.name}
                                        </td>
                                        <td className="px-3 py-2 md:px-4 md:py-3 whitespace-nowrap text-xs md:text-sm text-gray-300">
                                          {appointment.time}
                                        </td>
                                        <td className="px-3 py-2 md:px-4 md:py-3 whitespace-nowrap">
                                          <span
                                            className={`px-1.5 py-0.5 md:px-2 md:py-1 text-xs rounded-full ${getStatusBadgeClass(appointment.status)}`}
                                          >
                                            {getStatusText(appointment.status)}
                                          </span>
                                        </td>
                                        <td className="px-3 py-2 md:px-4 md:py-3 whitespace-nowrap text-xs md:text-sm text-gray-300">
                                          <div className="flex space-x-2">
                                            <button className="text-gray-400 hover:text-purple-400 transition-colors">
                                              <Edit className="h-3.5 w-3.5 md:h-4 md:w-4" />
                                            </button>
                                            <button className="text-gray-400 hover:text-red-400 transition-colors">
                                              <Trash2 className="h-3.5 w-3.5 md:h-4 md:w-4" />
                                            </button>
                                          </div>
                                        </td>
                                      </tr>
                                    )
                                  })
                                ) : (
                                  <tr>
                                    <td colSpan={5} className="px-3 py-6 md:px-4 md:py-8 text-center text-gray-400">
                                      Nenhum agendamento para hoje.
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Revenue Chart */}
                  <div className="bg-gradient-to-br from-gray-900 to-purple-950 border border-purple-800/30 rounded-xl overflow-hidden">
                    <div className="p-3 md:p-4 border-b border-purple-700">
                      <h3 className="text-base md:text-lg font-semibold text-white">Receita Semanal</h3>
                    </div>
                    <div className="p-3 md:p-4">
                      <RevenueChart data={dadosFinanceiros.dadosGrafico} />
                    </div>
                  </div>

                  {/* Top Services */}
                  <div className="bg-gradient-to-br from-gray-900 to-purple-950 border border-purple-800/30 rounded-xl overflow-hidden">
                    <div className="p-3 md:p-4 border-b border-purple-700">
                      <h3 className="text-base md:text-lg font-semibold text-white">Serviços Mais Vendidos</h3>
                    </div>
                    <div className="p-3 md:p-4">
                      <ul>
                        {dadosFinanceiros.servicosMaisVendidos.map((servico) => (
                          <li key={servico.nome} className="py-2 border-b border-gray-700 last:border-none">
                            <div className="flex justify-between items-center">
                              <div className="flex flex-col">
                                <span className="text-sm font-medium text-white">{servico.nome}</span>
                                <span className="text-xs text-gray-400">
                                  {servico.quantidade} vendas - R$ {servico.valor}
                                </span>
                              </div>
                              <span className="text-sm text-purple-400">{servico.porcentagem}%</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Appointments Tab */}
            {activeTab === "appointments" && (
              <>
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-0 mb-6">
                  <h2 className="text-xl md:text-2xl font-bold text-white">Agendamentos</h2>
                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 space-x-0 sm:space-x-3">
                    <Button
                      className="bg-purple-600 hover:bg-purple-500 text-white flex items-center shadow-lg hover:shadow-purple-600/40 transform hover:scale-105 transition-all duration-300"
                      onClick={() => setAddAppointmentOpen(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Novo Agendamento
                    </Button>
                    <Button
                      variant="outline"
                      className="border-2 border-purple-500 text-purple-400 hover:bg-purple-900/40 flex items-center transition-all duration-300"
                    >
                      <span className="mr-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="6 9 6 2 18 2 18 9"></polyline>
                          <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                          <rect x="6" y="14" width="12" height="8"></rect>
                        </svg>
                      </span>
                      Relatório
                    </Button>
                  </div>
                </div>

                {/* Calendar and Appointments List */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 md:gap-4">
                  {/* Calendar */}
                  <div className="lg:col-span-1 bg-gradient-to-br from-gray-900 to-purple-950 border border-purple-800/30 rounded-xl overflow-hidden">
                    <div className="p-3 md:p-4 border-b border-purple-700">
                      <h3 className="text-base md:text-lg font-semibold text-white flex items-center justify-between">
                        <span className="flex items-center">
                          <CalendarIcon className="mr-2 h-4 w-4 text-purple-400" />
                          Calendário
                        </span>
                        <button 
                          onClick={() => setDate(new Date())} 
                          className="text-xs bg-purple-900/30 hover:bg-purple-900/50 text-purple-300 px-2 py-1 rounded-md transition-colors"
                        >
                          Hoje
                        </button>
                      </h3>
                    </div>
                    <div className="p-3 md:p-5">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(selectedDate) => selectedDate && setDate(selectedDate)}
                        locale={ptBR}
                        className="border-none shadow-none focus:outline-none imperial-calendar max-w-full"
                        classNames={{
                          months: "w-full flex flex-col",
                          month: "w-full space-y-4",
                          caption: "text-white font-medium py-1 flex items-center justify-center relative",
                          caption_label: "text-sm font-medium text-center flex-grow text-purple-200",
                          nav: "space-x-1 flex items-center absolute right-1",
                          nav_button: cn(
                            "h-7 w-7 bg-transparent p-0 opacity-80 hover:opacity-100 text-purple-300 hover:text-purple-200"
                          ),
                          nav_button_previous: "absolute left-1",
                          nav_button_next: "absolute right-1",
                          table: "w-full border-collapse",
                          head_row: "flex w-full",
                          head_cell: "text-purple-300 rounded-md w-9 font-medium text-[0.8rem] w-full",
                          row: "flex w-full mt-2",
                          cell: "text-center text-sm p-0 relative rounded-md w-full h-9 flex items-center justify-center",
                          day: "h-9 w-9 p-0 font-normal text-gray-200 hover:bg-purple-900/30 focus:bg-purple-900/30 rounded-md",
                          day_selected: "bg-purple-600 text-white hover:bg-purple-700 hover:text-white focus:bg-purple-600",
                          day_today: "bg-purple-900/20 text-white",
                          day_outside: "day-outside text-gray-500/50 opacity-50",
                          day_disabled: "text-gray-500/50 opacity-50",
                          day_hidden: "invisible",
                          root: "bg-gray-900 text-white rounded-md shadow-md",
                        }}
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        modifiers={{
                          hasAppointment: (date) => hasAppointments(date),
                          manyAppointments: (date) => getAppointmentCount(date) > 2
                        }}
                        modifiersClassNames={{
                          hasAppointment: "rdp-day_with_appointment",
                          manyAppointments: "rdp-day_with_many_appointments"
                        }}
                        footer={
                          <div className="pt-3 text-center border-t border-gray-700 mt-2">
                            <div className="flex items-center justify-center gap-3 text-xs text-gray-400">
                              <div className="flex items-center">
                                <div className="w-2 h-2 rounded-full bg-purple-400 mr-1"></div>
                                <span>Com agendamentos</span>
                              </div>
                              <div className="flex items-center">
                                <div className="w-3 h-3 rounded-full bg-purple-400 mr-1"></div>
                                <span>Vários agendamentos</span>
                              </div>
                            </div>
                            <div className="mt-2 text-xs text-purple-300">
                              Total: {appointments.length} agendamentos
                            </div>
                          </div>
                        }
                      />
                    </div>
                  </div>

                  {/* Appointments List */}
                  <div className="lg:col-span-3 bg-gradient-to-br from-gray-900 to-purple-950 border border-purple-800/30 rounded-xl overflow-hidden">
                    <div className="p-3 md:p-4 border-b border-purple-700 flex justify-between items-center">
                      <div className="flex items-center">
                        <button 
                          onClick={() => setDate(new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1))}
                          className="mr-2 p-1 rounded-full hover:bg-purple-900/30 text-purple-400"
                          disabled={new Date().getTime() > date.getTime()}
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        
                        <h3 className="text-base md:text-lg font-semibold text-white flex items-center">
                          Agendamentos - {format(date, "dd 'de' MMMM", { locale: ptBR })}
                          <span className="ml-2 text-xs bg-purple-800/50 text-purple-300 py-0.5 px-2 rounded-full">
                            {filteredAppointments.length} {filteredAppointments.length === 1 ? 'cliente' : 'clientes'}
                          </span>
                        </h3>
                        
                        <button 
                          onClick={() => setDate(new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1))}
                          className="ml-2 p-1 rounded-full hover:bg-purple-900/30 text-purple-400"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="flex items-center text-purple-400 hover:text-purple-300 cursor-pointer">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="12" cy="12" r="1"></circle>
                            <circle cx="12" cy="5" r="1"></circle>
                            <circle cx="12" cy="19" r="1"></circle>
                          </svg>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-gray-800 border border-purple-900 rounded-lg shadow-lg py-2 w-40">
                          <DropdownMenuItem className="px-4 py-2 text-sm text-gray-300 hover:bg-purple-900/30 hover:text-purple-300 cursor-pointer">
                            Ver todos
                          </DropdownMenuItem>
                          <DropdownMenuItem className="px-4 py-2 text-sm text-gray-300 hover:bg-purple-900/30 hover:text-purple-300 cursor-pointer">
                            Exportar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="p-3 md:p-4">
                      <div className="overflow-x-auto -mx-3 md:mx-0">
                        <div className="inline-block min-w-full align-middle">
                          <div className="overflow-hidden">
                            <table className="min-w-full">
                              <thead>
                                <tr className="border-b border-gray-700">
                                  <th className="px-3 py-2 md:px-4 md:py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Cliente
                                  </th>
                                  <th className="px-3 py-2 md:px-4 md:py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Serviço
                                  </th>
                                  <th className="px-3 py-2 md:px-4 md:py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Horário
                                  </th>
                                  <th className="px-3 py-2 md:px-4 md:py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Status
                                  </th>
                                  <th className="px-3 py-2 md:px-4 md:py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Ações
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-700">
                                {filteredAppointments.length > 0 ? (
                                  filteredAppointments.map((appointment) => {
                                    const service = services.find((s) => s.id === appointment.serviceId)
                                    return (
                                      <tr key={appointment.id} className="hover:bg-gray-700/30 transition-colors">
                                        <td className="px-3 py-2 md:px-4 md:py-3 whitespace-nowrap">
                                          <div className="flex items-center">
                                            <div
                                              className={`h-7 w-7 md:h-8 md:w-8 rounded-full ${getRandomColor(appointment.clientName)} flex items-center justify-center text-white text-xs md:text-sm font-medium`}
                                            >
                                              {getInitials(appointment.clientName)}
                                            </div>
                                            <div className="ml-2 md:ml-3">
                                              <p className="text-xs md:text-sm font-medium text-white">
                                                {appointment.clientName}
                                              </p>
                                              <p className="text-xs text-gray-400 hidden sm:block">
                                                {appointment.clientPhone}
                                              </p>
                                            </div>
                                          </div>
                                        </td>
                                        <td className="px-3 py-2 md:px-4 md:py-3 whitespace-nowrap text-xs md:text-sm text-gray-300">
                                          {service?.name}
                                        </td>
                                        <td className="px-3 py-2 md:px-4 md:py-3 whitespace-nowrap text-xs md:text-sm text-gray-300">
                                          {appointment.time}
                                        </td>
                                        <td className="px-3 py-2 md:px-4 md:py-3 whitespace-nowrap">
                                          <span
                                            className={`px-1.5 py-0.5 md:px-2 md:py-1 text-xs rounded-full ${getStatusBadgeClass(appointment.status)}`}
                                          >
                                            {getStatusText(appointment.status)}
                                          </span>
                                        </td>
                                        <td className="px-3 py-2 md:px-4 md:py-3 whitespace-nowrap text-xs md:text-sm text-gray-300">
                                          <div className="flex space-x-2">
                                            <button className="text-gray-400 hover:text-purple-400 transition-colors">
                                              <Edit className="h-3.5 w-3.5 md:h-4 md:w-4" />
                                            </button>
                                            <button className="text-gray-400 hover:text-red-400 transition-colors">
                                              <Trash2 className="h-3.5 w-3.5 md:h-4 md:w-4" />
                                            </button>
                                          </div>
                                        </td>
                                      </tr>
                                    )
                                  })
                                ) : (
                                  <tr>
                                    <td colSpan={5} className="px-3 py-6 md:px-4 md:py-8 text-center text-gray-400">
                                      Nenhum agendamento para este dia.
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Services Tab */}
            {activeTab === "services" && (
              <>
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-0 mb-6">
                  <h2 className="text-xl md:text-2xl font-bold text-white">Serviços</h2>
                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 space-x-0 sm:space-x-3">
                    <Button
                      className="bg-purple-600 hover:bg-purple-500 text-white flex items-center shadow-lg hover:shadow-purple-600/40 transform hover:scale-105 transition-all duration-300"
                      onClick={() => setAddServiceOpen(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Novo Serviço
                    </Button>
                    <Button
                      variant="outline"
                      className="border-2 border-purple-500 text-purple-400 hover:bg-purple-900/40 flex items-center transition-all duration-300"
                    >
                      <span className="mr-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="6 9 6 2 18 2 18 9"></polyline>
                          <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                          <rect x="6" y="14" width="12" height="8"></rect>
                        </svg>
                      </span>
                      Relatório
                    </Button>
                  </div>
                </div>

                {/* Services List */}
                <div className="bg-gradient-to-br from-gray-900 to-purple-950 border border-purple-800/30 rounded-xl overflow-hidden">
                  <div className="p-3 md:p-4 border-b border-purple-700 flex justify-between items-center">
                    <h3 className="text-base md:text-lg font-semibold text-white">Lista de Serviços</h3>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex items-center text-purple-400 hover:text-purple-300 cursor-pointer">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="1"></circle>
                          <circle cx="12" cy="5" r="1"></circle>
                          <circle cx="12" cy="19" r="1"></circle>
                        </svg>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-gray-800 border border-purple-900 rounded-lg shadow-lg py-2 w-40">
                        <DropdownMenuItem className="px-4 py-2 text-sm text-gray-300 hover:bg-purple-900/30 hover:text-purple-300 cursor-pointer">
                          Ver todos
                        </DropdownMenuItem>
                        <DropdownMenuItem className="px-4 py-2 text-sm text-gray-300 hover:bg-purple-900/30 hover:text-purple-300 cursor-pointer">
                          Exportar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="p-3 md:p-4">
                    <div className="overflow-x-auto -mx-3 md:mx-0">
                      <div className="inline-block min-w-full align-middle">
                        <div className="overflow-hidden">
                          <table className="min-w-full divide-y divide-gray-700">
                            <thead>
                              <tr className="border-b border-gray-700">
                                <th className="px-3 py-2 md:px-4 md:py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-auto md:w-1/2">
                                  Nome
                                </th>
                                <th className="px-3 py-2 md:px-4 md:py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-auto md:w-1/6 hidden sm:table-cell">
                                  Preço
                                </th>
                                <th className="px-3 py-2 md:px-4 md:py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-auto md:w-1/6 hidden sm:table-cell">
                                  Duração
                                </th>
                                <th className="px-3 py-2 md:px-4 md:py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider w-auto md:w-1/6">
                                  Ações
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                              {services.map((service) => (
                                <tr key={service.id} className="hover:bg-gray-700/30 transition-colors">
                                  <td className="px-3 py-2 md:px-4 md:py-3">
                                    <div className="text-sm font-medium text-white">{service.name}</div>
                                    <div className="text-xs text-gray-400 max-w-xs truncate">{service.description}</div>
                                    <div className="flex items-center mt-1 space-x-2 sm:hidden">
                                      <div className="text-xs text-purple-400">R$ {service.price}</div>
                                      <div className="text-xs text-gray-400">| {service.duration} min</div>
                                    </div>
                                  </td>
                                  <td className="px-3 py-2 md:px-4 md:py-3 whitespace-nowrap hidden sm:table-cell">
                                    <div className="text-sm text-gray-300">R$ {service.price}</div>
                                  </td>
                                  <td className="px-3 py-2 md:px-4 md:py-3 whitespace-nowrap hidden sm:table-cell">
                                    <div className="text-sm text-gray-300">{service.duration} minutos</div>
                                  </td>
                                  <td className="px-3 py-2 md:px-4 md:py-3 whitespace-nowrap text-right">
                                    <div className="flex space-x-2 justify-end">
                                      <button
                                        className="text-gray-400 hover:text-purple-400 transition-colors"
                                        onClick={() => {
                                          setEditingService(service)
                                          setEditServiceOpen(true)
                                        }}
                                        aria-label="Editar serviço"
                                      >
                                        <Edit className="h-3.5 w-3.5 md:h-4 md:w-4" />
                                      </button>
                                      <button
                                        className="text-gray-400 hover:text-red-400 transition-colors"
                                        onClick={() => handleDeleteService(services.indexOf(service))}
                                        aria-label="Remover serviço"
                                      >
                                        <Trash2 className="h-3.5 w-3.5 md:h-4 md:w-4" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Barbers Tab */}
            {activeTab === "barbers" && (
              <>
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-0 mb-6">
                  <h2 className="text-xl md:text-2xl font-bold text-white">Funcionários</h2>
                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 space-x-0 sm:space-x-3">
                    <Button
                      className="bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shadow-lg hover:shadow-purple-600/40 transform hover:scale-105 transition-all duration-300"
                      onClick={() => alert("Funcionalidade em desenvolvimento")}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      <span className="whitespace-nowrap">Novo Funcionário</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="border-2 border-purple-500 text-purple-400 hover:bg-purple-900/40 flex items-center justify-center transition-all duration-300"
                    >
                      <span className="mr-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="6 9 6 2 18 2 18 9"></polyline>
                          <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                          <rect x="6" y="14" width="12" height="8"></rect>
                        </svg>
                      </span>
                      <span className="whitespace-nowrap">Relatório</span>
                    </Button>
                  </div>
                </div>

                {/* Barbers Manager Component */}
                <div className="bg-gradient-to-br from-gray-900 to-purple-950 border border-purple-800/30 rounded-xl overflow-hidden">
                  <div className="p-3 md:p-4 border-b border-purple-700">
                    <h3 className="text-base md:text-lg font-semibold text-white">Lista de Funcionários</h3>
                  </div>
                  <div className="p-3 md:p-4">
                    <BarbersManager />
                  </div>
                </div>
              </>
            )}

            {/* Financial Tab */}
            {activeTab === "financial" && (
              <>
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-0 mb-6">
                  <h2 className="text-xl md:text-2xl font-bold text-white">Financeiro</h2>
                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 space-x-0 sm:space-x-3">
                    <Button
                      variant="outline"
                      className="border-2 border-purple-500 text-purple-400 hover:bg-purple-900/40 flex items-center transition-all duration-300"
                    >
                      <span className="mr-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="6 9 6 2 18 2 18 9"></polyline>
                          <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                          <rect x="6" y="14" width="12" height="8"></rect>
                        </svg>
                      </span>
                      Relatório
                    </Button>
                  </div>
                </div>

                {/* Financial Overview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-6">
                  <div className="bg-gradient-to-br from-gray-900 to-purple-950 border border-purple-800/30 rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 hover:border-purple-500/50 group">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-gray-400 text-xs sm:text-sm">Faturamento Hoje</p>
                        <h3 className="text-2xl md:text-3xl font-bold text-white mt-2">
                          R$ {dadosFinanceiros.faturamentoHoje}
                        </h3>
                        <p className="text-green-500 text-xs sm:text-sm mt-2 flex items-center">
                          <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          +12% de ontem
                        </p>
                      </div>
                      <div className="bg-purple-700/20 p-2 sm:p-3 rounded-lg text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                        <DollarSign className="h-5 w-5 sm:h-6 sm:w-6" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-gray-900 to-purple-950 border border-purple-800/30 rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 hover:border-purple-500/50 group">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-gray-400 text-xs sm:text-sm">Faturamento Semana</p>
                        <h3 className="text-2xl md:text-3xl font-bold text-white mt-2">
                          R$ {dadosFinanceiros.faturamentoSemana}
                        </h3>
                        <p className="text-green-500 text-xs sm:text-sm mt-2 flex items-center">
                          <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          +8% da semana passada
                        </p>
                      </div>
                      <div className="bg-purple-700/20 p-2 sm:p-3 rounded-lg text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                        <DollarSign className="h-5 w-5 sm:h-6 sm:w-6" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-gray-900 to-purple-950 border border-purple-800/30 rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 hover:border-purple-500/50 group">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-gray-400 text-xs sm:text-sm">Faturamento Mês</p>
                        <h3 className="text-2xl md:text-3xl font-bold text-white mt-2">
                          R$ {dadosFinanceiros.faturamentoMes}
                        </h3>
                        <p className="text-red-500 text-xs sm:text-sm mt-2 flex items-center">
                          <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1 transform rotate-180" />
                          -3% do mês passado
                        </p>
                      </div>
                      <div className="bg-purple-700/20 p-2 sm:p-3 rounded-lg text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                        <DollarSign className="h-5 w-5 sm:h-6 sm:w-6" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Revenue Chart */}
                <div className="bg-gradient-to-br from-gray-900 to-purple-950 border border-purple-800/30 rounded-xl overflow-hidden mb-4">
                  <div className="p-3 md:p-4 border-b border-purple-700">
                    <h3 className="text-base md:text-lg font-semibold text-white">Receita Semanal</h3>
                  </div>
                  <div className="p-3 md:p-4">
                    <div className="h-60 sm:h-80">
                      <RevenueChart data={dadosFinanceiros.dadosGrafico} />
                    </div>
                  </div>
                </div>

                {/* Recent Transactions */}
                <div className="bg-gradient-to-br from-gray-900 to-purple-950 border border-purple-800/30 rounded-xl overflow-hidden mt-4">
                  <div className="p-3 md:p-4 border-b border-purple-700 flex justify-between items-center">
                    <h3 className="text-base md:text-lg font-semibold text-white">Transações Recentes</h3>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex items-center text-purple-400 hover:text-purple-300 cursor-pointer">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="1"></circle>
                          <circle cx="12" cy="5" r="1"></circle>
                          <circle cx="12" cy="19" r="1"></circle>
                        </svg>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-gray-800 border border-purple-900 rounded-lg shadow-lg py-2 w-40">
                        <DropdownMenuItem className="px-4 py-2 text-sm text-gray-300 hover:bg-purple-900/30 hover:text-purple-300 cursor-pointer">
                          Ver todas
                        </DropdownMenuItem>
                        <DropdownMenuItem className="px-4 py-2 text-sm text-gray-300 hover:bg-purple-900/30 hover:text-purple-300 cursor-pointer">
                          Exportar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="p-3 md:p-4">
                    <div className="overflow-x-auto -mx-3 md:mx-0">
                      <div className="inline-block min-w-full align-middle">
                        <div className="overflow-hidden">
                          <table className="min-w-full divide-y divide-gray-700">
                            <thead>
                              <tr className="border-b border-gray-700">
                                <th className="px-3 py-2 md:px-4 md:py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                  Cliente
                                </th>
                                <th className="px-3 py-2 md:px-4 md:py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                                  Serviço
                                </th>
                                <th className="px-3 py-2 md:px-4 md:py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                  Valor
                                </th>
                                <th className="px-3 py-2 md:px-4 md:py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                                  Data
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                              {dadosFinanceiros.transacoesRecentes.map((transacao) => (
                                <tr key={transacao.id} className="hover:bg-gray-700/30 transition-colors">
                                  <td className="px-3 py-2 md:px-4 md:py-3 whitespace-nowrap">
                                    <div className="text-sm font-medium text-white">{transacao.cliente}</div>
                                    <div className="text-xs text-gray-400 sm:hidden">{transacao.servico}</div>
                                    <div className="text-xs text-gray-400 sm:hidden">
                                      {format(transacao.data, "dd/MM/yy", { locale: ptBR })}
                                    </div>
                                  </td>
                                  <td className="px-3 py-2 md:px-4 md:py-3 whitespace-nowrap hidden sm:table-cell">
                                    <div className="text-sm text-gray-300">{transacao.servico}</div>
                                  </td>
                                  <td className="px-3 py-2 md:px-4 md:py-3 whitespace-nowrap">
                                    <div className="text-sm text-gray-300">R$ {transacao.valor}</div>
                                  </td>
                                  <td className="px-3 py-2 md:px-4 md:py-3 whitespace-nowrap text-right hidden sm:table-cell">
                                    <div className="text-sm text-gray-300">
                                      {format(transacao.data, "dd/MM/yyyy", { locale: ptBR })}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Time Slots Tab */}
            {activeTab === "timeslots" && (
              <>
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-0 mb-6">
                  <h2 className="text-xl md:text-2xl font-bold text-white">Horários</h2>
                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 space-x-0 sm:space-x-3">
                    <Button
                      className="bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shadow-lg hover:shadow-purple-600/40 transform hover:scale-105 transition-all duration-300"
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      <span className="whitespace-nowrap">Salvar Horários</span>
                    </Button>
                  </div>
                </div>

                {/* Time Slots Manager Component */}
                <div className="bg-gradient-to-br from-gray-900 to-purple-950 border border-purple-800/30 rounded-xl overflow-hidden">
                  <div className="p-3 md:p-4 border-b border-purple-700">
                    <h3 className="text-base md:text-lg font-semibold text-white">Configurar Horários de Atendimento</h3>
                  </div>
                  <div className="p-3 md:p-4 overflow-auto">
                    <TimeSlotsManager />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Add Service Dialog */}
      <Dialog open={addServiceOpen} onOpenChange={setAddServiceOpen}>
        <DialogTrigger asChild>
          <Button>Abrir Dialog</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-gray-900 to-purple-950 border border-purple-700 rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-white">Adicionar Serviço</DialogTitle>
            <DialogDescription className="text-gray-400">
              Adicione um novo serviço para ser oferecido aos clientes.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddService}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right text-gray-400">
                  Nome
                </Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  defaultValue=""
                  className="col-span-3 imperial-form-input"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right text-gray-400">
                  Descrição
                </Label>
                <Input
                  type="text"
                  id="description"
                  name="description"
                  defaultValue=""
                  className="col-span-3 imperial-form-input"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right text-gray-400">
                  Preço
                </Label>
                <Input
                  type="number"
                  id="price"
                  name="price"
                  defaultValue=""
                  className="col-span-3 imperial-form-input"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="duration" className="text-right text-gray-400">
                  Duração (min)
                </Label>
                <Input
                  type="number"
                  id="duration"
                  name="duration"
                  defaultValue=""
                  className="col-span-3 imperial-form-input"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="imperial-button">
                Salvar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Service Dialog */}
      <Dialog open={editServiceOpen} onOpenChange={setEditServiceOpen}>
        <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-gray-900 to-purple-950 border border-purple-700 rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-white">Editar Serviço</DialogTitle>
            <DialogDescription className="text-gray-400">Edite o serviço selecionado.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditService}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right text-gray-400">
                  Nome
                </Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  defaultValue={editingService?.name}
                  className="col-span-3 imperial-form-input"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right text-gray-400">
                  Descrição
                </Label>
                <Input
                  type="text"
                  id="description"
                  name="description"
                  defaultValue={editingService?.description}
                  className="col-span-3 imperial-form-input"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right text-gray-400">
                  Preço
                </Label>
                <Input
                  type="number"
                  id="price"
                  name="price"
                  defaultValue={editingService?.price}
                  className="col-span-3 imperial-form-input"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="duration" className="text-right text-gray-400">
                  Duração (min)
                </Label>
                <Input
                  type="number"
                  id="duration"
                  name="duration"
                  defaultValue={editingService?.duration}
                  className="col-span-3 imperial-form-input"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Appointment Dialog */}
      <Dialog open={addAppointmentOpen} onOpenChange={setAddAppointmentOpen}>
        <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-gray-900 to-purple-950 border border-purple-700 rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-white">Adicionar Agendamento</DialogTitle>
            <DialogDescription className="text-gray-400">Agende um novo serviço para um cliente.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddAppointment}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="clientName" className="text-right text-gray-400">
                  Nome do Cliente
                </Label>
                <Input
                  type="text"
                  id="clientName"
                  name="clientName"
                  defaultValue=""
                  className="col-span-3 bg-gray-900 text-white border-purple-700 focus-visible:ring-purple-500"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="clientPhone" className="text-right text-gray-400">
                  Telefone
                </Label>
                <Input
                  type="tel"
                  id="clientPhone"
                  name="clientPhone"
                  defaultValue=""
                  className="col-span-3 bg-gray-900 text-white border-purple-700 focus-visible:ring-purple-500"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="clientEmail" className="text-right text-gray-400">
                  Email
                </Label>
                <Input
                  type="email"
                  id="clientEmail"
                  name="clientEmail"
                  defaultValue=""
                  className="col-span-3 bg-gray-900 text-white border-purple-700 focus-visible:ring-purple-500"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="serviceId" className="text-right text-gray-400">
                  Serviço
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3 bg-gray-900 text-white border-purple-700 focus-visible:ring-purple-500">
                    <SelectValue placeholder="Selecione um serviço" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 text-white border-purple-700">
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right text-gray-400">
                  Data
                </Label>
                <Input
                  type="date"
                  id="date"
                  name="date"
                  defaultValue={format(date, "yyyy-MM-dd")}
                  className="col-span-3 bg-gray-900 text-white border-purple-700 focus-visible:ring-purple-500"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="time" className="text-right text-gray-400">
                  Horário
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3 bg-gray-900 text-white border-purple-700 focus-visible:ring-purple-500">
                    <SelectValue placeholder="Selecione um horário" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 text-white border-purple-700">
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Agendar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
