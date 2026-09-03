import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';

/**
 * The pixel characters: a beanie-and-hoodie figure per agent, hood in the
 * agent's color. Ported from the design's icon(): run-length encoded rows.
 */
const BODY = [
  '....ssssss....', '....sesses....', '....ssssss....',
  '...hhhhhhhh...', '..hhhhhhhhhh..', '..hhhhhhhhhh..', '..hhhhhhhhhh..',
  '...hhhhhhhh...', '...hhhhhhhh...',
  '...kkkkkkkk...', '...kkk..kkk...', '...kkk..kkk...', '...kkk..kkk...',
  '..wwww..wwww..',
];

const TOPS: Record<string, string[]> = {
  strips:  ['......kk......', '.....kkkk.....', '....kkkkkk....', '...kkkkkkkk...'],
  ears:    ['......pp......', '.....kkkk.....', '....kkkkkk....', '...kkkkkkkk...'],
  antenna: ['....kkkkkk....', '...kkkkkkkk...', '...kkkkkkkk...', '...kkkkkkkkkk'],
  brim:    ['....kkkkkk....', '...kkkkkkkk...', '..kkkkkkkkkk..', '..k.kkkkkkk.k.'],
  spine:   ['....kkkkkk....', '....kkkkkk....', '...kkkkkkkk...', '.kkkkkkkkkkkk.'],
};

export type Variant = keyof typeof TOPS;

/** Icons keep their intrinsic size next to flexible text. */
const NO_SHRINK = { flexShrink: 0, flexGrow: 0 } as const;

/**
 * Renders run-length encoded sprite rows. Shared by the agent figures and the
 * country costumes, which differ only in their rows and palette.
 */
export function PixelRows({ rows, palette, size }:
  { rows: string[]; palette: Record<string, string>; size: number }) {
  const cells: React.ReactElement[] = [];
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const c = row[x];
      if (c === '.') { x++; continue; }
      let n = 1;
      while (row[x + n] === c) n++;
      cells.push(<Rect key={`${y}-${x}`} x={x} y={y - 0.06} width={n} height={1.12} fill={palette[c]} />);
      x += n;
    }
  });
  return (
    <Svg
      viewBox={`0 0 14 ${rows.length}`}
      height={size}
      width={(size * 14) / rows.length}
      style={NO_SHRINK}
    >
      {cells}
    </Svg>
  );
}

export function PixelAgent({ variant, color, size }: { variant: Variant; color: string; size: number }) {
  return (
    <PixelRows
      rows={(TOPS[variant] ?? TOPS.strips).concat(BODY)}
      palette={{ k: '#2b303c', s: '#e8c9a6', e: '#151821', w: '#ffffff', h: color, p: '#cfd8e6' }}
      size={size}
    />
  );
}

/** Phosphor-style glyph: one path on the 256 grid. */
export const Icon = ({ d, size = 20, color = 'currentColor', opacity = 1 }:
  { d: string; size?: number; color?: string; opacity?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 256 256" opacity={opacity} style={NO_SHRINK}>
    <Path d={d} fill={color} />
  </Svg>
);

/** Glyph paths used across the app, named by what they mean here. */
export const P = {
  chat: 'M128 24a104 104 0 0 0-91 153.6L25 213.1a16 16 0 0 0 19.9 20l35.5-11.9A104 104 0 1 0 128 24Zm-24 96a12 12 0 1 1 12-12 12 12 0 0 1-12 12Zm48 0a12 12 0 1 1 12-12 12 12 0 0 1-12 12Z',
  clock: 'M128 24a104 104 0 1 0 104 104A104.1 104.1 0 0 0 128 24Zm0 192a88 88 0 1 1 88-88 88.1 88.1 0 0 1-88 88Zm12-88.7V80a12 12 0 0 0-24 0v54a12 12 0 0 0 6 10.4l40 23.1a12 12 0 1 0 12-20.8Z',
  back: 'M224 128a8 8 0 0 1-8 8H59.3l58.4 58.3a8 8 0 0 1-11.4 11.4l-72-72a8 8 0 0 1 0-11.4l72-72a8 8 0 0 1 11.4 11.4L59.3 120H216a8 8 0 0 1 8 8Z',
  copy: 'M208 32H80a24 24 0 0 0-24 24v8h-8a24 24 0 0 0-24 24v112a24 24 0 0 0 24 24h112a24 24 0 0 0 24-24v-8h8a24 24 0 0 0 24-24V56a24 24 0 0 0-24-24Zm-40 168a8 8 0 0 1-8 8H48a8 8 0 0 1-8-8V88a8 8 0 0 1 8-8h112a8 8 0 0 1 8 8Zm48-32a8 8 0 0 1-8 8h-8V88a24 24 0 0 0-24-24H72v-8a8 8 0 0 1 8-8h128a8 8 0 0 1 8 8Z',
  check: 'm229.7 90.3-128 128a8 8 0 0 1-11.4 0l-56-56a8 8 0 0 1 11.4-11.3L96 201.4 218.3 79a8 8 0 0 1 11.4 11.3Z',
  home: 'M240 115.8V208a16 16 0 0 1-16 16h-56a8 8 0 0 1-8-8v-56a8 8 0 0 0-8-8h-48a8 8 0 0 0-8 8v56a8 8 0 0 1-8 8H32a16 16 0 0 1-16-16v-92.2a16 16 0 0 1 5.2-11.8l96-87.3a16 16 0 0 1 21.6 0l96 87.3a16 16 0 0 1 5.2 11.8Z',
  compass: 'M128 24a104 104 0 1 0 104 104A104.1 104.1 0 0 0 128 24Zm45 76.2-24.5 57.2a8 8 0 0 1-4.2 4.2l-57.2 24.5a8 8 0 0 1-10.5-10.5l24.5-57.2a8 8 0 0 1 4.2-4.2l57.2-24.5A8 8 0 0 1 173 100.2Z',
  van: 'M240 112h-9.4l-27.1-47.4A16 16 0 0 0 189.6 56H66.4a16 16 0 0 0-13.9 8.6L25.4 112H16a8 8 0 0 0 0 16h8v56a16 16 0 0 0 16 16h16a16 16 0 0 0 16-16v-8h112v8a16 16 0 0 0 16 16h16a16 16 0 0 0 16-16v-56h8a8 8 0 0 0 0-16ZM66.4 72h123.2l22.9 40H43.5ZM76 160a12 12 0 1 1 12-12 12 12 0 0 1-12 12Zm104 0a12 12 0 1 1 12-12 12 12 0 0 1-12 12Z',
  user: 'M128 24a104 104 0 1 0 104 104A104.1 104.1 0 0 0 128 24Zm0 40a36 36 0 1 1-36 36 36 36 0 0 1 36-36Zm0 152a88 88 0 0 1-61-24.6 72 72 0 0 1 122 0A88 88 0 0 1 128 216Z',
} as const;
