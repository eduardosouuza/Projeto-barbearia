"use client"

import { SimpleImage } from "@/components/simple-image"

export default function TestePage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-8">Página de Teste</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-gray-300 p-4 rounded-lg">
          <h2 className="font-semibold mb-4">Teste de Imagem Simples</h2>
          <SimpleImage 
            src="/placeholder.svg?height=300&width=300" 
            alt="Imagem de teste" 
            width={300} 
            height={300}
          />
        </div>
        
        <div className="border border-gray-300 p-4 rounded-lg">
          <h2 className="font-semibold mb-4">Teste de Imagem HTML</h2>
          <img 
            src="/placeholder.svg?height=300&width=300" 
            alt="Imagem HTML de teste" 
            width={300} 
            height={300}
          />
        </div>
      </div>
    </div>
  )
} 