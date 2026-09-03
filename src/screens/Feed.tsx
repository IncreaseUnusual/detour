import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { PixelAgent, Icon, P } from '../icons';
import { Costumed } from '../art';
import { AGENTS, BY_ID, QUICK, Card as CardType, Destination, SWARM, cardImage } from '../data';
import { C, F } from '../theme';
import { Serif, Sans, Kicker, Card, Pill, PulseDot } from '../ui';

/** A small dot that pulses opacity .3 -> 1 -> .3, looping. Shared by the swarm row and header badge. */
export function Feed({ onOpen, onAsk, dismissed = [], liveReady, cards, destination }:
  { onOpen: (cardId: string) => void; onAsk: () => void; dismissed?: string[]; liveReady: boolean; cards: CardType[]; destination: Destination }) {
  const shownCards = cards.filter(c => !dismissed.includes(c.id) && (c.id !== 'belcanto' || liveReady));
  const place = destination === 'malaysia' ? 'Kuala Lumpur' : destination === 'texas' ? 'Austin' : 'Lisbon';
  return (
    <ScrollView style={s.flex} showsVerticalScrollIndicator={false}>
      {/* header */}
      <View style={s.header}>
        <View style={s.headerLeft}>
          <Serif style={s.greeting}>Good evening, Elena</Serif>
          <Sans style={s.sub}>{place} · active trip · Detour is watching</Sans>
        </View>
        <View style={s.avatar}>
          <Costumed kind="malaysia" size={36} />
        </View>
      </View>

      {/* quick cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={s.quickScroll}
        contentContainerStyle={s.quickContent}
      >
        {QUICK.map((q) => (
          <View key={q.label} style={s.quickCard}>
            <PixelAgent variant={q.variant} color={q.color} size={40} />
            <View style={s.quickCopy}>
              <Sans style={s.quickWhen}>{q.when}</Sans>
              <Sans style={s.quickLabel}>{q.label}</Sans>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* ask bar */}
      <View style={s.askWrap}>
        <Pressable style={s.askBar} onPress={onAsk}>
          <Icon d={P.chat} size={18} color={C.faint} />
          <Sans style={s.askText}>Ask Detour for…</Sans>
        </Pressable>
      </View>

      {/* swarm */}
      <View style={s.swarmWrap}>
        <View style={s.swarmHeader}>
          <Serif style={s.swarmTitle}>The Team</Serif>
        </View>
        <Card radius={24} style={s.swarmCard}>
          <View style={s.swarmAgents}>
            {AGENTS.map((a) => (
              <View key={a.id} style={s.swarmAgent}>
                <PixelAgent variant={a.variant} color={a.color} size={40} />
                <Sans style={s.swarmAgentLabel}>{a.short}</Sans>
                <PulseDot size={5} duration={1900} />
              </View>
            ))}
          </View>
          <Sans style={s.swarmLine}>
            {SWARM.scanned} signals scanned today · {SWARM.kept} kept · last poll {SWARM.lastPoll}
          </Sans>
        </Card>
      </View>

      {/* arrived for tonight */}
      <View style={s.arrivedWrap}>
        <Serif style={s.arrivedTitle}>Your detours</Serif>
        {shownCards.map((card) => {
          const agent = BY_ID[card.agentId];
          return (
            <Pressable key={card.id} style={s.card} onPress={() => onOpen(card.id)}>
              <View style={s.cardTop}>
                <Image source={cardImage(card)} style={s.thumb} resizeMode="cover" />
                <View style={s.cardBody}>
                  <View style={s.cardAgentRow}>
                    <PixelAgent variant={agent.variant} color={agent.color} size={26} />
                    <Kicker>{agent.name}</Kicker>
                  </View>
                  <Serif style={s.cardTitle}>{card.title}</Serif>
                  <Sans style={s.cardMeta}>{card.meta}</Sans>
                  <View style={s.cardFooterRow}>
                    <Pill text={`${card.match}% match`} tone="blue" />
                    <Sans style={s.cardStatus}>{card.status}</Sans>
                  </View>
                </View>
              </View>
              <View style={s.citation}>
                <Icon d={P.clock} size={12} color={C.blue} />
                <Sans style={s.citationText} numberOfLines={1} ellipsizeMode="tail">
                  {card.citation}
                </Sans>
              </View>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  flex: { flex: 1 },

  header: { paddingTop: 14, paddingHorizontal: 22, paddingBottom: 0, flexDirection: 'row',
    alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 },
  headerLeft: { flexDirection: 'column', gap: 2 },
  greeting: { fontSize: 28, lineHeight: 31 },
  sub: { fontSize: 13, color: C.sub },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#e7eef6',
    borderWidth: 1, borderColor: C.hairline, alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden' },

  quickScroll: { marginTop: 16 },
  quickContent: { paddingLeft: 22, paddingRight: 22, gap: 10 },
  quickCard: { width: 132, minHeight: 118, backgroundColor: C.card, borderRadius: 22, padding: 14,
    borderWidth: 1, borderColor: C.hairline, flexDirection: 'column', justifyContent: 'space-between' },
  quickCopy: { flexDirection: 'column', gap: 1 },
  quickWhen: { fontSize: 11, color: C.faint },
  quickLabel: { fontSize: 14.5, fontFamily: F.med, color: C.ink },

  askWrap: { paddingTop: 16, paddingHorizontal: 22 },
  askBar: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.chip,
    borderRadius: 999, paddingVertical: 14, paddingHorizontal: 16 },
  askText: { fontSize: 14, color: C.faint },

  swarmWrap: { paddingTop: 18, paddingHorizontal: 22, flexDirection: 'column', gap: 10 },
  swarmHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  swarmTitle: { fontSize: 19 },
  swarmCard: { padding: 14, flexDirection: 'column', gap: 12 },
  swarmAgents: { flexDirection: 'row', gap: 6 },
  swarmAgent: { flex: 1, alignItems: 'center', gap: 6 },
  swarmAgentLabel: { fontSize: 9.5, lineHeight: 11.5, textAlign: 'center', color: C.sub },
  swarmLine: { fontSize: 11.5, color: C.faint },

  arrivedWrap: { paddingTop: 18, paddingHorizontal: 14, paddingBottom: 30, flexDirection: 'column', gap: 12 },
  arrivedTitle: { fontSize: 19, paddingHorizontal: 8 },

  card: { backgroundColor: C.card, borderRadius: 26, borderWidth: 1, borderColor: C.hairlineSoft,
    overflow: 'hidden' },
  cardTop: { flexDirection: 'row', gap: 12, padding: 12 },
  thumb: { flexShrink: 0, flexGrow: 0, width: 86, height: 104, borderRadius: 20, overflow: 'hidden' },
  cardBody: { flex: 1, minWidth: 0, flexDirection: 'column', gap: 6 },
  cardAgentRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  cardTitle: { fontSize: 17, lineHeight: 17 * 1.2 },
  cardMeta: { fontSize: 11.5, color: C.sub, lineHeight: 11.5 * 1.4 },
  cardFooterRow: { flexDirection: 'row', gap: 6, alignItems: 'center', marginTop: 'auto' },
  cardStatus: { fontSize: 10.5, color: C.faint },

  citation: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 10,
    paddingHorizontal: 14, backgroundColor: C.footer },
  citationText: { fontSize: 10.5, color: C.sub, flexShrink: 1 },
});
