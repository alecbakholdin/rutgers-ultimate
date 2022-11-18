export function currencyFormat(num?: number): string | null | undefined {
  if (num === null || num === undefined) {
    return num;
  }
  return "$" + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}
