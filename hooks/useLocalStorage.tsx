import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
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
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.log('Erro ao recuperar dado do localStorage:', error);
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
      
      // Salva no localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.log('Erro ao salvar no localStorage:', error);
    }
  };
  
  return [storedValue, setValue] as const;
} 