// Moves a hand of a 12-hour dial (minutes after 12:00, 0–719) to `angle` degrees.
// The minute hand snaps to 5 minutes; crossing 12 carries the hour forward or back, like turning a real hand.
// The hour hand snaps to whole hours and keeps the minutes.
export function dragTo(total, angle, hand = 'minute') {
  if (hand === 'hour') {
    const minutes = total % 60;
    // The hour hand sits past its numeral by half a degree per minute; subtract that so grabbing it doesn't jump an hour.
    const hour = (((Math.round((angle - minutes / 2) / 30)) % 12) + 12) % 12;
    return hour * 60 + minutes;
  }
  const minute = (Math.round(angle / 30) * 5) % 60;
  const diff = minute - (total % 60);
  const carry = diff < -30 ? 60 : diff > 30 ? -60 : 0;
  return (total + diff + carry + 720) % 720;
}
