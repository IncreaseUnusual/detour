import React, { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { PixelAgent, Icon, P } from '../icons';
import { AGENTS, BY_ID, Card as CardType, Destination } from '../data';
import { C, F } from '../theme';
import { Serif, Sans, Kicker, Card, Pill, Button, PulseDot } from '../ui';
import { TraceStep, Phase, PHASE_LABEL, useStream, PHASE_COLOR } from '../agentRuntime';

/** A small dot that pulses opacity .3 -> 1 -> .3, looping. */
const STEPS: TraceStep[] = [
  { id: 'a1', agentId: 'triage', phase: 'reason', call: 'plan(query) → subtasks=4, agents=4', result: 'fan-out dispatched, parallel', ms: 180, at: 'now' },
  { id: 'a2', agentId: 'resv', phase: 'tool', call: 'search(reservations, radius=1.2km, seats>=2)', result: '6 candidates', ms: 640, at: 'now' },
  { id: 'a3', agentId: 'social', phase: 'tool', call: 'watch(stories, geo=lisbon, last=6h)', result: '3 candidates', ms: 910, at: 'now' },
  { id: 'a4', agentId: 'events', phase: 'tool', call: 'fetch(listings, tonight)', result: '8 candidates', ms: 400, at: 'now' },
  { id: 'a5', agentId: 'news', phase: 'observe', call: 'check(closures, transit, weather)', result: 'no blockers', ms: 220, at: 'now' },
  { id: 'a6', agentId: 'triage', phase: 'triage', call: 'dedupe + rank(17, profile=elena, budget=80)', result: 'kept 1, dropped 16', ms: 520, at: 'now' },
  { id: 'a7', agentId: 'triage', phase: 'act', call: 'answer(with_citation=true)', result: '1 result above threshold', ms: 60, at: 'now' },
];

const SUGGESTIONS = [
  'Ice cream for my daughter, then a bar for us',
  'Any underground board game meetups tonight?',
  'Late Malaysian food under RM100',
];

const CHAT = [
  'I’ll split this up. Everyone take a look!',
  'Checking nearby tables and opening hours…',
  'I found a fresh local post 👀',
  'Community listings checked. A few good leads!',
  'Weather and walking routes look clear.',
  'Finding the boldest safe option for Elena…',
  'Got it. One answer, with receipts ✦',
];

const TOOLS = ['Planning together', 'Live table availability', 'Instagram Stories', 'Community listings', 'Weather + walking', 'Taste + itinerary', 'Citations ready'];
const TOOL_ICONS = ['✦', '◷', '', '◫', '☂', '♥', '✓'];

const answerFor = (query: string) => {
  const text = query.toLowerCase();
  if (/ice|daughter|bar/.test(text)) return {
    id: 'cocktail',
    summary: 'Start at Piccoli Lotti for pandan gelato at 19:30. Then walk 8 minutes to Bar Trigona, where two counter seats opened at 20:15.',
    source: 'Google Places hours · Bar Trigona social post · checked 3 min ago',
    reasons: ['Social found Bar Trigona’s fresh counter-seat post', 'Tables confirmed two seats at 20:15', 'Events checked that the gelato stop is family-friendly tonight', 'Local verified an 8-minute covered walk and clear weather', 'Adventure fitted both stops before your 22:00 hotel return'],
  };
  if (/board|game|meetup/.test(text)) return {
    id: 'boardgames',
    summary: 'A local tabletop group in Chow Kit opened 10 guest seats for tonight at 20:30.',
    source: 'Community RSVP feed · posted 9 min ago',
    reasons: ['Social found the community invite', 'Events confirmed visitors are welcome', 'Tables checked 10 open RSVP places', 'Local verified the 14-minute route', 'Adventure approved the low-cost plan'],
  };
  return {
    id: 'rooftop',
    summary: 'The Kampung Baru chef counter is the best late option: six stools, 22:00, RM180 for two.',
    source: 'Chef social post · checked 14 min ago',
    reasons: ['Social found the chef announcement', 'Tables confirmed six stools', 'Events checked the 22:00 start', 'Local verified the route', 'Adventure chose the boldest Malaysian option near your budget'],
  };
};

type Stage = 'idle' | 'working' | 'ready' | 'answer';

export function AskScout({ cards, destination, onClose }:
  { cards: CardType[]; destination: Destination; onClose: () => void }) {
  const [stage, setStage] = useState<Stage>('idle');
  const [q, setQ] = useState('');
  const [runQuery, setRunQuery] = useState('');
  const { shown, done, restart } = useStream(STEPS, 1550, false);

  useEffect(() => {
    if (stage !== 'working' || !done) return;
    const timer = setTimeout(() => setStage('ready'), 900);
    return () => clearTimeout(timer);
  }, [stage, done]);

  const start = (text: string) => {
    if (!text.trim()) return;
    restart();
    setRunQuery(text);
    setStage('working');
  };

  const reset = () => {
    setQ('');
    setRunQuery('');
    setStage('idle');
  };

  const answer = answerFor(runQuery);
  const winner = cards.find(c => c.id === answer.id) ?? cards[0];
  const place = destination === 'malaysia' ? 'Kuala Lumpur' : destination === 'texas' ? 'Austin' : 'Lisbon';

  return (
    <View style={{ flex: 1 }}>
      <View style={s.header}>
        <Pressable style={s.back} onPress={onClose}>
          <Icon d={P.back} size={16} color={C.ink} />
        </Pressable>
        <View style={s.headerCopy}>
          <Serif style={s.headerTitle}>Ask the team</Serif>
          <Sans style={s.headerSub}>Your local agents, working together</Sans>
        </View>
      </View>

      {stage === 'idle' && (
        <View style={s.idleWrap}>
          <Card radius={20} style={s.inputCard}>
            <Icon d={P.chat} size={18} color={C.faint} />
            <TextInput
              style={s.input}
              value={q}
              onChangeText={setQ}
              placeholder="Ask Detour for…"
              placeholderTextColor={C.faint}
              onSubmitEditing={() => start(q)}
            />
          </Card>

          <Serif style={s.tryLabel}>Try</Serif>
          <View style={s.suggestionList}>
            {SUGGESTIONS.map((text) => (
              <Pressable
                key={text}
                style={s.suggestion}
                onPress={() => { setQ(text); start(text); }}
              >
                <Card radius={16} style={s.suggestionCard}>
                  <Sans style={s.suggestionText}>{text}</Sans>
                  <Icon d={P.compass} size={14} color={C.faint} />
                </Card>
              </Pressable>
            ))}
          </View>

          <View style={{ flexDirection: 'row' }}>
            <Button
              label="Ask the team"
              onPress={() => start(q)}
              style={!q.trim() ? { opacity: 0.4 } : undefined}
            />
          </View>
          <Sans style={s.demoNote}>Prototype replay using the active {place} scenario.</Sans>
        </View>
      )}

      {(stage === 'working' || stage === 'ready') && (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={s.workingWrap} showsVerticalScrollIndicator={false}>
          <Card radius={18} style={s.echoCard}>
            <Sans style={s.echoText}>{runQuery}</Sans>
          </Card>

          <View style={s.chatIntro}><PulseDot size={7} /><Sans style={s.chatIntroText}>Detour’s agents are talking</Sans></View>
          {shown.map((step, i) => {
            const agent = BY_ID[step.agentId];
            return (
              <View key={step.id} style={[s.chatRow, i % 2 === 1 && s.chatRowRight]}>
                <PixelAgent variant={agent.variant} color={agent.color} size={38} />
                <View style={[s.bubbleWrap, i % 2 === 1 && s.bubbleRight]}>
                  <Kicker style={[s.stepAgentName, { color: agent.color }]}>{agent.name}</Kicker>
                  <Card radius={17} style={[s.chatBubble, i % 2 === 1 && s.chatBubbleRight]}>
                    <View style={s.toolRow}>
                      {step.agentId === 'social' && <Image source={require('../../assets/instagram.png')} style={s.toolIcon} />}
                      {step.agentId !== 'social' && <Sans style={s.toolGlyph}>{TOOL_ICONS[i]}</Sans>}
                      <Sans style={s.toolText}>{TOOLS[i]} · searching…</Sans>
                    </View>
                    <Sans style={s.chatText}>{CHAT[i]}</Sans>
                  </Card>
                </View>
              </View>
            );
          })}
          {!done && <View style={s.typing}><PulseDot size={5} /><PulseDot size={5} duration={1900} /><PulseDot size={5} duration={2200} /></View>}
          {stage === 'ready' && <View style={s.suggestionsButton}><Button label="Suggestions" onPress={() => setStage('answer')} /></View>}
        </ScrollView>
      )}

      {stage === 'answer' && (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={s.answerWrap} showsVerticalScrollIndicator={false}>
          <Sans style={s.answerText}>{answer.summary}</Sans>
          <View style={s.synthesisRow}>
            {AGENTS.map(agent => <PixelAgent key={agent.id} variant={agent.variant} color={agent.color} size={25} />)}
            <Sans style={s.synthesisText}>combined into one answer</Sans>
          </View>
          <Sans style={s.summaryLine}>Searched local places, social posts, community listings, and availability.</Sans>

          <Card radius={24} style={s.winnerCard}>
            <View style={s.winnerBody}>
              <View style={s.conclusionHead}><Serif style={s.winnerTitle}>Team conclusion</Serif><Pill tone="blue" text={`${winner.match}% fit`} /></View>
              {AGENTS.map((agent, i) => (
                <View key={agent.id} style={s.inputRow}>
                  <PixelAgent variant={agent.variant} color={agent.color} size={27} />
                  <View style={s.inputCopy}><Kicker style={{ color: agent.color }}>{agent.name}</Kicker><Sans style={s.inputText}>{answer.reasons[i]}</Sans></View>
                </View>
              ))}
            </View>
            <View style={s.footerStrip}>
              <Icon d={P.clock} size={12} color={C.blue} />
              <Sans style={s.footerText} numberOfLines={1}>{answer.source}</Sans>
            </View>
          </Card>

          <View style={s.actionRow}>
            <Button label="Ask again" tone="grey" onPress={reset} />
            <Button label="Done" onPress={onClose} />
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  header: { paddingTop: 14, paddingHorizontal: 22, paddingBottom: 12, flexDirection: 'row',
    alignItems: 'center', gap: 12 },
  back: { width: 34, height: 34, borderRadius: 17, backgroundColor: C.chip,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  headerCopy: { flex: 1, flexDirection: 'column', gap: 1 },
  headerTitle: { fontSize: 20 },
  headerSub: { fontSize: 11.5, color: C.faint },

  idleWrap: { paddingHorizontal: 22, flexDirection: 'column', gap: 14 },
  inputCard: { padding: 14, flexDirection: 'row', alignItems: 'center', gap: 10 },
  input: { flex: 1, fontFamily: F.sans, fontSize: 14, color: C.ink, outlineStyle: 'none' } as any,

  tryLabel: { fontSize: 15 },
  suggestionList: { flexDirection: 'column', gap: 8 },
  suggestion: {},
  suggestionCard: { padding: 12, flexDirection: 'row', alignItems: 'center', gap: 10 },
  suggestionText: { flex: 1, fontSize: 13, color: C.ink },
  demoNote: { fontSize: 10.5, color: C.faint, textAlign: 'center' },

  workingWrap: { paddingHorizontal: 22, paddingBottom: 30, flexDirection: 'column', gap: 10 },
  echoCard: { padding: 12, backgroundColor: C.chip },
  echoText: { fontSize: 13, color: C.ink },
  chatIntro: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, paddingVertical: 4 },
  chatIntroText: { fontSize: 11, color: C.faint },
  chatRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 9 },
  chatRowRight: { flexDirection: 'row-reverse' },
  bubbleWrap: { maxWidth: '78%', gap: 3 },
  bubbleRight: { alignItems: 'flex-end' },
  chatBubble: { paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#f1f6fb' },
  chatBubbleRight: { backgroundColor: '#edf5ea' },
  chatText: { fontSize: 12.5, lineHeight: 18, color: C.body },
  toolRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 5 },
  toolIcon: { width: 16, height: 16 },
  toolGlyph: { width: 16, textAlign: 'center', fontSize: 14, color: C.blue },
  toolText: { fontFamily: F.med, fontSize: 9.5, color: C.faint },
  suggestionsButton: { flexDirection: 'row', marginTop: 8 },
  typing: { alignSelf: 'center', flexDirection: 'row', gap: 5, padding: 12 },
  flowCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 5,
    backgroundColor: C.chip, borderRadius: 16, paddingHorizontal: 10, paddingVertical: 9 },
  flowAgents: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  flowLabel: { fontSize: 7.5, letterSpacing: 0.8 },
  flowArrow: { fontSize: 11, color: C.faint },

  stepCard: { padding: 12, flexDirection: 'column', gap: 6 },
  stepTop: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  stepAgentName: { fontSize: 9.5 },
  stepMs: { fontFamily: F.med, fontSize: 10, color: C.faint, fontVariant: ['tabular-nums'] },
  phaseTag: { fontFamily: F.bold, fontSize: 9, letterSpacing: 1.2 },
  callChip: { backgroundColor: C.chip, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 6,
    alignSelf: 'flex-start' },
  callText: { fontFamily: F.med, fontSize: 12.5, color: C.ink },
  resultRow: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  dash: { width: 10, height: 1.5, backgroundColor: C.blue, borderRadius: 1, flexShrink: 0 },
  resultText: { fontSize: 11.5, color: C.sub, flex: 1 },

  answerWrap: { paddingHorizontal: 22, paddingBottom: 30, flexDirection: 'column', gap: 12 },
  summaryLine: { fontSize: 11.5, color: C.faint },
  answerText: { fontSize: 14, lineHeight: 21, color: C.ink },
  synthesisRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  synthesisText: { marginLeft: 5, color: C.faint, fontSize: 10.5 },

  winnerCard: { overflow: 'hidden' },
  winnerBody: { padding: 14, flexDirection: 'column', gap: 7 },
  conclusionHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  inputRow: { flexDirection: 'row', gap: 9, alignItems: 'center', paddingVertical: 5 },
  inputCopy: { flex: 1, gap: 2 },
  inputText: { fontSize: 11.5, lineHeight: 16, color: C.sub },
  winnerTitle: { fontSize: 17, lineHeight: 21 },
  winnerMeta: { fontSize: 12, color: C.sub },
  winnerPillRow: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  winnerStatus: { fontSize: 10.5, color: C.faint },
  footerStrip: { paddingHorizontal: 14, paddingVertical: 10, backgroundColor: C.footer,
    flexDirection: 'row', alignItems: 'center', gap: 6 },
  footerText: { fontSize: 10.5, color: C.sub, flexShrink: 1 },

  whyWrap: { flexDirection: 'column', gap: 8 },
  whyLabel: { fontFamily: F.bold, fontSize: 11, letterSpacing: 1.3, textTransform: 'uppercase', color: C.faint },
  reasonRow: { flexDirection: 'row', gap: 10 },
  reasonDash: { width: 14, height: 1.5, backgroundColor: C.blue, borderRadius: 1, marginTop: 9, flexShrink: 0 },
  reasonText: { fontSize: 13, lineHeight: 19, color: C.body, flex: 1 },

  actionRow: { flexDirection: 'row', gap: 10 },
});
