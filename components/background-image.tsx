"use client"

import { useState, useEffect } from "react"

interface BackgroundImageProps {
  src: string
  lowResSrc?: string
  className?: string
}

export function BackgroundImage({ src, lowResSrc, className = "" }: BackgroundImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const placeholderSrc = lowResSrc || src

  useEffect(() => {
    // Criar uma nova imagem para pré-carregar
    const img = new Image()
    img.src = src
    img.onload = () => {
      setIsLoaded(true)
    }
  }, [src])

  return (
    <>
      {/* Versão de baixa resolução (carrega imediatamente) */}
      <div
        className={`absolute inset-0 bg-cover bg-center bg-fixed ${className} ${isLoaded ? "opacity-0" : "opacity-100"}`}
        style={{
          backgroundImage: `url(${placeholderSrc})`,
          transition: "opacity 0.5s ease-in-out",
        }}
      />

      {/* Versão de alta resolução (carrega em segundo plano) */}
      <div
        className={`absolute inset-0 bg-cover bg-center bg-fixed ${className} ${isLoaded ? "opacity-100" : "opacity-0"}`}
        style={{
          backgroundImage: `url(${src})`,
          transition: "opacity 0.5s ease-in-out",
        }}
      />
    </>
  )
}
