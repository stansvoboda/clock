# Clock Faces

One time, four ways to show it. A small frontend project built with plain HTML, CSS and JavaScript — no frameworks, no build step.

**Live demo:** https://stansvoboda.github.io/clock/

| Clock   | How it works |
|---------|--------------|
| Digital | Formats hours, minutes and seconds as `HH:MM:SS`. |
| Analog  | Calculates the angle of each hand and passes it to CSS via custom properties. |
| Binary  | Splits each digit into 4 bits and lights up the matching dots. |
| Words   | Rounds to the nearest five minutes, e.g. *"quarter past three"*. |

## Run locally

ES modules need a web server (opening `index.html` directly won't work):

```bash
npm start
# or
python3 -m http.server
```

## Tests

The time logic lives in pure functions, so it can be tested without a browser:

```bash
npm test
```

## Project structure

```
├── index.html
├── css/
│   └── style.css         # layout, light/dark theme, all four clock faces
├── js/
│   ├── main.js           # ticks once per second and updates every clock
│   └── clocks/
│       ├── digital.js
│       ├── analog.js
│       ├── binary.js
│       └── words.js
└── tests/
    └── clocks.test.js    # node:test, no dependencies
```

Each clock module exports a pure function (time → data) and an `update(element, date)` function that renders it.

## What I practised

- Semantic HTML and basic accessibility (`role="img"`, `aria-label`)
- CSS Grid, custom properties, `conic-gradient` + `mask`, dark mode with `prefers-color-scheme`
- JavaScript ES modules and separating logic from rendering
- Unit tests with Node's built-in test runner

## License

[MIT](LICENSE)
