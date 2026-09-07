import { useState, useCallback } from 'react';
import { fetchApi, ApiError } from '../utils/api';

interface UseApiResponse<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
  execute: (endpoint: string, options?: RequestInit) => Promise<T | null>;
}

export function useApi<T>(initialData: T | null = null): UseApiResponse<T> {
  const [data, setData] = useState<T | null>(initialData);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const execute = useCallback(async (endpoint: string, options?: RequestInit) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchApi<T>(endpoint, options);
      setData(result);
      return result;
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('予期せぬエラーが発生しました。');
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { data, error, isLoading, execute };
}
