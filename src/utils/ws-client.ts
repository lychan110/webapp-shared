/**
 * Generic WebSocket client with auto-reconnect, message queuing, and health checking.
 *
 * Designed for server-side Node.js use (relies on the `ws` package).
 *
 * @example
 * ```ts
 * const client = createWSClient<string>({
 *   url: 'ws://localhost:3001/ws',
 *   reconnectDelay: 2000,
 *   maxRetries: 10,
 * });
 *
 * client.on('message', (data) => console.log('received:', data));
 * client.on('connected', () => console.log('connected'));
 * client.on('disconnected', (code) => console.log('disconnected:', code));
 *
 * client.send({ type: 'ping' });
 * client.connect();
 * ```
 */

import WebSocket from 'ws';

export type WSMessage = string | Buffer | ArrayBuffer | Buffer[];
export type WSData = Record<string, unknown> | unknown[] | string | number | boolean | null;

export interface WSClientOptions {
  /** WebSocket URL to connect to */
  url: string;
  /** Reconnect delay in ms (default: 2000) */
  reconnectDelay?: number;
  /** Maximum reconnect attempts (default: Infinity). Set to 0 to disable reconnection. */
  maxRetries?: number;
  /** Timeout in ms for health check ping (default: 30000). Set to 0 to disable. */
  healthCheckInterval?: number;
  /** Custom WebSocket sub-protocols */
  protocols?: string | string[];
  /** Extra headers for the initial HTTP upgrade request */
  headers?: Record<string, string>;
}

export interface WSClientEventMap {
  connected: void;
  disconnected: { code: number; reason: string };
  message: WSData;
  error: Error;
  reconnecting: { attempt: number; maxRetries: number };
}

export type WSClientEventListener<E extends keyof WSClientEventMap> =
  WSClientEventMap[E] extends void
    ? () => void
    : (payload: WSClientEventMap[E]) => void;

export interface WSClient {
  /** Open the connection. Automatically called once on creation if `autoConnect` is not false. */
  connect(): void;
  /** Close the connection gracefully. */
  disconnect(code?: number, reason?: string): void;
  /** Send a JSON-serialisable message. Queues if not connected. */
  send(data: WSData): void;
  /** Send a raw WebSocket message (bypasses JSON serialisation). */
  sendRaw(data: WSMessage): void;
  /** Register an event listener. */
  on<E extends keyof WSClientEventMap>(
    event: E,
    listener: WSClientEventListener<E>,
  ): () => void;
  /** Remove an event listener. */
  off<E extends keyof WSClientEventMap>(
    event: E,
    listener: WSClientEventListener<E>,
  ): void;
  /** Current ready state of the underlying WebSocket. */
  readonly readyState: number;
  /** Whether the client is currently connected. */
  readonly isConnected: boolean;
  /** Destroy the client — disconnects and clears all listeners. */
  destroy(): void;
}

/**
 * Create a generic WebSocket client with auto-reconnect, message queuing,
 * and optional health-check ping.
 */
export function createWSClient(options: WSClientOptions): WSClient {
  const {
    url,
    reconnectDelay = 2000,
    maxRetries = Infinity,
    healthCheckInterval = 30000,
    protocols,
    headers,
  } = options;

  let ws: WebSocket | null = null;
  let retryCount = 0;
  let destroyed = false;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  let healthCheckTimer: ReturnType<typeof setInterval> | null = null;
  let _readyState = WebSocket.CLOSED;

  const messageQueue: WSData[] = [];
  const listeners = new Map<string, Set<(...args: unknown[]) => void>>();

  // ── Event helpers ────────────────────────────────────────────────────────

  function addListener<E extends keyof WSClientEventMap>(
    event: E,
    listener: WSClientEventListener<E>,
  ): () => void {
    let set = listeners.get(event);
    if (!set) {
      set = new Set();
      listeners.set(event, set);
    }
    set.add(listener as (...args: unknown[]) => void);
    return () => { set?.delete(listener as (...args: unknown[]) => void); };
  }

  function removeListener<E extends keyof WSClientEventMap>(
    event: E,
    listener: WSClientEventListener<E>,
  ): void {
    listeners.get(event)?.delete(listener as (...args: unknown[]) => void);
  }

  function emit(event: 'connected'): void;
  function emit(event: 'disconnected', payload: { code: number; reason: string }): void;
  function emit(event: 'message', payload: WSData): void;
  function emit(event: 'error', payload: Error): void;
  function emit(event: 'reconnecting', payload: { attempt: number; maxRetries: number }): void;
  function emit(event: string, payload?: unknown): void {
    const set = listeners.get(event);
    if (set) {
      for (const listener of set) {
        listener(payload);
      }
    }
  }

  // ── Health check ─────────────────────────────────────────────────────────

  function startHealthCheck(): void {
    if (healthCheckInterval <= 0) return;
    stopHealthCheck();
    healthCheckTimer = setInterval(() => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        // Send a lightweight ping frame if the underlying socket supports it
        try {
          ws.ping();
        } catch {
          // ws library may not expose ping; fall through
        }
      }
    }, healthCheckInterval);
  }

  function stopHealthCheck(): void {
    if (healthCheckTimer) {
      clearInterval(healthCheckTimer);
      healthCheckTimer = null;
    }
  }

  // ── Connection logic ─────────────────────────────────────────────────────

  function connect(): void {
    if (destroyed) return;
    if (retryCount >= maxRetries) return;

    try {
      ws = new WebSocket(url, protocols, { headers });

      ws.onopen = () => {
        if (destroyed) return;
        _readyState = WebSocket.OPEN;
        retryCount = 0;
        startHealthCheck();

        // Flush queued messages
        while (messageQueue.length > 0) {
          const msg = messageQueue.shift()!;
          ws?.send(JSON.stringify(msg));
        }

        emit('connected');
      };

      ws.onmessage = (event: WebSocket.MessageEvent) => {
        if (destroyed) return;
        let parsed: WSData;
        try {
          parsed = JSON.parse(event.data as string) as WSData;
        } catch {
          parsed = event.data as WSData;
        }
        emit('message', parsed);
      };

      ws.onerror = (event: WebSocket.ErrorEvent) => {
        if (destroyed) return;
        const err = event.error ?? new Error('WebSocket error');
        emit('error', err instanceof Error ? err : new Error(String(err)));
      };

      ws.onclose = (event: WebSocket.CloseEvent) => {
        if (destroyed) return;
        _readyState = WebSocket.CLOSED;
        stopHealthCheck();
        ws = null;

        emit('disconnected', {
          code: event.code,
          reason: event.reason || 'Connection closed',
        });

        // Schedule reconnection
        if (!destroyed && retryCount < maxRetries) {
          retryCount += 1;
          emit('reconnecting', { attempt: retryCount, maxRetries });
          reconnectTimer = setTimeout(connect, reconnectDelay);
        }
      };

      _readyState = WebSocket.CONNECTING;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      emit('error', error);
    }
  }

  function disconnect(code = 1000, reason?: string): void {
    destroyed = true;
    stopHealthCheck();
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
    if (ws) {
      ws.close(code, reason);
      ws = null;
    }
    _readyState = WebSocket.CLOSED;
  }

  function send(data: WSData): void {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    } else {
      messageQueue.push(data);
    }
  }

  function sendRaw(data: WSMessage): void {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(data);
    }
    // Raw messages are not queued — caller must check connection state
  }

  function destroy(): void {
    disconnect();
    listeners.clear();
    messageQueue.length = 0;
  }

  const client: WSClient = {
    connect,
    disconnect,
    send,
    sendRaw,
    on: addListener,
    off: removeListener,
    get readyState() {
      return _readyState;
    },
    get isConnected() {
      return _readyState === WebSocket.OPEN;
    },
    destroy,
  };

  return client;
}
