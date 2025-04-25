"use client"

import { useEffect, useState, useRef } from 'react'
import Image, { ImageProps } from 'next/image'

interface LazyImageProps extends Omit<ImageProps, 'onLoad'> {
  blurUrl?: string
  threshold?: number
}

export function LazyImage({
  src,
  alt,
  blurUrl,
  threshold = 0.1,
  className = "",
  ...props
}: LazyImageProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const imageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold }
    )

    const currentRef = imageRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.disconnect()
      }
    }
  }, [threshold])

  // Prevenindo problemas de hidratação com SSR
  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return <div ref={imageRef} className={`relative ${className}`} style={props.style} />
  }

  return (
    <div ref={imageRef} className={`relative overflow-hidden ${className}`}>
      {blurUrl && !isLoaded && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${blurUrl})`,
            filter: 'blur(20px)',
            transform: 'scale(1.1)',
            opacity: isLoaded ? 0 : 1,
            transition: 'opacity 0.5s ease',
          }}
        />
      )}
      {isVisible && (
        <Image
          src={src}
          alt={alt}
          onLoadingComplete={() => setIsLoaded(true)}
          className={`transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          {...props}
        />
      )}
    </div>
  )
} 