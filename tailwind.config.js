// Laterna magika stage: projection-white screens and ink surtitles on a cyclorama lit per scene (--cyc).
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#221F2B',
        screen: '#FBFAF5',
        actor: '#D2381F', // the performer dial's red, and the primary action
        film: '#2D5BD2', // projected blue: the minute hand, the round screen
        cyc: 'var(--cyc)',
        floor: 'var(--floor)',
      },
      fontFamily: {
        display: ['"Anybody Variable"', 'sans-serif'],
        body: ['"Atkinson Hyperlegible Next Variable"', 'sans-serif'],
      },
      maxWidth: { stage: '1380px' },
    },
  },
};
