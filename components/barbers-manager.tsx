"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Plus, Trash2, User } from "lucide-react"

interface Barber {
  id: string
  nome: string
  especialidade: string
  telefone: string
  email: string
  foto: string
}

export function BarbersManager() {
  const [barbeiros, setBarbeiros] = useState<Barber[]>([])
  const [addBarberOpen, setAddBarberOpen] = useState(false)
  const [editBarberOpen, setEditBarberOpen] = useState(false)
  const [editingBarber, setEditingBarber] = useState<Barber | null>(null)

  // Carregar barbeiros do localStorage
  useEffect(() => {
    const savedBarbers = localStorage.getItem("barberBarbers")
    if (savedBarbers) {
      setBarbeiros(JSON.parse(savedBarbers))
    }
  }, [])

  const handleAddBarber = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newBarber: Barber = {
      id: (barbeiros.length + 1).toString(),
      nome: formData.get("nome") as string,
      especialidade: formData.get("especialidade") as string,
      telefone: formData.get("telefone") as string,
      email: formData.get("email") as string,
      foto: "/placeholder.svg?height=100&width=100", // Placeholder para foto
    }
    const updatedBarbers = [...barbeiros, newBarber]
    setBarbeiros(updatedBarbers)

    // Salvar no localStorage
    localStorage.setItem("barberBarbers", JSON.stringify(updatedBarbers))

    setAddBarberOpen(false)
  }

  const handleEditBarber = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingBarber) return

    const formData = new FormData(e.currentTarget)
    const updatedBarber: Barber = {
      id: editingBarber.id,
      nome: formData.get("nome") as string,
      especialidade: formData.get("especialidade") as string,
      telefone: formData.get("telefone") as string,
      email: formData.get("email") as string,
      foto: editingBarber.foto,
    }

    const updatedBarbers = barbeiros.map((b) => (b.id === editingBarber.id ? updatedBarber : b))
    setBarbeiros(updatedBarbers)

    // Salvar no localStorage
    localStorage.setItem("barberBarbers", JSON.stringify(updatedBarbers))

    setEditBarberOpen(false)
    setEditingBarber(null)
  }

  const handleDeleteBarber = (id: string) => {
    const updatedBarbers = barbeiros.filter((b) => b.id !== id)
    setBarbeiros(updatedBarbers)

    // Salvar no localStorage
    localStorage.setItem("barberBarbers", JSON.stringify(updatedBarbers))
  }

  return (
    <Card className="bg-gray-900 border-purple-900/30">
      <CardHeader className="p-3 md:p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
          <div>
            <CardTitle className="text-white flex items-center text-lg md:text-xl">
              <User className="mr-2 h-4 w-4 md:h-5 md:w-5 text-purple-400" />
              Gerenciamento de Barbeiros
            </CardTitle>
            <CardDescription className="text-purple-300 text-xs md:text-sm">
              Adicione e gerencie os profissionais da barbearia
            </CardDescription>
          </div>

          <Dialog open={addBarberOpen} onOpenChange={setAddBarberOpen}>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white h-9 text-sm">
                <Plus className="mr-2 h-3.5 w-3.5 md:h-4 md:w-4" />
                Novo Barbeiro
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-purple-900/30 w-[95vw] max-w-md md:w-full">
              <DialogHeader>
                <DialogTitle className="text-white">Adicionar Barbeiro</DialogTitle>
                <DialogDescription className="text-purple-300">
                  Preencha os dados para adicionar um novo profissional.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddBarber} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome" className="text-white">
                    Nome
                  </Label>
                  <Input id="nome" name="nome" required className="bg-gray-800 border-gray-700 text-white" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="especialidade" className="text-white">
                    Especialidade
                  </Label>
                  <Input
                    id="especialidade"
                    name="especialidade"
                    required
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone" className="text-white">
                    Telefone
                  </Label>
                  <Input id="telefone" name="telefone" required className="bg-gray-800 border-gray-700 text-white" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">
                    E-mail
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <DialogFooter>
                  <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white">
                    Adicionar
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="p-0 md:p-4">
        <div className="overflow-x-auto -mx-3 md:mx-0">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-800/50">
                  <TableRow>
                    <TableHead className="text-purple-300 px-3 py-2 md:px-4 md:py-3 text-xs">Foto</TableHead>
                    <TableHead className="text-purple-300 px-3 py-2 md:px-4 md:py-3 text-xs">Nome</TableHead>
                    <TableHead className="text-purple-300 px-3 py-2 md:px-4 md:py-3 text-xs">Especialidade</TableHead>
                    <TableHead className="text-purple-300 px-3 py-2 md:px-4 md:py-3 text-xs">Contato</TableHead>
                    <TableHead className="text-purple-300 px-3 py-2 md:px-4 md:py-3 text-xs w-[80px] md:w-[100px]">
                      Ações
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {barbeiros.map((barbeiro) => (
                    <TableRow key={barbeiro.id} className="border-b border-purple-900/10">
                      <TableCell className="px-3 py-2 md:px-4 md:py-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden bg-gray-800">
                          <img
                            src={barbeiro.foto || "/placeholder.svg"}
                            alt={barbeiro.nome}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-white px-3 py-2 md:px-4 md:py-3 text-xs md:text-sm">
                        {barbeiro.nome}
                      </TableCell>
                      <TableCell className="text-white px-3 py-2 md:px-4 md:py-3 text-xs md:text-sm">
                        {barbeiro.especialidade}
                      </TableCell>
                      <TableCell className="text-white px-3 py-2 md:px-4 md:py-3">
                        <div className="text-xs md:text-sm">{barbeiro.telefone}</div>
                        <div className="text-xs text-purple-300">{barbeiro.email}</div>
                      </TableCell>
                      <TableCell className="px-3 py-2 md:px-4 md:py-3">
                        <div className="flex items-center gap-1 md:gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setEditingBarber(barbeiro)
                              setEditBarberOpen(true)
                            }}
                            className="text-purple-400 hover:text-purple-300 hover:bg-purple-900/20 h-7 w-7 md:h-8 md:w-8"
                          >
                            <Edit className="h-3.5 w-3.5 md:h-4 md:w-4" />
                            <span className="sr-only">Editar</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteBarber(barbeiro.id)}
                            className="text-purple-400 hover:text-purple-300 hover:bg-purple-900/20 h-7 w-7 md:h-8 md:w-8"
                          >
                            <Trash2 className="h-3.5 w-3.5 md:h-4 md:w-4" />
                            <span className="sr-only">Excluir</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        <Dialog open={editBarberOpen} onOpenChange={setEditBarberOpen}>
          <DialogContent className="bg-gray-900 border-purple-900/30 w-[95vw] max-w-md md:w-full">
            <DialogHeader>
              <DialogTitle className="text-white">Editar Barbeiro</DialogTitle>
              <DialogDescription className="text-purple-300">Atualize os dados do profissional.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEditBarber} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome" className="text-white">
                  Nome
                </Label>
                <Input
                  id="nome"
                  name="nome"
                  defaultValue={editingBarber?.nome}
                  required
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="especialidade" className="text-white">
                  Especialidade
                </Label>
                <Input
                  id="especialidade"
                  name="especialidade"
                  defaultValue={editingBarber?.especialidade}
                  required
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefone" className="text-white">
                  Telefone
                </Label>
                <Input
                  id="telefone"
                  name="telefone"
                  defaultValue={editingBarber?.telefone}
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
                  name="email"
                  type="email"
                  defaultValue={editingBarber?.email}
                  required
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white">
                  Salvar Alterações
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
