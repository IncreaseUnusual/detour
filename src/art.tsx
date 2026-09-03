import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';
import { LinearGradient } from './web/LinearGradient';
import { PixelRows } from './icons';

/* ------------------------------------------------------------------ *
 * Country costumes. Scout changes outfit when you land somewhere new.
 * ------------------------------------------------------------------ */

const PAL: Record<string, string> = {
  k: '#22262b', s: '#e8c9a6', e: '#151821', w: '#ffffff',
  g: '#14161c',               // songkok
  n: '#2f3d63',               // baju navy
  c: '#eddfae', d: '#c9a3c0', // sampin cream + motif
  t: '#c2a373', b: '#6b4a2e', y: '#e2c268', // hat tan, belt, buckle
  j: '#5b7fb0', u: '#93b7d8', l: '#8a5636',  // jeans, denim shirt, boots
};

export const SPRITES: Record<string, string[]> = {
  /** Baju melayu with songkok and sampin. */
  malaysia: [
    '...gggggggg...', '...gggggggg...',
    '....ssssss....', '....sesses....', '....ssssss....',
    '...nnnnnnnn...', '..nnnnnwnnnn..', '..nnnnnwnnnn..', '..nnnnnnnnnn..', '...nnnnnnnn...',
    '...cccccccc...', '...cccccccc...', '....cddcdc....', '...cccccccc...',
    '...nnn..nnn...', '...nnn..nnn...', '..kkkk..kkkk..',
  ],
  /** Cowboy: wide brim, denim shirt, belt, jeans, boots. */
  texas: [
    '....tttttt....', '....tttttt....', '...tttttttt...', '.tttttttttttt.',
    '....ssssss....', '....sesses....', '....ssssss....',
    '...uuuuuuuu...', '..uuuuuwuuuu..', '..uuuuuwuuuu..', '..uuuuuuuuuu..', '...uuuuuuuu...',
    '...bbbbbbbb...', '...bbbyybbb...',
    '...jjjjjjjj...', '...jjj..jjj...', '...jjj..jjj...', '..llll..llll..',
  ],
};

export type Costume = keyof typeof SPRITES;

export const Costumed = ({ kind, size }: { kind: Costume; size: number }) => (
  <PixelRows rows={SPRITES[kind]} palette={PAL} size={size} />
);

/** Hat only, used as the roster row mark. */
export const HatMark = ({ kind, size }: { kind: Costume; size: number }) => (
  <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
    <PixelRows
      rows={SPRITES[kind].slice(0, kind === 'malaysia' ? 2 : 4)}
      palette={PAL}
      size={(size * (kind === 'malaysia' ? 2 : 4)) / 14}
    />
  </View>
);

/* ------------------------------------------------------------------ *
 * App icon: a scout on a dusk ridge. Reads down to the 29px size.
 * ------------------------------------------------------------------ */

export function AppIcon({ size, radiusRatio = 0.24, costume }:
  { size: number; radiusRatio?: number; costume?: Costume }) {
  const figure = costume
    ? <Costumed kind={costume} size={size * 0.5} />
    : <PixelRows
        rows={['....kkkkkk....', '...kkkkkkkk...', '..kkkkkkkkkk..', '..k.kkkkkkk.k.',
               '....ssssss....', '....sesses....', '....ssssss....',
               '...hhhhhhhh...', '..hhhhhhhhhh..', '..hhhhhhhhhh..', '..hhhhhhhhhh..',
               '...hhhhhhhh...', '...hhhhhhhh...',
               '...kkkkkkkk...', '...kkk..kkk...', '...kkk..kkk...', '...kkk..kkk...',
               '..wwww..wwww..']}
        palette={{ k: '#2b303c', s: '#e8c9a6', e: '#151821', w: '#ffffff', h: '#e2564a' }}
        size={size * 0.42}
      />;

  return (
    <View style={[a.icon, { width: size, height: size, borderRadius: size * radiusRatio }]}>
      <LinearGradient
        colors={['#7fb0dd', '#a9cbe8', '#dceaf2']}
        locations={[0, 0.46, 1]}
        start={{ x: 0.1, y: 0 }} end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <Svg viewBox="0 0 100 100" width={size} height={size} style={StyleSheet.absoluteFill}>
        <Path d="M0 78 L26 58 L44 72 L68 48 L100 74 L100 100 L0 100 Z" fill="rgba(96,140,180,.35)" />
        <Path d="M0 90 L30 74 L58 88 L82 72 L100 84 L100 100 L0 100 Z" fill="rgba(70,112,152,.5)" />
      </Svg>
      <View style={[a.figure, { top: size * (costume ? 0.22 : 0.26) }]}>{figure}</View>
    </View>
  );
}

/* ------------------------------------------------------------------ *
 * Flat sticker motifs, in the hand-illustrated palette.
 * ------------------------------------------------------------------ */

const STICKERS: Record<string, React.ReactElement[]> = {
  mushroom: [
    <Path key="1" d="M14 26 Q14 12 32 12 Q50 12 50 26 Q50 30 32 30 Q14 30 14 26 Z" fill="#8a5a3b" />,
    <Path key="2" d="M22 27 Q22 20 32 20 Q42 20 42 27 Z" fill="#a06e49" />,
    <Path key="3" d="M26 29 L26 50 Q32 54 38 50 L38 29 Z" fill="#f0dcae" />,
  ],
  mug: [
    <Rect key="1" x={14} y={20} width={30} height={28} rx={7} fill="#c9d3c4" />,
    <Path key="2" d="M44 27 q10 0 10 7 t-10 7" stroke="#3c4a52" strokeWidth={3.4} fill="none" strokeLinecap="round" />,
    <Rect key="3" x={18} y={24} width={22} height={7} rx={3.5} fill="#7d4a33" />,
    <Path key="4" d="M29 38 l0 6 M26 41 l3-3 3 3" stroke="#4a6b45" strokeWidth={2.2} strokeLinecap="round" fill="none" />,
  ],
  trees: [
    <Path key="1" d="M18 46 L26 20 L34 46 Z" fill="#4a6b45" />,
    <Path key="2" d="M32 48 L41 16 L50 48 Z" fill="#3c5a3a" />,
    <Rect key="3" x={24} y={44} width={4} height={8} fill="#8a5a3b" />,
    <Rect key="4" x={39} y={46} width={4} height={7} fill="#8a5a3b" />,
  ],
  boots: [
    <Path key="1" d="M12 10 L24 10 L24 34 L38 40 Q46 43 46 50 L12 50 Z" fill="#9a5c40" />,
    <Rect key="2" x={10} y={48} width={38} height={6} rx={3} fill="#3c3230" />,
    <Path key="3" d="M15 18 h6 M15 26 h6" stroke="#f0dcae" strokeWidth={2.6} strokeLinecap="round" />,
    <Path key="4" d="M28 38 q6 2 8 6" stroke="#7d4530" strokeWidth={2.4} fill="none" strokeLinecap="round" />,
  ],
  owl: [
    <Ellipse key="1" cx={32} cy={34} rx={15} ry={17} fill="#7d5a3f" />,
    <Path key="2" d="M17 22 L23 14 L27 22 Z M47 22 L41 14 L37 22 Z" fill="#7d5a3f" />,
    <Ellipse key="3" cx={32} cy={38} rx={9} ry={11} fill="#f0dcae" />,
    <Circle key="4" cx={26} cy={29} r={3} fill="#2b241f" />,
    <Circle key="5" cx={38} cy={29} r={3} fill="#2b241f" />,
    <Path key="6" d="M32 32 l-3 4 h6 Z" fill="#c98b3f" />,
  ],
  pack: [
    <Path key="1" d="M26 8 q6 -3 12 0 v8 h-12 Z" fill="none" stroke="#7a6f42" strokeWidth={3} />,
    <Rect key="2" x={12} y={16} width={40} height={40} rx={11} fill="#a89b62" />,
    <Rect key="3" x={12} y={24} width={40} height={8} fill="#6f6537" />,
    <Rect key="4" x={27} y={20} width={10} height={16} rx={4} fill="#c9bd85" />,
    <Rect key="5" x={16} y={38} width={14} height={14} rx={4} fill="#c9bd85" />,
    <Rect key="6" x={34} y={38} width={14} height={14} rx={4} fill="#c9bd85" />,
  ],
  guitar: [
    <Ellipse key="1" cx={30} cy={38} rx={15} ry={14} fill="#b56a45" />,
    <Circle key="2" cx={30} cy={38} r={5} fill="#4a3226" />,
    <Rect key="3" x={36} y={12} width={5} height={22} rx={2} transform="rotate(12 38 23)" fill="#7d4a33" />,
  ],
  book: [
    <Rect key="1" x={15} y={14} width={34} height={36} rx={4} fill="#4a6b45" />,
    <Rect key="2" x={21} y={21} width={22} height={16} rx={2} fill="#f0dcae" />,
    <Path key="3" d="M15 46 h34" stroke="#3a5436" strokeWidth={4} />,
  ],
  disco: [
    <Circle key="1" cx={32} cy={36} r={15} fill="#b9c3cf" />,
    <Path key="2" d="M32 21 v30 M17 36 h30 M22 26 l20 20 M42 26 l-20 20" stroke="#8b98a8" strokeWidth={2} />,
    <Rect key="3" x={30} y={10} width={4} height={10} fill="#6f7780" />,
  ],
  flower: [
    <Circle key="1" cx={32} cy={22} r={6} fill="#d4735f" />,
    <Circle key="2" cx={23} cy={27} r={5} fill="#e0a05f" />,
    <Circle key="3" cx={41} cy={27} r={5} fill="#e0a05f" />,
    <Path key="4" d="M32 30 v22" stroke="#4a6b45" strokeWidth={3} strokeLinecap="round" />,
    <Path key="5" d="M32 40 q-8 -2 -10 -8 M32 46 q8 -2 10 -8" stroke="#4a6b45" strokeWidth={2.6} fill="none" strokeLinecap="round" />,
  ],
  coin: [
    <Circle key="1" cx={32} cy={32} r={16} fill="#e0b45f" />,
    <Circle key="2" cx={32} cy={32} r={11} fill="#f0dcae" />,
    <Path key="3" d="M32 24 v16 M27 28 h8 M27 36 h8" stroke="#a67a2e" strokeWidth={2.4} strokeLinecap="round" />,
  ],
  compass: [
    <Circle key="1" cx={32} cy={32} r={17} fill="#c9d3c4" />,
    <Circle key="2" cx={32} cy={32} r={12} fill="#f4f7fa" />,
    <Path key="3" d="M32 20 L37 32 L32 44 L27 32 Z" fill="#d4735f" />,
  ],
};

export type StickerKind = keyof typeof STICKERS;

export const Sticker = ({ kind, size }: { kind: StickerKind; size: number }) => (
  <Svg viewBox="0 0 64 64" width={size} height={size} style={{ flexShrink: 0, flexGrow: 0 }}>
    {STICKERS[kind] ?? STICKERS.compass}
  </Svg>
);

const a = StyleSheet.create({
  icon: { overflow: 'hidden', position: 'relative', flexShrink: 0 },
  figure: { position: 'absolute', width: '100%', alignItems: 'center' },
});
