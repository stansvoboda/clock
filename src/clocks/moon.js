const SYNODIC_MONTH = 29.530588853 * 86400000;
const NEW_MOON = Date.UTC(2000, 0, 6, 18, 14);

// Moon phase from 0 (new) through 0.5 (full) back to 1, counted from a known new moon.
export const moonPhase = (date) => ((((date - NEW_MOON) % SYNODIC_MONTH) + SYNODIC_MONTH) % SYNODIC_MONTH) / SYNODIC_MONTH;
