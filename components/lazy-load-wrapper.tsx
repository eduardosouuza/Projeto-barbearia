"use client"

import { useEffect, useState, ReactNode } from "react"

interface LazyLoadWrapperProps {
  children: ReactNode
  placeholder?: ReactNode
  threshold?: number
  rootMargin?: string
  className?: string
}

export function LazyLoadWrapper({
  children,
  placeholder,
  threshold = 0.1,
  rootMargin = "200px",
  className = "",
}: LazyLoadWrapperProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)
  const [elementId] = useState(`lazy-${Math.random().toString(36).substring(2, 9)}`)

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold, rootMargin }
    )

    const element = document.getElementById(elementId)
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [elementId, rootMargin, threshold])

  useEffect(() => {
    if (isVisible) {
      setHasLoaded(true)
    }
  }, [isVisible])

  return (
    <div id={elementId} className={className}>
      {hasLoaded ? children : placeholder || <div className="animate-pulse bg-gray-800 h-full w-full" />}
    </div>
  )
} 