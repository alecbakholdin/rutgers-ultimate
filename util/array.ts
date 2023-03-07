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

export function extractKey<T>(
  array: T[] | undefined | null,
  key: keyof T
): { [id: string]: T } {
  return Object.fromEntries(array?.map((obj) => [obj[key], obj]) ?? []);
}

export function replace<T>(
  arr: T[] | undefined | null,
  obj: T,
  i: number
): T[] {
  if (!arr?.length) return [obj];
  return [...arr.slice(0, i), obj, ...arr.slice(i + 1)];
}

export function update<T>(
  arr: T[] | undefined | null,
  i: number,
  update: Partial<T>
): T[] {
  if (!arr?.length || i >= arr.length) return arr || [];
  return replace(arr, { ...arr[i], ...update }, i);
}

export function remove<T>(arr: T[] | undefined | null, i: number): T[] {
  if (!arr?.length) return [];
  if (arr.length <= i) return arr;
  return [...arr.slice(0, i), ...arr.slice(i + 1)];
}

export function getFromIndex<T>(
  arr: T[] | undefined | null,
  i: number
): T | null {
  if (!arr?.length || arr.length <= i) return null;
  return arr[i];
}

export function count<T>(arr: T[] | undefined | null, fn: (val: T) => any) {
  return arr?.filter(fn).length || 0;
}
