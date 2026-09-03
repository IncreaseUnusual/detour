import React from 'react';
import { Image, Linking, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Serif, Sans, Kicker, Card, Pill, KV, Button } from '../ui';
import { Icon, P, PixelAgent } from '../icons';
import { BY_ID, Card as CardType, cardImage } from '../data';
import { C, F } from '../theme';

export function Detail({ card, countdown, onBack, onConfirm, onDismiss, onSeeWorkflow }: {
  card: CardType;
  countdown: string;
  onBack: () => void;
  onConfirm: () => void;
  onDismiss: () => void;
  onSeeWorkflow: () => void;
}) {
  const agent = BY_ID[card.agentId];

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={s.hero}>
          <Image source={cardImage(card)} style={s.heroImage} resizeMode="contain" />
          <Pressable onPress={onBack} style={s.backBtn}>
            <Icon d={P.back} size={16} color={C.ink} />
          </Pressable>
        </View>

        <View style={s.body}>
          <View style={s.heading}>
            <View style={s.agentRow}>
              <PixelAgent variant={agent.variant} color={agent.color} size={28} />
              <Kicker style={{ fontSize: 10.5 }}>{agent.name}</Kicker>
            </View>
            <Serif style={s.title}>{card.title}</Serif>
            <Sans style={s.blurb}>{card.blurb}</Sans>
          </View>

          <View style={s.chips}>
            <Pill tone="blue" text={`${card.match}% match`} style={s.pillBig} />
            <Pill text={card.price} style={s.pillBig} />
            <Pill text={card.when} style={s.pillBig} />
          </View>

          <View style={s.reasonsBlock}>
            <Sans style={s.reasonsLabel}>Why Detour picked it</Sans>
            {card.reasons.map((reason, i) => (
              <View key={i} style={s.reasonRow}>
                <View style={s.dash} />
                <Sans style={s.reasonText}>{reason}</Sans>
              </View>
            ))}
          </View>

          <Card radius={24} style={s.citation}>
            <View style={s.citationHeader}>
              <Icon d={P.copy} size={13} color={C.blue} />
              <Sans style={s.citationLabel}>Citation</Sans>
            </View>
            <View style={s.kvList}>
              <KV k="Source" v={card.source} />
              <KV k="Captured" v={card.captured} />
              <KV k="Extraction confidence" v={card.confidence} />
              <KV k="Pipeline" v={card.pipeline} />
            </View>
            <Pressable onPress={() => { void Linking.openURL(card.sourceUrl); }}>
              <Sans style={s.link}>Open original source</Sans>
            </Pressable>
          </Card>

          <Card radius={24} style={s.workflow}>
            <Sans style={s.reasonsLabel}>How Detour caught this</Sans>
            {[
              ['OBSERVE', card.source],
              ['EXTRACT', 'What · where · when · urgency'],
              ['RANK', `${card.match}% fit · policy and itinerary checked`],
              ['ACT', card.hasHold ? 'Notify · start hold timer' : 'Publish cited detour'],
            ].map(([phase, result]) => (
              <View key={phase} style={s.workflowRow}>
                <Kicker style={s.workflowPhase}>{phase}</Kicker>
                <View style={s.workflowLine} />
                <Sans style={s.workflowResult}>{result}</Sans>
              </View>
            ))}
            <Button label="View full agent trace" tone="grey" onPress={onSeeWorkflow} />
          </Card>
        </View>
      </ScrollView>

      <LinearGradient
        colors={['rgba(244,249,253,0)', C.phone]}
        locations={[0, 0.45]}
        style={s.footer}
      >
        {card.hasHold && (
          <View style={s.holdRow}>
            <Sans style={s.holdLabel}>Hold expires</Sans>
            <Sans style={s.countdown}>{countdown}</Sans>
          </View>
        )}
        <View style={s.btnRow}>
          <Button label={card.cta} onPress={onConfirm} />
          <Button label="Dismiss" tone="grey" onPress={onDismiss} />
        </View>
      </LinearGradient>
    </View>
  );
}

const s = StyleSheet.create({
  hero: {
    height: 274,
    marginHorizontal: 12,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: '#111713',
  },
  heroImage: { width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center' } as any,
  backBtn: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,.94)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1f3a66',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },

  body: {
    paddingTop: 18,
    paddingHorizontal: 22,
    paddingBottom: 22,
    gap: 18,
  },

  heading: { gap: 8 },
  agentRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { fontSize: 26, lineHeight: 30 },
  blurb: { fontSize: 13.5, lineHeight: 21, color: C.sub },

  chips: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  pillBig: { paddingHorizontal: 12, paddingVertical: 7 },

  reasonsBlock: { gap: 10 },
  reasonsLabel: {
    fontFamily: F.bold,
    fontSize: 11,
    letterSpacing: 1.3,
    textTransform: 'uppercase',
    color: C.faint,
  },
  reasonRow: { flexDirection: 'row', gap: 10 },
  dash: { width: 14, height: 1.5, backgroundColor: C.blue, borderRadius: 1, marginTop: 9, flexShrink: 0 },
  reasonText: { fontSize: 13, lineHeight: 19, color: C.body, flex: 1 },

  citation: { padding: 16, gap: 10 },
  workflow: { padding: 16, gap: 11 },
  workflowRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  workflowPhase: { width: 54, fontSize: 9 },
  workflowLine: { width: 12, height: 1.5, borderRadius: 1, backgroundColor: C.blue },
  workflowResult: { flex: 1, fontSize: 11.5, color: C.sub },
  citationHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  citationLabel: {
    fontFamily: F.bold,
    fontSize: 11,
    letterSpacing: 1.3,
    textTransform: 'uppercase',
    color: C.blue,
  },
  kvList: { gap: 7 },
  link: { fontFamily: F.sans, fontSize: 12.5, color: C.link },

  footer: {
    flexShrink: 0,
    paddingTop: 12,
    paddingHorizontal: 22,
    paddingBottom: 20,
    gap: 10,
  },
  holdRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  holdLabel: { fontSize: 12, color: C.sub },
  countdown: { fontFamily: F.med, fontSize: 12, color: C.ink, fontVariant: ['tabular-nums'] },
  btnRow: { flexDirection: 'row', gap: 10 },
});
