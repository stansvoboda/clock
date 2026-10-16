const pad = (number) => String(number).padStart(2, '0');

export function formatDigital(date) {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

export function updateDigital(element, date) {
  element.textContent = formatDigital(date);
}
