// Angles in degrees. Hour and minute hands move smoothly between marks.
export function handAngles(date) {
  const seconds = date.getSeconds();
  const minutes = date.getMinutes() + seconds / 60;
  const hours = (date.getHours() % 12) + minutes / 60;

  return {
    hour: hours * 30,
    minute: minutes * 6,
    second: seconds * 6,
  };
}

export function updateAnalog(element, date) {
  const angles = handAngles(date);
  for (const hand in angles) {
    element.style.setProperty(`--${hand}`, `${angles[hand]}deg`);
  }
}
