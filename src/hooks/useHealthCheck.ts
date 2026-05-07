import { useState, useEffect, useCallback, useRef } from 'react';

export type HealthStatus = 'checking' | 'up' | 'down' | 'error';

interface UseHealthCheckOptions {
  /** Polling interval in ms (default: 10000) */
  interval?: number;
  /** Request timeout in ms (default: 3000) */
  timeout?: number;
}

interface UseHealthCheckReturn {
  status: HealthStatus;
  lastChecked: Date | null;
  error: string | null;
  refresh: () => void;
}

/**
 * Poll a health endpoint at a regular interval.
 *
 * @example
 * const { status, lastChecked } = useHealthCheck('http://localhost:3001/health')
 */
export function useHealthCheck(
  url: string,
  options: UseHealthCheckOptions = {},
): UseHealthCheckReturn {
  const { interval = 10000, timeout = 3000 } = options;
  const [status, setStatus] = useState<HealthStatus>('checking');
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const check = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const timer = setTimeout(() => controller.abort(), timeout);
      const res = await fetch(url, { signal: controller.signal, cache: 'no-store' });
      clearTimeout(timer);

      setStatus(res.ok ? 'up' : 'down');
      setError(null);
      setLastChecked(new Date());
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      setStatus('down');
      setError((err as Error).message);
      setLastChecked(new Date());
    }
  }, [url, timeout]);

  useEffect(() => {
    check();
    const id = setInterval(check, interval);
    return () => {
      clearInterval(id);
      abortRef.current?.abort();
    };
  }, [check, interval]);

  return { status, lastChecked, error, refresh: check };
}
