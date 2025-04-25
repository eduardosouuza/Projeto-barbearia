import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // Função para obter valor inicial do localStorage
  const readValue = (): T => {
    // Verificar se estamos no cliente
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      // Obter do localStorage pelo key
      const item = window.localStorage.getItem(key);
      // Retornar valor parseado ou valor inicial
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Erro ao ler localStorage key "${key}":`, error);
      return initialValue;
    }
  };

  // Estado para armazenar nosso valor
  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Função para atualizar o valor no localStorage
  const setValue = (value: T): void => {
    try {
      // Permitir que o valor seja uma função para seguir o mesmo padrão do useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Salvar no estado
      setStoredValue(valueToStore);
      
      // Salvar no localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Erro ao definir localStorage key "${key}":`, error);
    }
  };

  // Sincronizar caso a chave do localStorage mude em outra aba
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue) {
        setStoredValue(JSON.parse(event.newValue) as T);
      }
    };

    // Escutar alterações
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, [key]);

  return [storedValue, setValue];
} 