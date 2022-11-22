export function distinctEntries<T>(array?: T[], keyFn?: (val: T) => any): T[] {
  if (!array) {
    return [];
  }
  if (!keyFn) {
    return Array.from(new Set(array));
  }
  return Object.values(
    Object.fromEntries(array.map((item) => [keyFn(item), item]))
  );
}
