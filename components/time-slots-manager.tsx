"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Save } from "lucide-react"

const DIAS_SEMANA = [
  { id: "1", nome: "Segunda-feira" },
  { id: "2", nome: "Terça-feira" },
  { id: "3", nome: "Quarta-feira" },
  { id: "4", nome: "Quinta-feira" },
  { id: "5", nome: "Sexta-feira" },
  { id: "6", nome: "Sábado" },
  { id: "0", nome: "Domingo" },
]

const HORARIOS_PADRAO = [
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

interface TimeSlot {
  id: string
  hora: string
  disponivel: boolean
}

interface DiaConfig {
  id: string
  nome: string
  aberto: boolean
  horarioInicio: string
  horarioFim: string
  slots: TimeSlot[]
}

export function TimeSlotsManager() {
  const [diasConfig, setDiasConfig] = useState<DiaConfig[]>([])
  const [diaAtual, setDiaAtual] = useState<string>("1")
  const [isMobile, setIsMobile] = useState(false)

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Inicializar e carregar do localStorage
  useEffect(() => {
    const savedTimeSlots = localStorage.getItem("barberTimeSlots")

    if (savedTimeSlots) {
      setDiasConfig(JSON.parse(savedTimeSlots))
    } else {
      // Configuração padrão se não existir no localStorage
      const defaultConfig = DIAS_SEMANA.map((dia) => ({
        id: dia.id,
        nome: dia.nome,
        aberto: dia.id !== "0", // Fechado aos domingos por padrão
        horarioInicio: "09:00",
        horarioFim: "18:00",
        slots: HORARIOS_PADRAO.map((hora, index) => ({
          id: `${dia.id}-${index}`,
          hora,
          disponivel: true,
        })),
      }))

      setDiasConfig(defaultConfig)
      localStorage.setItem("barberTimeSlots", JSON.stringify(defaultConfig))
    }
  }, [])

  const handleToggleDay = (diaId: string, aberto: boolean) => {
    const updatedConfig = diasConfig.map((dia) => (dia.id === diaId ? { ...dia, aberto } : dia))
    setDiasConfig(updatedConfig)
    localStorage.setItem("barberTimeSlots", JSON.stringify(updatedConfig))
  }

  const handleToggleSlot = (slotId: string) => {
    const updatedConfig = diasConfig.map((dia) => ({
      ...dia,
      slots: dia.slots.map((slot) => (slot.id === slotId ? { ...slot, disponivel: !slot.disponivel } : slot)),
    }))
    setDiasConfig(updatedConfig)
    localStorage.setItem("barberTimeSlots", JSON.stringify(updatedConfig))
  }

  const handleChangeHorario = (diaId: string, tipo: "inicio" | "fim", valor: string) => {
    const updatedConfig = diasConfig.map((dia) =>
      dia.id === diaId
        ? {
            ...dia,
            [tipo === "inicio" ? "horarioInicio" : "horarioFim"]: valor,
          }
        : dia,
    )
    setDiasConfig(updatedConfig)
    localStorage.setItem("barberTimeSlots", JSON.stringify(updatedConfig))
  }

  const handleSaveConfig = () => {
    // Já está salvando em cada alteração, mas podemos adicionar uma confirmação visual
    console.log("Configuração salva:", diasConfig)
    alert("Configurações de horários salvas com sucesso!")
  }

  const configDiaAtual = diasConfig.find((dia) => dia.id === diaAtual)

  return (
    <Card className="bg-gray-900 border-purple-900/30">
      <CardHeader className="p-3 md:p-4">
        <CardTitle className="text-white flex items-center text-lg md:text-xl">
          <Clock className="mr-2 h-4 w-4 md:h-5 md:w-5 text-purple-400" />
          Gerenciamento de Horários
        </CardTitle>
        <CardDescription className="text-purple-300 text-xs md:text-sm">
          Configure os horários disponíveis para agendamento
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3 md:p-4">
        <Tabs defaultValue="1" value={diaAtual} onValueChange={setDiaAtual}>
          <div className="overflow-x-auto -mx-3 md:mx-0 pb-2">
            <TabsList className="mb-4 bg-gray-800 border-gray-700 inline-flex whitespace-nowrap">
              {DIAS_SEMANA.map((dia) => (
                <TabsTrigger
                  key={dia.id}
                  value={dia.id}
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-xs"
                >
                  {isMobile ? dia.nome.substring(0, 3) : dia.nome}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {DIAS_SEMANA.map((dia) => {
            const config = diasConfig.find((d) => d.id === dia.id)
            if (!config) return null

            return (
              <TabsContent key={dia.id} value={dia.id} className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`day-toggle-${dia.id}`}
                      checked={config.aberto}
                      onCheckedChange={(checked) => handleToggleDay(dia.id, checked)}
                      className="data-[state=checked]:bg-purple-600"
                    />
                    <Label htmlFor={`day-toggle-${dia.id}`} className="text-white text-sm">
                      {config.aberto ? "Aberto" : "Fechado"}
                    </Label>
                  </div>

                  {config.aberto && (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                      <div className="flex items-center space-x-2">
                        <Label htmlFor={`horario-inicio-${dia.id}`} className="text-white text-sm">
                          Das
                        </Label>
                        <Select
                          value={config.horarioInicio}
                          onValueChange={(value) => handleChangeHorario(dia.id, "inicio", value)}
                        >
                          <SelectTrigger
                            id={`horario-inicio-${dia.id}`}
                            className="w-20 md:w-24 bg-gray-800 border-gray-700 text-white text-xs md:text-sm h-8"
                          >
                            <SelectValue placeholder="Início" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700">
                            {["08:00", "08:30", "09:00", "09:30", "10:00"].map((hora) => (
                              <SelectItem
                                key={hora}
                                value={hora}
                                className="text-white hover:bg-gray-700 text-xs md:text-sm"
                              >
                                {hora}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Label htmlFor={`horario-fim-${dia.id}`} className="text-white text-sm">
                          às
                        </Label>
                        <Select
                          value={config.horarioFim}
                          onValueChange={(value) => handleChangeHorario(dia.id, "fim", value)}
                        >
                          <SelectTrigger
                            id={`horario-fim-${dia.id}`}
                            className="w-20 md:w-24 bg-gray-800 border-gray-700 text-white text-xs md:text-sm h-8"
                          >
                            <SelectValue placeholder="Fim" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700">
                            {["17:00", "17:30", "18:00", "18:30", "19:00"].map((hora) => (
                              <SelectItem
                                key={hora}
                                value={hora}
                                className="text-white hover:bg-gray-700 text-xs md:text-sm"
                              >
                                {hora}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>

                {config.aberto && (
                  <div className="mt-4">
                    <h3 className="text-white font-medium mb-3 text-sm">Horários disponíveis:</h3>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
                      {config.slots.map((slot) => (
                        <button
                          key={slot.id}
                          className={`
                            time-slot p-1.5 md:p-2 text-xs rounded border 
                            ${
                              slot.disponivel
                                ? "time-slot-selected border-purple-500 bg-purple-900/20 text-white"
                                : "border-gray-700 bg-gray-800/50 text-gray-400"
                            }
                          `}
                          onClick={() => handleToggleSlot(slot.id)}
                        >
                          {slot.hora}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>
            )
          })}
        </Tabs>
      </CardContent>
      <CardFooter className="p-3 md:p-4">
        <Button className="bg-purple-600 hover:bg-purple-700 text-white text-sm h-9" onClick={handleSaveConfig}>
          <Save className="mr-2 h-3.5 w-3.5 md:h-4 md:w-4" />
          Salvar Configurações
        </Button>
      </CardFooter>
    </Card>
  )
}
