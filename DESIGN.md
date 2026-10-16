---
name: Jak lidé měřili čas
description: A Laterna magika stage for the history of timekeeping, ending with a red performer dial the child sets by hand.
colors:
  ink: "#221F2B"
  screen: "#FBFAF5"
  actor: "#D2381F"
  actor-deep: "#A52A15"
  film: "#2D5BD2"
  film-deep: "#1F3F99"
  cyc-saffron: "#F4B23E"
  cyc-sun: "#F7D154"
  cyc-water: "#86CFE0"
  cyc-copper: "#F0935A"
  cyc-sky: "#79A6E6"
  cyc-rose: "#F29AAA"
  cyc-sea: "#5CC9B0"
  cyc-lime: "#BEDB63"
  cyc-lilac: "#BFA6EE"
  cyc-green: "#92DB97"
typography:
  display:
    fontFamily: "\"Anybody Variable\", sans-serif"
    fontSize: "clamp(3.5rem, 11vw, 6rem)"
    fontWeight: 800
    lineHeight: 0.92
    letterSpacing: "-0.01em"
    fontVariation: "'wdth' 62"
  headline:
    fontFamily: "\"Anybody Variable\", sans-serif"
    fontSize: "1.75rem"
    fontWeight: 800
    lineHeight: 1.25
  title:
    fontFamily: "\"Anybody Variable\", sans-serif"
    fontSize: "clamp(1.25rem, 3vw, 2.25rem)"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.02em"
    fontVariation: "'wdth' 140"
  body:
    fontFamily: "\"Atkinson Hyperlegible Next Variable\", sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.625
  body-lead:
    fontFamily: "\"Atkinson Hyperlegible Next Variable\", sans-serif"
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "\"Anybody Variable\", sans-serif"
    fontSize: "0.875rem"
    fontWeight: 700
    letterSpacing: "0.025em"
    fontVariation: "'wdth' 112"
  cue-year:
    fontFamily: "\"Anybody Variable\", sans-serif"
    fontSize: "0.8rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.02em"
    fontVariation: "'wdth' 140"
rounded:
  none: "0px"
  full: "9999px"
spacing:
  gutter-sm: "16px"
  gutter-md: "32px"
  screen-pad: "24px"
  screen-pad-lg: "56px"
  scene: "96px"
components:
  cue:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.screen}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "8px 16px"
    height: "44px"
  cue-actor:
    backgroundColor: "{colors.actor}"
    textColor: "#FFFFFF"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "8px 16px"
    height: "44px"
  cue-light:
    backgroundColor: "{colors.screen}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "8px 16px"
    height: "44px"
  screen:
    backgroundColor: "{colors.screen}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "24px"
  screen-film:
    backgroundColor: "{colors.film}"
    textColor: "{colors.screen}"
    rounded: "{rounded.none}"
    padding: "24px"
  surtitle:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.screen}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "8px 16px"
  batten:
    backgroundColor: "{colors.screen}"
    textColor: "{colors.ink}"
    height: "64px"
---

# Design System: Jak lidé měřili čas

## Overview

**Creative North Star: "The Laterna Magika Stage"**

The whole site is one continuous daylit theatre stage in the manner of the Expo 58 Czech multimedia show. A single cyclorama colour fills the viewport and cross-fades as each scene crosses the middle of the screen; on it hang sharp projection-white screens on thin ink cables, carrying the text and the "film" (the scroll-driven illustrations). Captions and readouts arrive as ink surtitle strips. One performer, a red-bezelled analog dial, appears in the hero, in miniature in the header batten, and steps forward in the lesson to be set by hand.

Density is low and scene-paced: one idea per scene, at most three screens in view, generous vertical air between scenes. Depth is staged, never rendered: flat colour panels overlap and cast a soft light from the front. The look is warm and theatrical, not technical: daylight, paper-white, ink, two performer colours.

The world explicitly rejects the dark hacker console, kitsch retro (VHS, scanlines, glitch), cold technical dashboards, stacked themed cards on a cream page, and the space-age Googie kids' page.

**Key Characteristics:**
- One drenched cyclorama colour per scene (`--cyc`), cross-faded over 1.1s; no seams between scenes.
- Sharp-cornered projection screens hung on two 1.5px ink cables, flown in on scroll.
- Ink surtitle strips for every caption, readout and status line.
- A red performer dial (red hour hand, film-blue minute hand) as the recurring protagonist.
- Anybody in two voices (condensed caps, expanded years) over Atkinson Hyperlegible Next.

## Colors

A theatre palette: one changing light, one paper, one ink, and the performer's red and blue.

### Primary
- **Performer Red** (actor): the dial bezel and hour hand, the primary action ("Vyzkoušet hodiny", "Zkontrolovat"), the active cue, the scroll-progress bar, the task chip. Carries white text.
- **Deep Performer Red** (actor-deep): the hour-hand colour when it must be read as text on a light cyclorama (lesson headings naming the hour hand).

### Secondary
- **Film Blue** (film): the minute hand, the round projection screen in the hero, the "Věděl jsi?" side-note screens, lit dots in the binary clock, water in illustrations.
- **Deep Film Blue** (film-deep): the minute-hand colour as text on a light cyclorama.

### Tertiary: the cyclorama lights
Scene lights in story order, applied only through `--cyc` on the body: **Saffron** (cyc-saffron; hero and lesson), **Sun Yellow** (cyc-sun; sun scene and finale), **Water Cyan** (cyc-water), **Copper** (cyc-copper; gears), **Sky Blue** (cyc-sky; orloj), **Rose** (cyc-rose; pendulum), **Sea Teal** (cyc-sea; chronometer), **Lime** (cyc-lime; time zones), **Lilac** (cyc-lilac; quartz), **Green** (cyc-green; atom). Each chapter's light also tints its bar in the accuracy chart. The stage floor is the current light mixed 32% toward a burnt umber (`color-mix(in oklab, var(--cyc), #7A3510 32%)`).

### Neutral
- **Stage Ink** (ink): all body text, cables, surtitle strips, the footer apron, rules under titles, focus rings, selection, dial ticks and second hand.
- **Projection White** (screen): screens, the header batten, the dial face, light cues, text on ink.

### Named Rules
**The One Light Rule.** The viewport carries exactly one cyclorama colour at a time, set on the body via `--cyc`; sections never paint their own background. A new scene changes the light, not the panel.

**The Deep Text Rule.** Performer red and film blue are surfaces and hands. When they become text on the cyclorama, use actor-deep or film-deep, and only at 24px bold or larger.

## Typography

**Display Font:** Anybody (variable width 50–150, weight 300–900), sans-serif fallback
**Body Font:** Atkinson Hyperlegible Next (400, 700, italic 400), sans-serif fallback

**Character:** One variable face plays two theatrical voices, a condensed poster caps for titles and an expanded, wide stance for years, clocks and cues, while Atkinson carries reading for 6-year-olds with unambiguous letterforms and full Czech diacritics.

### Hierarchy
- **Display** (Anybody 800, width 62%, uppercase, clamp 3.5rem to 6rem, line-height 0.92): scene titles, the hero question, the "Zkus to sám!" trainer title, the closing line, the site name in header (1.6rem) and footer.
- **Headline** (Anybody 800, normal width, 1.75rem, tight): step headings in chapters and lessons, screen titles ("Jak hodiny zpřesňovaly", 1.875rem), readout values.
- **Title / Year** (Anybody 600, width 140%, +0.02em): the year beside each scene title, digital time readouts (up to ~4.25rem, tabular numerals), cue-list years in the header (0.8rem).
- **Body** (Atkinson 400, 1.0625rem, 1.625): all reading text. Step text at 1.125rem; scene leads at 1.25rem (body-lead), held to 36–60ch.
- **Label** (Anybody 700, width 112%, 0.875rem, uppercase, wide tracking): cue buttons only. Bold Atkinson at 0.875rem labels the rest (captions, chapter subtitle line, legends).

### Named Rules
**The Two Voices Rule.** Words that name a scene are condensed caps; numbers that place it in time are expanded. Do not swap them, and do not set reading text in Anybody.

## Layout

A centred stage of max 1380px with 16px gutters (32px from md). Desktop scenes use a 12-column grid: a 5-column text column of steps beside a 7-column screen that sticks at top 112px while its film plays; alternate scenes flip sides. Below lg everything stacks, screen after text. Scenes are separated by 96px vertical padding and anchored with a 64px scroll margin for the sticky batten. Screens hang with a cable gap above them (`--cable`, 2.5–5rem), so vertical spacing above a screen is the cable itself. The hero fills the viewport minus the batten and ends on a darker stage floor band (112px desktop, 160px mobile) holding the start cue. Screen padding scales 24px, 40px, 56px with breakpoints. The finale breaks the grid on purpose: four screens of different shapes at staggered heights.

## Elevation & Depth

Depth is theatrical: flat panels overlapping on a lit stage, each casting one soft shadow downward as if lit from the front. No gradients, no borders-as-depth, no tonal layering.

### Shadow Vocabulary
- **Stage light** (`box-shadow: 0 28px 44px -24px rgb(34 31 43 / 0.45), 0 2px 4px rgb(34 31 43 / 0.08)`): every projection screen.
- **Round screen** (`box-shadow: 0 28px 44px -24px rgb(34 31 43 / 0.6)`): the hero's round film screen.
- **Performer** (`filter: drop-shadow(0 24px 24px rgb(34 31 43 / 0.35))`, 28px in the lesson): every dial, so the circle casts its own shape.
- **Cue lift** (`box-shadow: 0 10px 18px -10px rgb(34 31 43 / 0.55)`): cue hover only.

### Named Rules
**The Front Light Rule.** Shadows are soft, fall downward and are tinted with ink; they say "lit from the front of the stage". Hard offset shadows never appear.

## Shapes

Two shapes only: the sharp rectangle and the circle. Screens, cues, surtitles and the batten have zero radius. Circles are reserved for things the dial governs: the performer, the round film screen, binary dots, the orloj face. Ink appears as line only where it is physical: 1.5px cables up to the flies, 2px rules under scene titles and above control groups, the 2px batten edge. The performer's stand (a 12px ink post on a 96px foot) rests on the floor.

**The Dial Ring Rule.** Round forms belong to the clock. If a new element is circular, it must be a dial, a projected face or a dial-governed indicator.

## Components

### Buttons (cues)
Lit ink panels a stage manager would call: compact, uppercase, immediate.
- **Shape:** sharp (0px), min height 44px, 8px 16px padding, icon gap 8px.
- **Ink cue (default):** ink background, white text; used for hand adjustments and secondary controls (often sentence case via `normal-case`).
- **Actor cue:** performer red with white text; the primary action of a screen and the selected option (`cue-on`).
- **Light cue:** projection white with ink text; on the stage floor and on the ink footer.
- **Hover / Active / Focus:** lifts 2px with the cue-lift shadow (0.25s ease-out), presses 1px down with no shadow; focus is a 3px ink outline offset 3px. Disabled is 55% opacity, no motion.
- **Icons:** 2px-stroke line icons on a 24px grid, 16px inside cues, inherit text colour.

### Projection screens (cards)
- **Corner Style:** sharp (0px).
- **Background:** projection white with ink text; the film variant is film blue with white text, used for "Věděl jsi?" facts.
- **Shadow Strategy:** stage light (see Elevation).
- **Hanging:** two 1.5px ink cables at 12% from each edge, length set per screen via `--cable`.
- **Entry:** flown in on scroll (drop 64px with a slight tilt, overshoot 6px, settle) via a view timeline; static where unsupported or reduced motion is on.
- **Internal Padding:** 16–24px around film, 24–56px around text.

### Surtitles
Ink strips with white bold Atkinson, 8px 16px: the hero's opening strip, the day label on the sun simulator, readouts under the lesson dial (small 80%-opacity caption above a headline value), the finale's spoken-time strip in condensed caps.

### Navigation (the batten)
Sticky 64px projection-white bar with a 2px ink bottom edge. Left: mini performer dial (40px, live) and site name in display caps. Centre (xl+): a cue list of scenes, each an expanded year over a small name, separated by 15% ink hairlines; hover lights it with the current cyclorama; the active scene is an ink cell with white text. Below xl the active scene name shows in expanded caps. Right: actor cue to the lesson. A 3px performer-red scroll progress bar runs along the bottom edge.

### The Performer (signature)
A 300-unit SVG dial: performer-red bezel carrying white minute numerals 00–55 in expanded Anybody, white face with ink ticks (heavy at fives), condensed ink hour numerals, red 12-wide hour hand, film-blue 6-wide minute hand, thin ink second hand, ink and white hub. In the lesson it is draggable and keyboard-operable; hands spring onto the new time (`cubic-bezier(0.34, 1.56, 0.64, 1)`, 0.45s) and take the short way round.

## Do's and Don'ts

### Do:
- **Do** change the scene by changing `--cyc` (see the One Light Rule), and give each new scene its own light from the cyclorama set.
- **Do** put text on a hanging projection screen or an ink surtitle, never loose on a busy illustration.
- **Do** use performer red for the hour hand and the one primary action per screen, and film blue for minutes and side notes.
- **Do** set scene titles in condensed caps with the year in the expanded voice, separated from the content by a 2px ink rule.
- **Do** keep every interactive target at least 44px high and focusable with the 3px ink outline.
- **Do** animate only transform and opacity, with ease-out `cubic-bezier(0.16, 1, 0.3, 1)` for stage moves and the spring curve for hands.

### Don't:
- **Don't** round the corners of screens, cues or strips; the only curves are dial-governed circles.
- **Don't** use gradients, decorative outlines or hard offset shadows; depth comes from overlap and the soft front light.
- **Don't** paint a section's own background colour over the cyclorama.
- **Don't** set actor or film as small text on the cyclorama; use the deep variants at 24px bold or larger.
- **Don't** drift into the dark hacker console, VHS/scanline/glitch retro, or space-age Googie looks.
