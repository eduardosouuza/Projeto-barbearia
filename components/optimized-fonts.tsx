import React from 'react'
import Head from 'next/head'

interface OptimizedFontsProps {
  fonts?: {
    family: string
    weights?: number[]
    display?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional'
  }[]
}

export function OptimizedFonts({ 
  fonts = [
    { 
      family: 'Poppins', 
      weights: [300, 400, 500, 600, 700],
      display: 'swap'
    }
  ] 
}: OptimizedFontsProps) {
  return (
    <Head>
      {fonts.map((font) => {
        const display = font.display || 'swap'
        const weights = font.weights || [400]
        
        return weights.map((weight) => (
          <React.Fragment key={`${font.family}-${weight}`}>
            <link
              rel="preload"
              href={`https://fonts.googleapis.com/css2?family=${font.family.replace(' ', '+')}`+
                   `:wght@${weight}&display=${display}`}
              as="style"
              crossOrigin="anonymous"
            />
            <link
              rel="stylesheet"
              href={`https://fonts.googleapis.com/css2?family=${font.family.replace(' ', '+')}`+
                   `:wght@${weight}&display=${display}`}
              crossOrigin="anonymous"
            />
          </React.Fragment>
        ))
      })}
      <style jsx global>{`
        html {
          font-display: ${fonts[0]?.display || 'swap'};
        }
      `}</style>
    </Head>
  )
} 