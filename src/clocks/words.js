const HOURS = [
  'twelve', 'one', 'two', 'three', 'four', 'five',
  'six', 'seven', 'eight', 'nine', 'ten', 'eleven',
];

const MINUTES = {
  5: 'five',
  10: 'ten',
  15: 'quarter',
  20: 'twenty',
  25: 'twenty-five',
  30: 'half',
};

// Rounds to the nearest five minutes, like people do when they tell the time.
export function toWords(date) {
  const totalMinutes = Math.round((date.getHours() * 60 + date.getMinutes()) / 5) * 5;
  const hour = Math.floor(totalMinutes / 60);
  const minute = totalMinutes % 60;

  if (minute === 0) return `${HOURS[hour % 12]} o'clock`;
  if (minute <= 30) return `${MINUTES[minute]} past ${HOURS[hour % 12]}`;
  return `${MINUTES[60 - minute]} to ${HOURS[(hour + 1) % 12]}`;
}

export function updateWords(element, date) {
  element.textContent = `It's about ${toWords(date)}.`;
}
