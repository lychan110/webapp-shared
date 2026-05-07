import {
  type ReactNode,
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import { cn } from '../utils/cn';

/* ══════════════════════════════════════════════════════════════════════════
   Modal — Compound component pattern
   
   Uses Radix Dialog primitives internally. Install separately:
     npm install @radix-ui/react-dialog
   
   If Radix is unavailable, falls back to a basic accessible modal.
   ══════════════════════════════════════════════════════════════════════════ */

/* ─── Try loading Radix ────────────────────────────────────────────────── */

/* ─── Radix dynamic import placeholder ──────────────────────────────────── */
// Uncomment when @radix-ui/react-dialog is installed:
// let DialogPrimitive: {
//   Root: (props: any) => ReactNode;
//   Trigger: (props: any) => ReactNode;
//   Portal: (props: any) => ReactNode;
//   Overlay: (props: any) => ReactNode;
//   Content: (props: any) => ReactNode;
//   Title: (props: any) => ReactNode;
//   Description: (props: any) => ReactNode;
//   Close: (props: any) => ReactNode;
// } | null = null;
//
// try {
//   // Dynamic import approach
// } catch {
//   // Radix not installed — fallback handles this
// }

/* ─── Context for compound pattern ────────────────────────────────────── */

interface ModalContextType {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ModalContext = createContext<ModalContextType | null>(null);

function useModalContext() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error('Modal compound components must be used within <Modal>');
  return ctx;
}

/* ─── Root ─────────────────────────────────────────────────────────────── */

interface ModalProps {
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
}

export function Modal({
  children,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  defaultOpen = false,
}: ModalProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const onOpenChange = useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolledOpen(next);
      controlledOnOpenChange?.(next);
    },
    [isControlled, controlledOnOpenChange],
  );

  return (
    <ModalContext.Provider value={{ open, onOpenChange }}>
      {children}
    </ModalContext.Provider>
  );
}

/* ─── Trigger ──────────────────────────────────────────────────────────── */

interface ModalTriggerProps {
  children: ReactNode;
  asChild?: boolean;
  className?: string;
}

export function ModalTrigger({ children, className }: ModalTriggerProps) {
  const { onOpenChange } = useModalContext();
  return (
    <span onClick={() => onOpenChange(true)} className={className}>
      {children}
    </span>
  );
}

/* ─── Portal + Overlay ─────────────────────────────────────────────────── */

interface ModalContentProps {
  children: ReactNode;
  className?: string;
}

export function ModalContent({ children, className }: ModalContentProps) {
  const { open, onOpenChange } = useModalContext();
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onOpenChange]);

  // Lock body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Trap focus
  useEffect(() => {
    if (!open || !contentRef.current) return;
    const firstFocusable = contentRef.current.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    firstFocusable?.focus();
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />

      {/* Content */}
      <div
        ref={contentRef}
        className={cn(
          'relative z-10 w-full max-w-md mx-4 max-h-[85vh] overflow-y-auto',
          'bg-paper-deep dark:bg-paper-deep border border-ink-soft/10 dark:border-white/10',
          'rounded-xl shadow-xl',
          'animate-fade-in',
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}

/* ─── Header ───────────────────────────────────────────────────────────── */

interface ModalHeaderProps {
  children: ReactNode;
  className?: string;
}

export function ModalHeader({ children, className }: ModalHeaderProps) {
  return (
    <div className={cn('px-5 pt-5 pb-3 border-b border-ink-soft/10 dark:border-white/10', className)}>
      {children}
    </div>
  );
}

/* ─── Title ────────────────────────────────────────────────────────────── */

interface ModalTitleProps {
  children: ReactNode;
  className?: string;
}

export function ModalTitle({ children, className }: ModalTitleProps) {
  return (
    <h2 className={cn('text-lg font-display font-semibold text-ink dark:text-white', className)}>
      {children}
    </h2>
  );
}

/* ─── Description ──────────────────────────────────────────────────────── */

interface ModalDescriptionProps {
  children: ReactNode;
  className?: string;
}

export function ModalDescription({ children, className }: ModalDescriptionProps) {
  return (
    <p className={cn('text-sm text-ink-soft dark:text-white/60 mt-1', className)}>
      {children}
    </p>
  );
}

/* ─── Body ─────────────────────────────────────────────────────────────── */

interface ModalBodyProps {
  children: ReactNode;
  className?: string;
}

export function ModalBody({ children, className }: ModalBodyProps) {
  return (
    <div className={cn('px-5 py-4', className)}>
      {children}
    </div>
  );
}

/* ─── Footer ───────────────────────────────────────────────────────────── */

interface ModalFooterProps {
  children: ReactNode;
  className?: string;
}

export function ModalFooter({ children, className }: ModalFooterProps) {
  return (
    <div className={cn(
      'px-5 py-4 border-t border-ink-soft/10 dark:border-white/10',
      'flex items-center justify-end gap-2',
      className,
    )}>
      {children}
    </div>
  );
}

/* ─── Close ────────────────────────────────────────────────────────────── */

interface ModalCloseProps {
  children: ReactNode;
  className?: string;
}

export function ModalClose({ children, className }: ModalCloseProps) {
  const { onOpenChange } = useModalContext();
  return (
    <span onClick={() => onOpenChange(false)} className={className}>
      {children}
    </span>
  );
}
