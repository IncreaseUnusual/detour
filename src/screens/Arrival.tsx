import React, { useEffect, useRef } from 'react';
import { Animated, ScrollView, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { C, F } from '../theme';
import { Serif, Sans, Button } from '../ui';
import { Costumed } from '../art';

export type Place = 'malaysia' | 'texas';

const PLACES: Record<Place, {
  heroWash: [string, string];
  kickerColor: string;
  kicker: string;
  title: string;
  sub: string;
  line: string;
}> = {
  malaysia: {
    heroWash: ['#eef3fb', '#f6f1e2'],
    kickerColor: '#5b6f9c',
    kicker: 'New country',
    title: "You're in Malaysia",
    sub: 'Kuala Lumpur',
    line: '',
  },
  texas: {
    heroWash: ['#f7efe0', '#eef4fb'],
    kickerColor: '#8a6a3c',
    kicker: 'New country',
    title: "You're in Texas",
    sub: 'Austin · GMT-5 · morning one',
    line: 'Found myself a hat. Different city, different things worth crossing town for.',
  },
};

const CTA = 'Choose outfit';

function ScoutBob({ children }: { children: React.ReactNode }) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(v, { toValue: -5, duration: 1800, useNativeDriver: true }),
        Animated.timing(v, { toValue: 0, duration: 1800, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [v]);
  return <Animated.View style={{ transform: [{ translateY: v }] }}>{children}</Animated.View>;
}

export function Arrival({ place, onAccept, onKeep }:
  { place: Place; onAccept: () => void; onKeep: () => void }) {
  const p = PLACES[place];
  return (
    <View style={s.flex}>
      <ScrollView style={s.flex} showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        <View style={s.hero}>
          <LinearGradient
            colors={p.heroWash}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <Sans style={[s.kicker, { color: p.kickerColor }]}>{p.kicker}</Sans>
          <ScoutBob>
            <Costumed kind={place} size={190} />
          </ScoutBob>
          <View style={s.titleWrap}>
            <Serif style={s.title}>{p.title}</Serif>
            <Sans style={s.sub}>{p.sub}</Sans>
          </View>
          {p.line ? <Sans style={s.line}>{p.line}</Sans> : null}
        </View>

      </ScrollView>

      <View style={s.footer}>
        <View style={{ flexDirection: 'row' }}>
          <Button label={CTA} onPress={onAccept} />
        </View>
        <Button label="Keep outfit" tone="grey" onPress={onKeep} style={{ flex: 1 }} />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 22, paddingVertical: 24 },

  hero: {
    borderRadius: 30,
    overflow: 'hidden',
    paddingTop: 22,
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 16,
    alignItems: 'center',
  },
  kicker: { fontFamily: F.bold, fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase' },
  titleWrap: { gap: 6, alignItems: 'center' },
  title: { fontSize: 30, lineHeight: 34 },
  sub: { fontFamily: F.sans, fontSize: 13, color: '#5d6771' },
  line: { fontFamily: F.sans, fontSize: 14, lineHeight: 21, color: C.body, maxWidth: 270, textAlign: 'center' },

  footer: { paddingHorizontal: 22, paddingBottom: 20, gap: 10 },
});
