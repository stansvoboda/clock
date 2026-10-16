import { formatDigital } from './digital.js';

const BITS = [8, 4, 2, 1];

// Each digit of HH:MM:SS becomes one column of 4 bits (top = 8, bottom = 1).
export function toBinaryColumns(date) {
  const digits = formatDigital(date).replaceAll(':', '').split('').map(Number);
  return digits.map((digit) => BITS.map((bit) => (digit & bit) !== 0));
}
