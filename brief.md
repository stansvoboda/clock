# Brief: Jak lidé měřili čas

Single source of truth for every Stitch prompt and every build decision. If a design or a change contradicts this file, update the file first.

## One-liner

A playful, colourful scroll story through the history of timekeeping — from a stick's shadow to atomic clocks — that ends by teaching the visitor to read a clock, using the four live clock faces this repo already has.

## Goals (in priority order)

1. **Teach.** Someone who can't read an analog clock (a child, or an adult who never learned) can read one by the end.
2. **Delight.** Feels like a playful experiment worth sharing; every chapter has one memorable scroll moment.
3. **Show skill.** Works as a portfolio piece: clean React code with tests, accessible, fast, responsive.

## Audience

- Primary: people learning to read the time — kids with a parent, adults who rely on digital clocks.
- Secondary: recruiters/clients viewing the portfolio, design-curious visitors.
- Assume no technical knowledge. Short sentences, one idea per screen.

## Language

- **All site copy in Czech** (`<html lang="cs">`). The "words" clock must speak Czech too (e.g. „čtvrt na čtyři“, „půl třetí“, „tři čtvrtě na pět“).
- Repo, code, comments, commits and this brief stay in English.

## Visual direction: playful & colourful

- Bold saturated palette, a different accent colour per chapter (era), on a warm light base; dark mode supported.
- Big, friendly, rounded type for headings; highly legible body text. Must support Czech diacritics (ě š č ř ž ý á í é ů ú).
- Chunky geometric illustrations (flat shapes, no photos): sun, sundial, water vessel, hourglass, gears, pendulum, quartz crystal, atom.
- Motion is joyful but purposeful: things bounce, spin, pour and tick, never just float around decoratively.
- Avoid: generic SaaS gradients, glassmorphism, stock-photo look, dense text walls.

## Story structure (chapters)

Each chapter = a pinned illustration + 2–3 short text steps that scroll past it. Dates to be fact-checked before publishing.

| # | Chapter | Scroll moment (idea) |
|---|---------|----------------------|
| 0 | Intro — „Kolik je hodin?“ | Big live digital time; scroll cue. |
| 1 | Slunce a stín (sundials, ancient Egypt) | Sun arcs across the sky as you scroll, the shadow sweeps round. |
| 2 | Voda a písek (clepsydra, hourglass) | Water/sand drains in sync with scroll progress. |
| 3 | Ozubená kola (first mechanical clocks, ~13th–14th c.) | Gears interlock and turn with scroll. |
| 4 | Pražský orloj (1410) | Czech highlight: the astronomical dial, apostles' window opens. |
| 5 | Kyvadlo (Huygens, 1656) | Pendulum swing drives a ticking hand. |
| 6 | Křemen a elektřina (quartz 1927, digital watch 1970s) | Segments of a 7-segment display light up. |
| 7 | Atomové hodiny (1955) | Atom spins; numbers scramble into precision. |
| 8 | **Nauč se číst hodiny** (the payoff) | Interactive lesson, see below. |
| 9 | Jeden čas, čtyři podoby | The four live faces from this repo: digital, analog, binary, words. |

A chapter marker / timeline progress indicator shows where you are in history.

## Learn-to-read-the-clock chapter (most important)

Step by step, each step one scroll beat with a big analog clock:

1. The short hand shows hours, the long hand shows minutes.
2. Whole hours („je tři hodiny“).
3. Half past — Czech says „půl čtvrté“ (half *to* the next hour) — call this out explicitly.
4. Quarters: „čtvrt na čtyři“, „tři čtvrtě na čtyři“.
5. Minutes: counting by fives around the dial.
6. **Try it yourself:** the visitor drags (or uses buttons/keyboard) to set the hands, and the clock says the time in Czech words + digital. A small quiz („Nastav 7:45“) with friendly feedback.

## Constraints

- React (Vite build) with Vitest for tests; built output deployed to GitHub Pages.
- Reuse the pure time functions from `js/clocks/` (analog angles, digital, binary, words) rather than rewriting them; words gets a Czech version. Their existing `node:test` tests move to Vitest.
- Scroll effects: CSS scroll-driven animations + IntersectionObserver first; add a library (e.g. Motion, GSAP) only if a moment really needs it.
- Native scrolling only — no scroll-jacking.
- `prefers-reduced-motion`: all content readable with animations off.
- Keyboard and screen-reader accessible; interactive clock fully operable without a mouse.
- Mobile-first: phone, tablet, desktop. Sticky side-by-side layouts become stacked on phones.
- Performance: animate only `transform`/`opacity`; 60 fps on a mid-range phone.

## Out of scope (for now)

- English version, CMS, analytics, accounts, sound.

## Decisions

- The story **replaces** the current Clock Faces page.
- Site name: **„Jak lidé měřili čas“**.
