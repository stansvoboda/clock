# Jak lidé měřili čas

A playful scroll story (in Czech) about the history of timekeeping — from a stick's shadow in ancient Egypt to atomic clocks — that ends by teaching you to read an analog clock.

**Live demo:** https://stansvoboda.github.io/clock/

Design brief: [brief.md](brief.md). The visual design was generated with [Google Stitch](https://stitch.withgoogle.com/) and rebuilt in React.

## Chapters

| Section | What it does |
|---------|--------------|
| Hero | Live local time. |
| Slunce a stín | Sundial pinned while the story scrolls; scrolling moves the sun from sunrise to sunset. |
| Voda a písek | Pinned clepsydra drains into the lower bowl as you scroll. |
| Ozubená kola | A falling weight turns two meshing gears. |
| Pražský orloj | Stylised astronomical dial; the apostles appear once when it comes into view. |
| Kyvadlo | The pendulum swings and every half swing ticks the hand. |
| Křemen a elektřina | A digital watch lights up one segment at a time. |
| Atomové hodiny | The atom spins while the caesium number 9 192 631 770 locks in digit by digit. |
| Nauč se číst hodiny | Pinned dial shows each lesson's example as you read it, plus a trainer: drag the minute hand (or use the buttons), check the answer. |
| Jeden čas, čtyři podoby | The same moment as digital, analog, binary and Czech words. |

A progress bar and the chapter name in the header show where you are. Scroll effects use CSS scroll-driven animations and IntersectionObserver (no animation library); with `prefers-reduced-motion` they are switched off and all content stays visible.

## Run locally

```bash
npm install
npm start        # dev server
npm run build    # production build into dist/
```

## Tests

The time logic lives in pure functions in `src/clocks/`, tested with Vitest:

```bash
npm test
```

## Project structure

```
├── index.html
├── brief.md                  # design brief, source for every Stitch prompt
├── src/
│   ├── main.jsx, App.jsx
│   ├── index.css             # Tailwind + chunky outline/shadow styles
│   ├── useNow.js             # ticks at every full second
│   ├── clocks/               # pure time → data functions + tests
│   │   ├── analog.js  binary.js  digital.js  words.js (Czech)  dial.js (dragging)
│   │   └── clocks.test.js
│   └── components/           # one component per section; Chapter.jsx drives the five history chapters
└── .github/workflows/deploy.yml   # test, build, deploy to GitHub Pages
```

## Stack

React 18, Vite, Tailwind CSS 3, Vitest.

## License

[MIT](LICENSE)
