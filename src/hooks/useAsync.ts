import { useEffect, useRef, useState } from 'react';

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * Runs an async factory whenever `deps` change, tracking loading/error state
 * and ignoring results from a stale run (e.g. the lodge tab changed before
 * the previous fetch resolved). Centralizes this so individual hooks stay
 * focused on *what* to fetch, not on race-condition bookkeeping.
 */
export function useAsync<T>(factory: () => Promise<T>, deps: React.DependencyList): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({ data: null, loading: true, error: null });
  const requestId = useRef(0);

  useEffect(() => {
    const id = ++requestId.current;
    setState((prev) => ({ ...prev, loading: true, error: null }));

    factory()
      .then((data) => {
        if (requestId.current === id) setState({ data, loading: false, error: null });
      })
      .catch((error: unknown) => {
        if (requestId.current === id) {
          const message = error instanceof Error ? error.message : 'Ocurrió un error inesperado.';
          setState({ data: null, loading: false, error: message });
        }
      });

    // `deps` is caller-controlled by design, mirroring useEffect/useMemo.
  }, deps);

  return state;
}
