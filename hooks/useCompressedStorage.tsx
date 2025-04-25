import { useState, useEffect } from 'react';

// Função de compressão básica (exemplo simples)
const compress = (data: string): string => {
  try {
    // Aqui poderíamos usar uma biblioteca como lz-string para compressão real
    // Mas para este exemplo, apenas convertemos para base64
    return typeof window !== 'undefined' 
      ? btoa(encodeURIComponent(data))
      : data;
  } catch (error) {
    console.error("Erro ao comprimir dados:", error);
    return data;
  }
};

// Função de descompressão
const decompress = (compressed: string): string => {
  try {
    // Descompressão correspondente
    return typeof window !== 'undefined'
      ? decodeURIComponent(atob(compressed))
      : compressed;
  } catch (error) {
    console.error("Erro ao descomprimir dados:", error);
    return compressed;
  }
};

export function useCompressedStorage<T>(key: string, initialValue: T) {
  // Estado para armazenar o valor
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  
  // Inicializa o estado com o valor do localStorage (ou valor inicial)
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    
    try {
      const item = window.localStorage.getItem(key);
      // Verifica se o item já existe no localStorage
      if (item) {
        const decompressed = decompress(item);
        setStoredValue(JSON.parse(decompressed));
      }
    } catch (error) {
      console.log('Erro ao recuperar/descomprimir dados:', error);
      // Se ocorrer um erro, retorna o valor inicial
      setStoredValue(initialValue);
    }
  }, [key, initialValue]);
  
  // Função para atualizar o valor no localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Permite que o valor seja uma função (como em setState)
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
        
      // Salva o estado
      setStoredValue(valueToStore);
      
      // Comprime e salva no localStorage
      if (typeof window !== 'undefined') {
        const compressed = compress(JSON.stringify(valueToStore));
        window.localStorage.setItem(key, compressed);
      }
    } catch (error) {
      console.log('Erro ao comprimir/salvar dados:', error);
    }
  };
  
  return [storedValue, setValue] as const;
} 