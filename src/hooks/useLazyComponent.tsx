
import { useState, useEffect, ComponentType } from 'react';

interface UseLazyComponentReturn<T> {
  Component: ComponentType<T> | null;
  loading: boolean;
  error: Error | null;
}

export function useLazyComponent<T = any>(
  importFn: () => Promise<{ default: ComponentType<T> }>,
  shouldLoad: boolean = true
): UseLazyComponentReturn<T> {
  const [Component, setComponent] = useState<ComponentType<T> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!shouldLoad || Component) return;

    setLoading(true);
    setError(null);

    importFn()
      .then((module) => {
        setComponent(() => module.default);
      })
      .catch((err) => {
        console.error('Error loading component:', err);
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [shouldLoad, importFn, Component]);

  return { Component, loading, error };
}
