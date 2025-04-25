"use client"

import { useEffect } from "react"

export function DeferredScripts() {
  useEffect(() => {
    // Garantir que o código execute apenas no navegador
    if (typeof window === 'undefined') return;

    // Função para carregar scripts após a página estar completamente carregada
    const loadDeferredScripts = () => {
      try {
        // Analytics (exemplo)
        const analyticsScript = document.createElement('script')
        analyticsScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-EXAMPLE'
        analyticsScript.async = true
        document.body.appendChild(analyticsScript)
        
        // Inicializar analytics
        // @ts-ignore - Ignorar problema de tipagem
        window.dataLayer = window.dataLayer || []
        // @ts-ignore - Ignorar problema de tipagem
        function gtag(...args: any[]) {
          // @ts-ignore - Ignorar problema de tipagem
          window.dataLayer.push(args)
        }
        gtag('js', new Date())
        gtag('config', 'G-EXAMPLE')
        
        // Outros scripts não críticos podem ser adicionados aqui
      } catch (error) {
        console.error("Erro ao carregar scripts diferidos:", error);
      }
    }

    try {
      // Implementação segura do requestIdleCallback
      const safeIdleCallback = (callback: () => void) => {
        // @ts-ignore - Ignorar erro de tipagem
        if (typeof window.requestIdleCallback === 'function') {
          // @ts-ignore - Ignorar erro de tipagem
          window.requestIdleCallback(callback);
        } else {
          setTimeout(callback, 1);
        }
      };
      
      // Executar o carregamento de scripts de forma segura
      safeIdleCallback(() => {
        loadDeferredScripts();
      });
    } catch (error) {
      console.error("Erro ao inicializar scripts diferidos:", error);
      // Em caso de erro, carregue os scripts com um pequeno atraso
      setTimeout(loadDeferredScripts, 2000);
    }
  }, [])

  return null
} 