import { useEffect, useRef, useCallback } from 'react';

/**
 * @description Custom hook that debounces a callback function
 * @param {Function} callback - The function to debounce
 * @param {number} delay - The delay in milliseconds before executing the callback
 * @return {Function} Debounced version of the callback function
 */
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  /**
   * @description Ref to store the timeout ID
   */
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * @description Ref to store the latest callback to avoid stale closures
   */
  const callbackRef = useRef<T>(callback);

  /**
   * @description Effect to update callback ref whenever callback changes
   */
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  /**
   * @description Effect to cleanup timeout on unmount
   */
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  /**
   * @description Debounced function that delays execution
   */
  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout
      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    },
    [delay]
  );

  return debouncedCallback;
}
