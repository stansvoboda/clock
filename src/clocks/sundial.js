export const PRAGUE = 50.08; // latitude in degrees

const rad = (deg) => (deg * Math.PI) / 180;

// Hour line of a vertical south-facing sundial, as its slope from the noon line: tan θ = cos φ · tan(15° · h),
// where h counts solar hours from noon. Negative before noon. Multiply by the drop below the style's root
// to get how far left (morning) or right (afternoon) the line runs.
export const hourLineSlope = (solarHour, latitude = PRAGUE) => Math.cos(rad(latitude)) * Math.tan(rad(15 * (solarHour - 12)));

export const hourLineAngle = (solarHour, latitude = PRAGUE) => (Math.atan(hourLineSlope(solarHour, latitude)) * 180) / Math.PI;
