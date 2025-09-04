import { HASH_COLOR_PALETTE } from "@/constants.ts";

/**
 * Детерминированное получение цвета из палитры по строке.
 */
export function hashToColor(value: string): string {
  let h = 5381;
  for (let i = 0; i < value.length; i++) {
    h = (h * 33) ^ value.charCodeAt(i);
  }
  const idx = Math.abs(h) % HASH_COLOR_PALETTE.length;
  return HASH_COLOR_PALETTE[idx];
}

