import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function pick<K, T>(
  obj: Record<K, T>,
  keys: Array<keyof typeof obj>
): Record<K, T> {
  const tmp: Record<K, T> = Object()

  for (const key of keys) {
    tmp[key] = obj[key]
  }

  return tmp
}

export function omit<K, T>(
  obj: Record<K, T>,
  keys: Array<keyof typeof obj>
): Record<K, T> {
  const tmp: Record<K, T> = Object()

  for (const key of Object.keys(obj)) {
    if (!keys.includes(key)) tmp[key] = obj[key]
  }

  return tmp
}
