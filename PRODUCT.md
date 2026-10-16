# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: children of the whole first stage of Czech primary school (ages 6–11) learning to read an analog clock. Two confirmed situations:

- **Child alone on a tablet:** touch input, short attention span, no adult to explain anything.
- **Parent with child at home:** phone or computer, reading and trying things together.

The younger end (6–8) is learning to read the clock itself; the older end (9–11) is the audience for the history chapters.

Secondary: adults who rely on digital time and never learned analog; portfolio visitors (recruiters, clients, design-curious people).

## Product Purpose

„Jak lidé měřili čas“ is a scroll story through the history of timekeeping — from a stick's shadow to atomic clocks — that ends by teaching the visitor to read an analog clock and lets them practise it.

Success, in priority order:

1. **Teach.** A child who can't read an analog clock can read one by the end, including the Czech way of saying it.
2. **Delight.** Each chapter has one memorable scroll moment; the site feels worth coming back to and sharing.
3. **Show craft.** Clean, tested, accessible, fast React code that works as a portfolio piece.

## Positioning

A clock-reading lesson earned through a story: the child scrolls through how people measured time before they get to the dial, and the lesson is built around Czech time-telling („půl čtvrté“ = half *to* the next hour, „čtvrt na čtyři“, „tři čtvrtě na pět“), which generic English-first clock trainers get wrong.

## Operating Context

- Used at home, self-paced, on tablets (touch) and on phones/computers with a parent.
- No accounts, no classroom management, no saved progress.
- Native page scrolling drives every story moment; the trainer is a hands-on dial (drag, buttons, keyboard).

## Capabilities and Constraints

- **Stack:** React 18, Vite, Tailwind CSS 3, Vitest. Pure time logic lives in `src/clocks/` with tests.
- **Deploy:** Cloudflare Workers serving `dist/` (`wrangler.jsonc`); Cloudflare previews for non-production branches. GitHub Pages is no longer the target (README still mentions it).
- **Content:** Hero with live time; chapters Slunce a stín, Voda a písek, Ozubená kola, Pražský orloj (live), Kyvadlo, Hodiny na moři, Vlaky a časová pásma, Křemen a elektřina, Atomové hodiny; facts and an accuracy chart; „Nauč se číst hodiny“ lesson + trainer/quiz; finale „Jeden čas, čtyři podoby“ (digital, analog, binary, Czech words).
- **Lesson sequence:** hands (short = hours, long = minutes) → whole hours → half (Czech „půl“ to the next hour, called out explicitly) → quarters → minutes by fives → try it yourself with a quiz („Nastav 7:45“) and friendly feedback.
- Scroll effects use CSS scroll-driven animations and IntersectionObserver; a library only if a moment truly needs it. No scroll-jacking.
- Performance: animate only `transform`/`opacity`; 60 fps on a mid-range phone/tablet.
- Mobile-first: phone, tablet, desktop; sticky side-by-side layouts stack on phones.
- Out of scope: English version, CMS, analytics, accounts, sound.
- Historical dates must be fact-checked before publishing.

## Brand Commitments

- Name: **„Jak lidé měřili čas“**.
- All site copy in Czech (`<html lang="cs">`); the words clock speaks Czech. Repo, code, comments and commits stay in English.
- Voice: short sentences, one idea per screen, no technical knowledge assumed; friendly, never condescending.
- The visual direction in `brief.md` (playful & colourful, Stitch-generated) is **not binding**: the look is open to replacement on the `redesign` branch. Content, functions and constraints above stay.

## Evidence on Hand

- Working site and tests in this repo; `brief.md` (original brief), `.stitch/` (Stitch generations of the previous look).
- No user testing, teacher or parent feedback, testimonials or usage data exist. Do not invent any.

## Product Principles

1. **The lesson is the payoff.** Every chapter should leave the child closer to reading the dial; history earns attention, the trainer earns the skill.
2. **Readable by a 6-year-old, interesting to an 11-year-old.** Minimal text where reading is taught; richer facts can sit one layer deeper.
3. **Works without an adult.** Every interaction is self-explanatory on touch, with immediate, kind feedback.
4. **Czech first.** Time is told the Czech way, not translated from English.
5. **Motion explains, never decorates.** Things pour, swing and tick because that is how the clock works.

## Accessibility & Inclusion

- `prefers-reduced-motion`: all content readable with animations off.
- Keyboard and screen-reader accessible; the interactive clock is fully operable without a mouse or drag gesture.
- Large touch targets and legible type for young readers; full Czech diacritics support (ě š č ř ž ý á í é ů ú).
