/** Tokens lifted from Scout App.dc.html. Single source of truth. */
export const C = {
  ink: '#1b1f24',
  ink2: '#22262b',
  body: '#3d454c',
  muted: '#4a5259',
  sub: '#67707a',
  faint: '#8a9199',
  card: '#ffffff',
  chip: '#f0f4f8',
  chipBlue: '#e8f0f9',
  chipBlueInk: '#2c4c74',
  chipGreen: '#e4f0e5',
  chipGreenInk: '#3d6b41',
  footer: '#f4f8fb',
  phone: '#f4f9fd',
  link: '#2f6bb8',
  blue: '#3d8ee8',
  green: '#4f9c4a',
  hairline: 'rgba(27,31,36,.06)',
  hairlineSoft: 'rgba(27,31,36,.05)',
} as const;

/** Page backdrop: the design's three stacked radial/linear gradients. */
export const BACKDROP = ['#d7e9fb', '#eaf3fb', '#dfeefb'] as const;

export const F = {
  serif: 'Newsreader_400Regular',
  serifMed: 'Newsreader_500Medium',
  sans: 'DMSans_400Regular',
  med: 'DMSans_500Medium',
  bold: 'DMSans_700Bold',
} as const;

/** Shared card shell: white, hairline ring, generous radius. */
export const cardShell = (radius: number) => ({
  backgroundColor: C.card,
  borderRadius: radius,
  borderWidth: 1,
  borderColor: C.hairlineSoft,
});
