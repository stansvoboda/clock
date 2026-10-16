import { updateDigital } from './clocks/digital.js';
import { updateAnalog } from './clocks/analog.js';
import { updateBinary } from './clocks/binary.js';
import { updateWords } from './clocks/words.js';

const clocks = [
  [document.getElementById('digital'), updateDigital],
  [document.getElementById('analog'), updateAnalog],
  [document.getElementById('binary'), updateBinary],
  [document.getElementById('words'), updateWords],
];

function tick() {
  const now = new Date();
  for (const [element, update] of clocks) update(element, now);

  // Wait until the next full second, so the display never skips or lags.
  setTimeout(tick, 1000 - now.getMilliseconds());
}

tick();
