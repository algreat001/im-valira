import { constants } from "@/constants";

export function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number = constants.ui.debounceDelay
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}
