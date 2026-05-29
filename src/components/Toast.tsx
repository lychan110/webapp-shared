import {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
  type ReactNode,
} from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils/cn';

/* ─── Variants ────────────────────────────────────────────────────────── */

export const toastVariants = cva(
  'fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl text-sm font-medium shadow-xl border backdrop-blur-sm animate-fade-up max-w-xs',
  {
    variants: {
      variant: {
        success:
          'bg-teal/10 border-teal/20 text-teal',
        error:
          'bg-rust/10 border-rust/20 text-rust',
        info:
          'bg-ink-soft/10 border-ink-soft/20 text-ink-soft',
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  },
);

/* ─── Toast Context ────────────────────────────────────────────────────── */

interface ToastData {
  id: number;
  message: string;
  variant: NonNullable<VariantProps<typeof toastVariants>['variant']>;
}

interface ToastContextValue {
  showToast: (message: string, variant?: ToastData['variant']) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

/* ─── useToast Hook ────────────────────────────────────────────────────── */

/**
 * Access toast notifications from any component within a ToastProvider.
 * Returns ``{ showToast }`` where ``showToast(msg, variant?)`` triggers
 * an auto-dismissing toast.
 */
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return ctx;
}

/* ─── Toast Provider ───────────────────────────────────────────────────── */

let nextId = 0;

/**
 * Provider that manages toast state. Wrap near the root of your app to
 * enable ``useToast()`` anywhere in the tree.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showToast = useCallback(
    (message: string, variant: ToastData['variant'] = 'info') => {
      const id = ++nextId;
      setToasts(prev => [...prev, { id, message, variant }]);
    },
    [],
  );

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container — fixed bottom-right */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map(toast => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onDone={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/* ─── Toast Item (internal) ────────────────────────────────────────────── */

interface ToastItemProps {
  toast: ToastData;
  onDone: () => void;
}

function ToastItem({ toast, onDone }: ToastItemProps) {
  useEffect(() => {
    const timer = setTimeout(onDone, 3000);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div
      className={cn(
        toastVariants({ variant: toast.variant }),
        'pointer-events-auto',
      )}
    >
      {toast.message}
    </div>
  );
}

/* ─── Standalone Toast (renderless usage) ───────────────────────────────── */

export interface ToastProps extends VariantProps<typeof toastVariants> {
  /** Message to display */
  message: string;
  /** Auto-dismiss timeout in ms (default: 3000, 0 = no auto-dismiss) */
  timeout?: number;
  className?: string;
}

/**
 * Toast — a single static notification.
 *
 * For managed toast state, use ``<ToastProvider>`` + ``useToast()`` hook.
 * For one-off usage, render this directly with ``timeout`` for auto-dismiss.
 */
export function Toast({
  message,
  variant,
  timeout = 3000,
  className,
  onAnimationEnd,
  ...props
}: ToastProps & { onAnimationEnd?: () => void }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (timeout > 0) {
      const timer = setTimeout(() => setVisible(false), timeout);
      return () => clearTimeout(timer);
    }
  }, [timeout]);

  if (!visible) return null;

  return (
    <div
      className={cn(toastVariants({ variant }), className)}
      onAnimationEnd={onAnimationEnd}
      {...props}
    >
      {message}
    </div>
  );
}

Toast.displayName = 'Toast';
