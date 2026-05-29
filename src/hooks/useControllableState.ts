import { useState, useCallback } from 'react';

/**
 * Options for `useControllableState`.
 *
 * When `value` and `onChange` are both provided, the hook is in **controlled mode**
 * (the parent owns the state). When only `defaultValue` is provided, the hook manages
 * its own internal state (**uncontrolled mode**).
 */
interface UseControllableStateOptions<T> {
  /** Controlled value from the parent */
  value?: T;
  /** Callback fired when the state should change (required when `value` is provided) */
  onChange?: (value: T) => void;
  /** Initial value for uncontrolled mode */
  defaultValue?: T;
}

type SetStateAction<T> = T | ((prev: T) => T);

/**
 * A hook that supports both controlled (`value` + `onChange`) and uncontrolled
 * (`defaultValue`) usage patterns, following the same convention as React's built-in
 * controlled inputs.
 *
 * When a `value` prop is provided, the hook is in controlled mode and
 * delegates to the parent's `onChange`. Otherwise it manages its own internal state.
 *
 * @example
 * // Controlled usage
 * const [value, setValue] = useControllableState({
 *   value: externalValue,
 *   onChange: setExternalValue,
 * })
 *
 * // Uncontrolled usage
 * const [value, setValue] = useControllableState({
 *   defaultValue: 'hello',
 * })
 *
 * // Conditionally controlled (toggle between modes)
 * const [value, setValue] = useControllableState({
 *   value: isControlled ? controlledValue : undefined,
 *   onChange: isControlled ? setControlledValue : undefined,
 *   defaultValue: 'fallback',
 * })
 */
export function useControllableState<T>(
  options: UseControllableStateOptions<T> = {},
): [T, (value: SetStateAction<T>) => void] {
  const { value: controlledValue, onChange, defaultValue } = options;

  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState<T | undefined>(defaultValue);

  const resolvedValue: T = isControlled
    ? (controlledValue as T)
    : (internalValue as T);

  const setValue = useCallback(
    (action: SetStateAction<T>) => {
      if (isControlled) {
        const next = action instanceof Function
          ? action(controlledValue as T)
          : action;
        onChange?.(next);
      } else {
        setInternalValue(prev => {
          const next = action instanceof Function ? action(prev as T) : action;
          return next;
        });
      }
    },
    [isControlled, controlledValue, onChange],
  );

  return [resolvedValue, setValue];
}
