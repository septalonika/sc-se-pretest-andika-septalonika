/** 0-indexed column -> spreadsheet-style letters: 0->A, 25->Z, 26->AA, 51->AZ, 52->BA. */
export function toColumnLabel(index: number): string {
  let n = index
  let label = ''

  do {
    label = String.fromCharCode(65 + (n % 26)) + label
    n = Math.floor(n / 26) - 1
  } while (n >= 0)

  return label
}
