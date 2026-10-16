// Index = hour on a 12-hour dial (0 = twelve).
const HOURS = [
  'dvanáct hodin', 'jedna hodina', 'dvě hodiny', 'tři hodiny', 'čtyři hodiny', 'pět hodin',
  'šest hodin', 'sedm hodin', 'osm hodin', 'devět hodin', 'deset hodin', 'jedenáct hodin',
];
// "čtvrt na jednu", "za pět minut dvě"
const NUMBERS = [
  'dvanáct', 'jednu', 'dvě', 'tři', 'čtyři', 'pět', 'šest', 'sedm', 'osm', 'devět', 'deset', 'jedenáct',
];
// "půl třetí", "pět minut po třetí"
const ORDINALS = [
  'dvanácté', 'jedné', 'druhé', 'třetí', 'čtvrté', 'páté',
  'šesté', 'sedmé', 'osmé', 'deváté', 'desáté', 'jedenácté',
];

// Rounds to the nearest five minutes, like people do when they tell the time.
// Czech counts quarters towards the next hour: 3:30 is "půl čtvrté".
export function toWords(date) {
  const totalMinutes = Math.round((date.getHours() * 60 + date.getMinutes()) / 5) * 5;
  const hour = Math.floor(totalMinutes / 60) % 12;
  const next = (hour + 1) % 12;

  switch (totalMinutes % 60) {
    case 0: return HOURS[hour];
    case 5: return `pět minut po ${ORDINALS[hour]}`;
    case 10: return `deset minut po ${ORDINALS[hour]}`;
    case 15: return `čtvrt na ${NUMBERS[next]}`;
    case 20: return `za deset minut půl ${ORDINALS[next]}`;
    case 25: return `za pět minut půl ${ORDINALS[next]}`;
    case 30: return `půl ${ORDINALS[next]}`;
    case 35: return `pět minut po půl ${ORDINALS[next]}`;
    case 40: return `za pět minut tři čtvrtě na ${NUMBERS[next]}`;
    case 45: return `tři čtvrtě na ${NUMBERS[next]}`;
    case 50: return `za deset minut ${NUMBERS[next].replace('jednu', 'jedna')}`;
    default: return `za pět minut ${NUMBERS[next].replace('jednu', 'jedna')}`;
  }
}
