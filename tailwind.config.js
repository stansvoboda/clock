// Design tokens exported from the Stitch design ("Horologium Editorial Story").
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#9d4300',
        'primary-container': '#f97316',
        'on-primary': '#ffffff',
        'on-primary-container': '#582200',
        surface: '#fdf9f1',
        background: '#fdf9f1',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#f7f3eb',
        'surface-container': '#f1ede6',
        'surface-container-high': '#ece8e0',
        'surface-container-highest': '#e6e2da',
        'on-surface': '#1c1c17',
        'on-surface-variant': '#584237',
        'outline-variant': '#e0c0b1',
      },
      spacing: {
        'space-xs': '0.375rem',
        'space-sm': '0.75rem',
        'space-md': '1.25rem',
        'space-lg': '2rem',
        'space-xl': '3.5rem',
        margin: '4rem',
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'sans-serif'],
        body: ['"Plus Jakarta Sans"', 'sans-serif'],
        label: ['"Space Grotesk"', 'sans-serif'],
      },
      fontSize: {
        'display-hero': ['72px', { lineHeight: '80px', letterSpacing: '-0.03em', fontWeight: '800' }],
        'display-hero-mobile': ['44px', { lineHeight: '48px', letterSpacing: '-0.02em', fontWeight: '800' }],
        'headline-xl': ['48px', { lineHeight: '54px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'headline-xl-mobile': ['32px', { lineHeight: '38px', letterSpacing: '-0.01em', fontWeight: '700' }],
        'headline-md': ['26px', { lineHeight: '32px', fontWeight: '600' }],
        'headline-sm': ['20px', { lineHeight: '26px', fontWeight: '600' }],
        'body-xl': ['20px', { lineHeight: '32px' }],
        'body-md': ['15px', { lineHeight: '24px' }],
        'label-caps': ['13px', { lineHeight: '16px', letterSpacing: '0.08em', fontWeight: '700' }],
        caption: ['13px', { lineHeight: '18px', fontWeight: '500' }],
      },
    },
  },
};
