import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, TextProps, View, ViewProps } from 'react-native';
import { C, F, cardShell } from './theme';

/* ---- type ---- */
export const Serif = (p: TextProps) => <Text {...p} style={[t.serif, p.style]} />;
export const Sans = (p: TextProps) => <Text {...p} style={[t.sans, p.style]} />;
/** The uppercase micro-label used for agent names and section keys. */
export const Kicker = (p: TextProps) => <Text {...p} style={[t.kicker, p.style]} />;

/* ---- shells ---- */
export const Card = ({ radius = 24, style, ...p }: ViewProps & { radius?: number }) => (
  <View {...p} style={[cardShell(radius), style]} />
);

/** Rounded chip. `tone` picks the design's blue / neutral / green variants. */
export const Pill = ({ text, tone = 'grey', style }:
  { text: string; tone?: 'blue' | 'grey' | 'green'; style?: any }) => (
  <View style={[t.pill, t[tone], style]}>
    <Text style={[t.pillText, tone === 'blue' && t.blueInk, tone === 'green' && t.greenInk]}>{text}</Text>
  </View>
);

/** Label/value line used by the citation and confirmation tables. */
export const KV = ({ k, v }: { k: string; v: string }) => (
  <View style={t.kv}>
    <Text style={t.kvKey}>{k}</Text>
    <Text style={t.kvVal}>{v}</Text>
  </View>
);

export const Button = ({ label, onPress, tone = 'dark', style }:
  { label: string; onPress: () => void; tone?: 'dark' | 'grey'; style?: any }) => (
  <Pressable onPress={onPress} style={[t.btn, tone === 'dark' ? t.btnDark : t.btnGrey, style]}>
    <Text style={[t.btnText, tone === 'dark' ? t.btnTextDark : t.btnTextGrey]}>{label}</Text>
  </Pressable>
);

const t = StyleSheet.create({
  serif: { fontFamily: F.serif, color: C.ink },
  sans: { fontFamily: F.sans, color: C.ink, fontSize: 13 },
  kicker: { fontFamily: F.bold, fontSize: 10, letterSpacing: 0.6, textTransform: 'uppercase', color: C.faint },

  pill: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5, alignSelf: 'flex-start' },
  blue: { backgroundColor: C.chipBlue },
  grey: { backgroundColor: C.chip },
  green: { backgroundColor: C.chipGreen },
  pillText: { fontFamily: F.med, fontSize: 11, color: C.muted },
  blueInk: { color: C.chipBlueInk },
  greenInk: { color: C.chipGreenInk },

  kv: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, paddingVertical: 3.5 },
  kvKey: { fontFamily: F.sans, fontSize: 12.5, color: C.faint },
  kvVal: { fontFamily: F.sans, fontSize: 12.5, color: C.ink, flex: 1, textAlign: 'right' },

  btn: { borderRadius: 999, paddingVertical: 16, alignItems: 'center', justifyContent: 'center' },
  btnDark: { backgroundColor: C.ink2, flex: 1 },
  btnGrey: { backgroundColor: C.chip, paddingHorizontal: 18 },
  btnText: { fontSize: 14.5 },
  btnTextDark: { fontFamily: F.med, color: '#f6f9fc' },
  btnTextGrey: { fontFamily: F.sans, color: C.muted },
});

/** The "this is live" dot. Used by the feed badge, the roster and the traces. */
export function PulseDot({ size, duration = 1600, color = C.green }:
  { size: number; duration?: number; color?: string }) {
  const v = useRef(new Animated.Value(0.3)).current;
  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(v, { toValue: 1, duration: duration / 2, useNativeDriver: true }),
      Animated.timing(v, { toValue: 0.3, duration: duration / 2, useNativeDriver: true }),
    ]));
    loop.start();
    return () => loop.stop();
  }, [v, duration]);
  return (
    <Animated.View
      style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color, opacity: v }}
    />
  );
}
