import { useState, useEffect } from 'react';

export default function useDebounce(value: string, delay: number) {
  const [isDebouncing, setIsDebouncing] = useState(false)
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    setIsDebouncing(true)
    const handler = setTimeout(() => {
      setIsDebouncing(false)
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return {debouncedValue, isDebouncing};
}