export function isEmptyObject(obj?: any): boolean {
  return !obj || !Object.keys(obj).length;
}
