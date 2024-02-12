export function mapObjectValues<T extends object, K>(
  object: T,
  callback: (value: T[keyof T]) => K,
): Record<keyof T, K> {
  return Object.entries(object).reduce(
    (prev, [key, value]) => ({
      ...prev,
      [key]: callback(value),
    }),
    object as Record<keyof T, K>,
  );
}
