export function isEmptyObject(obj?: any): boolean {
  return !obj || !Object.keys(obj).length;
}

export function objsEqual(a: any, b: any): boolean {
  if (a === b) return true;
  if (!b || !a) return false;

  if (
    Object.keys(a).find((key) => b[key] !== a[key]) ||
    Object.keys(b).find((key) => a[key] !== b[key])
  )
    return false;

  return true;
}
