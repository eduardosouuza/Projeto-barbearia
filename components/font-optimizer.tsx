"use client"

import { useEffect } from "react"

export function FontOptimizer() {
  useEffect(() => {
    // Garantir que o código execute apenas no navegador
    if (typeof window === 'undefined') return;

    // Funções para gerenciar carga de fontes
    const loadFonts = () => {
      try {
        // Carregar fontes principais
        const fontStylesheet = document.createElement('link');
        fontStylesheet.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
        fontStylesheet.rel = 'stylesheet';
        document.head.appendChild(fontStylesheet);

        // Marcar que as fontes foram carregadas
        document.documentElement.classList.add('fonts-loaded');
      } catch (error) {
        console.error("Erro ao carregar fontes:", error);
      }
    };

    try {
      // Verificar se deve carregar imediatamente ou de forma adiada
      const prefersReducedMotion = window.matchMedia && 
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (prefersReducedMotion) {
        // Se o usuário preferir movimento reduzido, carregue diretamente
        loadFonts();
      } else {
        // Implementação segura do requestIdleCallback
        const safeIdleCallback = (callback: () => void) => {
          // @ts-ignore - Ignorar erro de tipagem
          if (typeof window.requestIdleCallback === 'function') {
            // @ts-ignore - Ignorar erro de tipagem
            window.requestIdleCallback(callback, { timeout: 2000 });
          } else {
            setTimeout(callback, 1000);
          }
        };
        
        // Executar o carregamento de fontes de forma segura
        safeIdleCallback(loadFonts);
      }
    } catch (error) {
      console.error("Erro ao inicializar o otimizador de fontes:", error);
      // Em caso de erro, carregue as fontes diretamente
      setTimeout(loadFonts, 0);
    }
  }, []);

  return null;
} 