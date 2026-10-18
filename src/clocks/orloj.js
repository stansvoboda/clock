import { PRAGUE } from './sundial.js';

const RAD = Math.PI / 180;
const TILT = 23.44 * RAD; // Earth's axial tilt, the angle between the equator and the ecliptic
export const EQUATOR = 66; // radius of the celestial equator on the dial

// Distance from the dial centre of a given declination (degrees).
const fromCentre = (declination) => EQUATOR * Math.tan(Math.PI / 4 - (declination * RAD) / 2);

// The sun's ecliptic longitude in degrees, 0 at the March equinox (low-precision formula, good to ~0.01°).
export function sunLongitude(date) {
  const d = (date - Date.UTC(2000, 0, 1, 12)) / 864e5;
  const g = (357.528 + 0.9856003 * d) * RAD;
  return (((280.46 + 0.9856474 * d + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g)) % 360) + 360) % 360;
}

// Where a point of the ecliptic sits on the orloj dial, which is a stereographic projection from the south pole:
// `ring` is how far the zodiac ring has turned; returns the angle clockwise from the top and the distance from the centre.
export function onDial(longitude, ring) {
  const l = longitude * RAD;
  const ascension = Math.atan2(Math.cos(TILT) * Math.sin(l), Math.cos(l)) / RAD;
  const declination = Math.asin(Math.sin(TILT) * Math.sin(l));
  return { angle: ring - ascension, r: fromCentre(declination / RAD) };
}

// Prague's circle of equal altitude on the dial (0° is the horizon, −18° the end of twilight): the projection keeps
// circles round, so it is found from its southern point (top) and northern point (bottom). Returns how far below
// the centre its own centre lies, and its radius.
export function altitudeCircle(altitude) {
  const south = fromCentre(altitude - (90 - PRAGUE));
  const north = fromCentre(90 - PRAGUE + altitude);
  return { dy: (north - south) / 2, r: (north + south) / 2 };
}

// How far past noon (degrees, 15° an hour) the sun sets in Prague when it stands at this ecliptic longitude.
export function sunsetAngle(longitude) {
  const declination = Math.asin(Math.sin(TILT) * Math.sin(longitude * RAD));
  return Math.acos(-Math.tan(PRAGUE * RAD) * Math.tan(declination)) / RAD;
}
