import { useEffect, useRef, useCallback, useState } from 'react';

interface UseWebSocketOptions {
  /** URL to connect to (e.g. `ws://host/path` or `wss://host/path`) */
  url: string;
  /** Called with each parsed message */
  onMessage?: (data: unknown) => void;
  /** Reconnect delay in ms (default: 2000) */
  reconnectDelay?: number;
  /** Maximum reconnect attempts (default: Infinity). Set to 0 to disable reconnection. */
  maxRetries?: number;
}

interface UseWebSocketReturn<T> {
  /** Send a JSON-serialisable value */
  send: (msg: T) => void;
  /** Current readyState of the underlying WebSocket */
  readyState: number;
  /** The most recently received raw message (parsed) */
  lastMessage: unknown;
  /** Error message, if any */
  error: string | null;
}

/**
 * Typed WebSocket hook with auto-reconnect support.
 *
 * @example
 * const { send, readyState, lastMessage } = useWebSocket<{ type: string }>({
 *   url: 'ws://localhost:3001/ws',
 *   onMessage: (data) => console.log('received', data),
 * })
 */
export function useWebSocket<T = unknown>(
  options: UseWebSocketOptions,
): UseWebSocketReturn<T> {
  const { url, onMessage, reconnectDelay = 2000, maxRetries = Infinity } = options;

  const wsRef = useRef<WebSocket | null>(null);
  const onMessageRef = useRef(onMessage);
  const retryCountRef = useRef(0);
  const destroyedRef = useRef(false);

  const [readyState, setReadyState] = useState<number>(WebSocket.CLOSED);
  const [lastMessage, setLastMessage] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);

  // Always keep the latest onMessage callback
  onMessageRef.current = onMessage;

  useEffect(() => {
    destroyedRef.current = false;
    retryCountRef.current = 0;

    function connect() {
      if (destroyedRef.current) return;
      if (retryCountRef.current >= maxRetries) return;

      try {
        const ws = new WebSocket(url);
        wsRef.current = ws;

        ws.onopen = () => {
          setReadyState(WebSocket.OPEN);
          setError(null);
          retryCountRef.current = 0; // reset retry counter on successful connect
        };

        ws.onmessage = (e: MessageEvent) => {
          let parsed: unknown;
          try {
            parsed = JSON.parse(e.data as string) as T;
          } catch {
            parsed = e.data; // fall through as raw string if JSON parse fails
          }
          setLastMessage(parsed);
          onMessageRef.current?.(parsed);
        };

        ws.onerror = () => {
          setError('WebSocket error');
        };

        ws.onclose = () => {
          setReadyState(WebSocket.CLOSED);
          wsRef.current = null;
          if (!destroyedRef.current && retryCountRef.current < maxRetries) {
            retryCountRef.current += 1;
            setTimeout(connect, reconnectDelay);
          }
        };

        setReadyState(WebSocket.CONNECTING);
      } catch (err) {
        setError((err as Error).message);
      }
    }

    connect();

    return () => {
      destroyedRef.current = true;
      wsRef.current?.close();
      wsRef.current = null;
      setReadyState(WebSocket.CLOSED);
    };
  }, [url, reconnectDelay, maxRetries]);

  const send = useCallback((msg: T) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(msg));
    }
  }, []);

  return { send, readyState, lastMessage, error };
}
