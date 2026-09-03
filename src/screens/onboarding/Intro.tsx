import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from '../../web/LinearGradient';
import { C, F } from '../../theme';
import { Serif, Sans, Card, Button, PulseDot } from '../../ui';
import { PixelAgent } from '../../icons';
import { AppIcon, Sticker } from '../../art';
import { AGENTS } from '../../data';

/** Wraps children in a slow up/down bob loop, ported from `@keyframes scoutBob`. */
function Bob({ children, duration }: { children: React.ReactNode; duration: number }) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(v, { toValue: -4, duration: duration / 2, useNativeDriver: true }),
        Animated.timing(v, { toValue: 0, duration: duration / 2, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [v, duration]);
  return <Animated.View style={{ transform: [{ translateY: v }] }}>{children}</Animated.View>;
}

const OnboardingTop = ({ label }: { label: string }) => (
  <View style={s.topBar}>
    <Sans style={s.time}>9:41</Sans>
    <Sans style={s.stepCount}>{label}</Sans>
  </View>
);

export function Splash({ onStart, onSkip }: { onStart: () => void; onSkip: () => void }) {
  return (
    <View style={s.root}>
      <OnboardingTop label="Welcome" />
      <View style={s.splashBody}>
        <Bob duration={3400}>
          <AppIcon size={112} radiusRatio={0.26} />
        </Bob>
        <View style={s.splashCopy}>
          <Serif style={s.splashTitle}>Detour</Serif>
          <Sans style={s.splashSub}>
            Ready when you are. I'll wander around in the background and keep an eye out for
            things you might love.
          </Sans>
        </View>
      </View>
      <View style={s.footer}>
        <View style={{ flexDirection: 'row' }}>
          <Button label="Come along" onPress={onStart} />
        </View>
        <Button label="I've been here before" tone="grey" onPress={onSkip} style={{ flex: 1 }} />
      </View>
    </View>
  );
}

type Step = {
  wash: [string, string];
  title: string;
  body: string;
  cta: string;
  art: 'swarm' | 'citation' | 'place';
};

const STEPS: Step[] = [
  {
    wash: ['#eaf6ef', '#eef5fb'],
    title: "I'll keep an eye out all trip",
    body: 'Let us find your next detour!',
    cta: 'Next',
    art: 'swarm',
  },
  {
    wash: ['#e7f1fb', '#f2f8fb'],
    title: 'Look what I found, and where I found it',
    body:
      'Every card carries the source, the moment I spotted it and how sure I am. You can always open the original.',
    cta: 'Next',
    art: 'citation',
  },
  {
    wash: ['#f5f8ec', '#e8f2fb'],
    title: "Now tell me what you'd cross town for",
    body: "Four questions, then I'll keep learning from what you keep and what you wave off.",
    cta: 'Ask away',
    art: 'place',
  },
];

function IntroArt({ kind }: { kind: Step['art'] }) {
  if (kind === 'swarm') {
    return (
      <View style={s.swarmRow}>
        {AGENTS.map((a, i) => (
          <Bob key={a.id} duration={(2.6 + i * 0.35) * 1000}>
            <View style={s.agentHello}>
              <View style={s.helloBubble}><Sans style={s.helloText}>I’m {a.short}!</Sans></View>
              <PixelAgent variant={a.variant} color={a.color} size={i % 2 === 0 ? 62 : 72} />
            </View>
          </Bob>
        ))}
      </View>
    );
  }
  if (kind === 'citation') {
    return (
      <View style={s.citationCol}>
        <View style={s.citationRow}>
          <PixelAgent variant="antenna" color="#e2564a" size={70} />
          <View style={s.citationCard}>
            <View style={[s.citationBar, { width: '100%' }]} />
            <View style={[s.citationBar, { width: '72%' }]} />
            <View style={s.citationSourceRow}>
              <View style={s.citationDot} />
              <Sans style={s.citationSourceText}>cited source</Sans>
            </View>
          </View>
        </View>
        <View style={s.stickerRow}>
          <Sticker kind="mug" size={40} />
          <Sticker kind="book" size={40} />
          <Sticker kind="flower" size={40} />
        </View>
      </View>
    );
  }
  return (
    <View style={s.placeCol}>
      <View style={s.placeRow}>
        <Sticker kind="trees" size={52} />
        <Sticker kind="owl" size={52} />
        <Sticker kind="mushroom" size={52} />
      </View>
      <View style={s.placeRowBottom}>
        <Sticker kind="boots" size={46} />
        <PixelAgent variant="brim" color="#d99a2b" size={66} />
        <Sticker kind="pack" size={46} />
      </View>
    </View>
  );
}

export function IntroPager({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const current = STEPS[step];

  const onPress = () => {
    if (step === STEPS.length - 1) {
      onDone();
    } else {
      setStep(step + 1);
    }
  };

  return (
    <View style={s.root}>
      <OnboardingTop label={`${step + 1} of ${STEPS.length}`} />
      <View style={s.pagerBody}>
        <View style={s.artPanel}>
          <LinearGradient
            colors={current.wash}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <IntroArt kind={current.art} />
        </View>
        <View style={s.pagerCopy}>
          <Serif style={s.pagerTitle}>{current.title}</Serif>
          <Sans style={s.pagerSub}>{current.body}</Sans>
        </View>
      </View>
      <View style={s.pagerFooter}>
        <View style={s.dotsRow}>
          {STEPS.map((_, i) => (
            <View key={i} style={[s.dot, i === step ? s.dotActive : s.dotInactive]} />
          ))}
        </View>
        <View style={{ flexDirection: 'row', alignSelf: 'stretch' }}>
          <Button label={current.cta} onPress={onPress} />
        </View>
      </View>
    </View>
  );
}

const WATCH: Record<string, string> = {
  social: '12 accounts, 4 hashtags',
  resv: '9 waitlists',
  events: '6 listings, 3 mailing lists',
  news: '2 news desks, city notices',
  triage: 'thrills matched to your profile',
};

export function HeadingOut({ onDone }: { onDone: () => void }) {
  return (
    <View style={s.root}>
      <OnboardingTop label="Looking around" />
      <View style={s.headingBody}>
        <View style={s.headingCopy}>
          <Serif style={s.headingTitle}>On it. I'm heading out.</Serif>
          <Sans style={s.headingSub}>
            I'll be looking around Kuala Lumpur every ninety seconds until Sunday. You'll only hear from
            me when I find something worth your evening.
          </Sans>
        </View>
        <Card radius={26} style={s.rosterCard}>
          {AGENTS.map((a) => (
            <View key={a.id} style={s.rosterRow}>
              <PixelAgent variant={a.variant} color={a.color} size={34} />
              <View style={s.rosterInfo}>
                <Text style={s.rosterName}>{a.name}</Text>
                <Sans style={s.rosterWatch}>{WATCH[a.id]}</Sans>
              </View>
              <View style={s.liveRow}>
                <PulseDot size={6} duration={1900} />
                <Sans style={s.liveText}>live</Sans>
              </View>
            </View>
          ))}
        </Card>
      </View>
      <View style={s.footer}>
        <View style={{ flexDirection: 'row' }}>
          <Button label="Take me to my trip" onPress={onDone} />
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  topBar: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 6,
  },
  time: { fontFamily: F.med, fontSize: 12.5, color: C.ink },
  stepCount: { fontFamily: F.med, fontSize: 12.5, color: C.faint },
  footer: { paddingHorizontal: 28, paddingBottom: 34, gap: 10 },

  /* Splash */
  splashBody: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 26,
    paddingHorizontal: 28,
    paddingVertical: 24,
  },
  splashCopy: { gap: 10, alignItems: 'center' },
  splashTitle: { fontSize: 34, lineHeight: 37 },
  splashSub: { fontSize: 14.5, lineHeight: 22, color: C.sub, textAlign: 'center' },

  /* IntroPager */
  pagerBody: { flex: 1, justifyContent: 'center', gap: 28, paddingHorizontal: 28, paddingVertical: 20 },
  artPanel: {
    height: 250,
    borderRadius: 30,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pagerCopy: { gap: 10, alignItems: 'center' },
  pagerTitle: { fontSize: 26, lineHeight: 31, textAlign: 'center' },
  pagerSub: { fontSize: 14, lineHeight: 22, color: C.sub, textAlign: 'center' },
  pagerFooter: { paddingHorizontal: 28, paddingBottom: 34, gap: 18, alignItems: 'center' },
  dotsRow: { flexDirection: 'row', gap: 7 },
  dot: { height: 7, borderRadius: 4 },
  dotActive: { width: 20, backgroundColor: C.ink2 },
  dotInactive: { width: 7, backgroundColor: '#d3dae2' },

  /* swarm art */
  swarmRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 12 },
  agentHello: { alignItems: 'center', gap: 7 },
  helloBubble: { backgroundColor: 'rgba(255,255,255,.92)', borderRadius: 9, paddingHorizontal: 5, paddingVertical: 4 },
  helloText: { fontFamily: F.med, fontSize: 7.5, color: C.body, whiteSpace: 'nowrap' } as any,

  /* citation art */
  citationCol: { gap: 12, alignItems: 'center' },
  citationRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 14 },
  citationCard: {
    width: 150,
    backgroundColor: C.card,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(27,31,36,.07)',
    gap: 6,
  },
  citationBar: { height: 6, borderRadius: 3, backgroundColor: '#dfe5ec' },
  citationSourceRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  citationDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.blue, flexShrink: 0 },
  citationSourceText: { fontSize: 10, color: C.sub },
  stickerRow: { flexDirection: 'row', gap: 10 },

  /* place art */
  placeCol: { alignItems: 'center', gap: 14 },
  placeRow: { flexDirection: 'row', gap: 12 },
  placeRowBottom: { flexDirection: 'row', gap: 12, alignItems: 'flex-end' },

  /* HeadingOut */
  headingBody: { flex: 1, justifyContent: 'center', gap: 26, paddingHorizontal: 28, paddingVertical: 24 },
  headingCopy: { gap: 10 },
  headingTitle: { fontSize: 28, lineHeight: 32 },
  headingSub: { fontSize: 14, lineHeight: 22, color: C.sub },
  rosterCard: { padding: 18, gap: 14 },
  rosterRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  rosterInfo: { flex: 1, gap: 1 },
  rosterName: { fontFamily: F.med, fontSize: 14, color: C.ink },
  rosterWatch: { fontSize: 11.5, color: C.faint },
  liveRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexShrink: 0 },
  liveText: { fontSize: 11, color: C.chipGreenInk },
});
