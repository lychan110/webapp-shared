import { useRef, useState, useCallback } from 'react';

interface UseFileImportOptions<T> {
  /** File input accept attribute (default: '.json') */
  accept?: string;
  /** Custom parser for file contents (default: JSON.parse) */
  parser?: (text: string) => T;
  /** Called when a file is successfully imported and parsed */
  onSuccess?: (data: T) => void;
  /** Called when parsing fails */
  onError?: (error: Error) => void;
}

interface UseFileImportReturn<T> {
  /** Trigger the file picker dialog */
  openFileDialog: () => void;
  /** The most recently parsed file content, or null */
  fileContent: T | null;
  /** Whether a file is currently being read */
  isLoading: boolean;
  /** Error message, or null */
  error: string | null;
}

/**
 * Hook for importing files via a hidden `<input type="file">` element and FileReader.
 *
 * Automatically creates a hidden file input in the DOM, opens the native file picker
 * when `openFileDialog()` is called, and parses the selected file using the provided
 * parser (JSON.parse by default).
 *
 * @example
 * const { openFileDialog, fileContent, isLoading, error } = useFileImport<MyData>({
 *   accept: '.json',
 *   onSuccess: (data) => console.log('Imported', data),
 * })
 *
 * return (
 *   <button onClick={openFileDialog} disabled={isLoading}>
 *     {isLoading ? 'Reading…' : 'Import'}
 *   </button>
 * )
 */
export function useFileImport<T = unknown>(
  options: UseFileImportOptions<T> = {},
): UseFileImportReturn<T> {
  const { accept = '.json', parser = JSON.parse, onSuccess, onError } = options;

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [fileContent, setFileContent] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openFileDialog = useCallback(() => {
    // Lazily create the hidden input element
    if (!inputRef.current) {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = accept;
      input.style.display = 'none';
      input.addEventListener('change', (e: Event) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;

        setIsLoading(true);
        setError(null);

        const reader = new FileReader();
        reader.onload = () => {
          try {
            const result = parser(reader.result as string) as T;
            setFileContent(result);
            onSuccess?.(result);
          } catch (err) {
            const msg = `Failed to parse file: ${(err as Error).message}`;
            setError(msg);
            onError?.(err as Error);
          } finally {
            setIsLoading(false);
          }
        };
        reader.onerror = () => {
          setError('Failed to read file');
          setIsLoading(false);
        };
        reader.readAsText(file);

        // Reset so the same file can be re-selected
        (e.target as HTMLInputElement).value = '';
      });
      document.body.appendChild(input);
      inputRef.current = input;
    }

    inputRef.current.click();
  }, [accept, parser, onSuccess, onError]);

  return { openFileDialog, fileContent, isLoading, error };
}
