import { toWords } from './words.js';

// Quiz times are minutes after 12:00 on a 12-hour dial (0–719).
const toDate = (total) => new Date(2026, 0, 1, Math.floor(total / 60), total % 60);
const numeral = (hour) => hour % 12 || 12;

// Not wrapped at 12, so `label(time + 720)` gives the afternoon reading.
export const label = (total) => `${Math.floor(total / 60) || 12}:${String(total % 60).padStart(2, '0')}`;

// Every other task is said the Czech way ("půl osmé") instead of digitally ("7:30").
export const taskText = (total, inWords) => (inWords ? toWords(toDate(total)) : label(total));

// Where the short hand points, the way a child would see it on the dial.
function hourSpot(total) {
  const hour = Math.floor(total / 60);
  const minutes = total % 60;
  if (minutes === 0) return `na ${numeral(hour)}`;
  if (minutes < 30) return `kousek za ${numeral(hour)}`;
  if (minutes === 30) return `mezi ${numeral(hour)} a ${numeral(hour + 1)}`;
  return `skoro na ${numeral(hour + 1)}`;
}
const minuteSpot = (total) => `na ${Math.round((total % 60) / 5) || 12}`;

// One short, kind hint about the hand that is wrong; with both wrong, start with the long one.
export function diagnose(time, task) {
  const hourOk = Math.floor(time / 60) === Math.floor(task / 60);
  const minuteOk = time % 60 === task % 60;
  if (hourOk && minuteOk) return null;
  if (minuteOk) return `Dlouhá ručička je správně. Krátká ukazuje ${hourSpot(time)}, má ukazovat ${hourSpot(task)}.`;
  if (hourOk) return `Krátká ručička je správně. Dlouhá ukazuje ${minuteSpot(time)}, má ukazovat ${minuteSpot(task)}.`;
  return `Začni dlouhou ručičkou: ukazuje ${minuteSpot(time)}, má ukazovat ${minuteSpot(task)}.`;
}

// Index into the lesson list that explains this task: whole hour, half, quarters, or minutes by fives.
export function lessonFor(task) {
  const minutes = task % 60;
  if (minutes === 0) return 2;
  if (minutes === 30) return 3;
  if (minutes === 15 || minutes === 45) return 4;
  return 5;
}
