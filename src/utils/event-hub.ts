/**
 * Typed lazy event emitter / event hub pattern.
 *
 * `createEventHub<T>()` returns a lightweight event hub with `on`, `off`,
 * and `emit` — no external dependencies, no eager listener allocation.
 *
 * @example
 * ```ts
 * interface AppEvents {
 *   userLogin:   { userId: string; time: Date };
 *   fileSaved:   { path: string; size: number };
 *   error:       { message: string };
 * }
 *
 * const hub = createEventHub<AppEvents>();
 *
 * const off = hub.on('userLogin', (payload) => {
 *   console.log('User logged in:', payload.userId);
 * });
 *
 * hub.emit('userLogin', { userId: 'abc', time: new Date() });
 * off(); // unsubscribe
 * ```
 */

type Listener<T> = (payload: T) => void;

interface EventHub<T extends Record<string, unknown>> {
  /**
   * Register a listener for a specific event type.
   * Returns an unsubscribe function.
   */
  on<K extends keyof T & string>(event: K, listener: Listener<T[K]>): () => void;

  /**
   * Remove a previously registered listener.
   */
  off<K extends keyof T & string>(event: K, listener: Listener<T[K]>): void;

  /**
   * Emit an event to all registered listeners for that type.
   */
  emit<K extends keyof T & string>(event: K, payload: T[K]): void;

  /**
   * Remove all listeners for a specific event type, or all listeners entirely.
   */
  clear<K extends keyof T & string>(event?: K): void;

  /**
   * Return the number of listeners for a given event type, or total count.
   */
  listenerCount<K extends keyof T & string>(event?: K): number;
}

/**
 * Create a typed event hub.
 *
 * Listeners are stored lazily — no arrays are allocated until the first
 * `on()` call for a given event type.
 */
export function createEventHub<T extends Record<string, unknown>>(): EventHub<T> {
  const listeners = new Map<string, Set<Listener<unknown>>>();

  function hubOn<K extends keyof T & string>(event: K, listener: Listener<T[K]>): () => void {
    let set = listeners.get(event);
    if (!set) {
      set = new Set();
      listeners.set(event, set);
    }
    set.add(listener as Listener<unknown>);

    return () => {
      set?.delete(listener as Listener<unknown>);
      if (set?.size === 0) {
        listeners.delete(event);
      }
    };
  }

  function hubOff<K extends keyof T & string>(event: K, listener: Listener<T[K]>): void {
    const set = listeners.get(event);
    set?.delete(listener as Listener<unknown>);
    if (set?.size === 0) {
      listeners.delete(event);
    }
  }

  function hubEmit<K extends keyof T & string>(event: K, payload: T[K]): void {
    const set = listeners.get(event);
    if (set) {
      for (const listener of set) {
        listener(payload);
      }
    }
  }

  function hubClear<K extends keyof T & string>(event?: K): void {
    if (event !== undefined) {
      listeners.delete(event);
    } else {
      listeners.clear();
    }
  }

  function hubListenerCount<K extends keyof T & string>(event?: K): number {
    if (event !== undefined) {
      return listeners.get(event)?.size ?? 0;
    }
    let count = 0;
    for (const set of listeners.values()) {
      count += set.size;
    }
    return count;
  }

  return {
    on: hubOn,
    off: hubOff,
    emit: hubEmit,
    clear: hubClear,
    listenerCount: hubListenerCount,
  };
}
