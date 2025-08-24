//@ts-nocheck
export function arrayToHashMap<T = object>(
  arr: Array<T>,
  key: string
): { [key: string]: T } {
  if (arr.length === 0 || !Array.isArray(arr)) return {}

  const returnable: { [key: string]: T } = {}

  for (const item of arr) {
    returnable[(item as any)[key]] = item
  }

  return returnable
}

export * from './token-feat'
