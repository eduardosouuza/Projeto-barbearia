"use client"

import React from 'react'
import Image, { ImageProps } from 'next/image'

interface SimpleImageProps extends Omit<ImageProps, 'onLoad'> {
  className?: string
}

export function SimpleImage({
  src,
  alt,
  width,
  height,
  className = '',
  ...props
}: SimpleImageProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="w-full h-auto"
        loading="lazy"
        {...props}
      />
    </div>
  )
} 