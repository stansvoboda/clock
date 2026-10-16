import { formatDigital } from './digital.js';

const BITS = [8, 4, 2, 1];

// Each digit of HH:MM:SS becomes one column of 4 bits (top = 8, bottom = 1).
export function toBinaryColumns(date) {
  const digits = formatDigital(date).replaceAll(':', '').split('').map(Number);
  return digits.map((digit) => BITS.map((bit) => (digit & bit) !== 0));
}

export function updateBinary(element, date) {
  if (element.children.length === 0) {
    const dots = Array.from({ length: 6 * BITS.length }, () => document.createElement('span'));
    element.append(...dots);
  }

  toBinaryColumns(date)
    .flat()
    .forEach((isOn, index) => element.children[index].classList.toggle('on', isOn));
}
