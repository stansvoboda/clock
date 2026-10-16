// Moves the minute hand of a 12-hour dial (minutes after 12:00, 0–719) to `angle` degrees,
// snapped to 5 minutes. Crossing 12 carries the hour forward or back, like turning a real hand.
export function dragTo(total, angle) {
  const minute = (Math.round(angle / 30) * 5) % 60;
  const diff = minute - (total % 60);
  const carry = diff < -30 ? 60 : diff > 30 ? -60 : 0;
  return (total + diff + carry + 720) % 720;
}
