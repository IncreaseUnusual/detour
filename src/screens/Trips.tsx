import React, { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { PixelAgent } from '../icons';
import { MissionMap } from '../components/MissionMap';
import { BY_ID } from '../data';
import { C, F } from '../theme';
import { Serif, Sans, Kicker, Card, Pill, PulseDot, Button } from '../ui';
import type { Destination } from '../data';

type ItineraryRow = { at: string; name: string; sub: string; tag: 'auto-added' | 'held' | 'adjusted' | 'open' };

const CONFIRMED_ITINERARY: ItineraryRow[] = [
  { at: '19:00', name: "Private view, 'Atlântico'", sub: 'Galeria Madragoa, Santos', tag: 'auto-added' },
  { at: '20:00', name: 'Belcanto', sub: 'Two covers, tasting menu', tag: 'held' },
  { at: '22:30', name: 'Walk back via Chiado', sub: 'Detour adjusted for the later dinner', tag: 'adjusted' },
];

const OPEN_ITINERARY: ItineraryRow[] = [
  { at: '19:00', name: "Private view, 'Atlântico'", sub: 'Galeria Madragoa, Santos', tag: 'auto-added' },
  { at: '20:00', name: 'Open evening', sub: 'Detour is watching this gap', tag: 'open' },
  { at: '22:30', name: 'Walk back via Chiado', sub: 'Flexible route to the hotel', tag: 'adjusted' },
];

const TAG_TONE = { held: 'green', 'auto-added': 'blue', adjusted: 'grey', open: 'grey' } as const;

const EXPLORING = [
  'Checking tables in Chiado',
  'Looking through tonight’s events',
  'Watching local food spots',
  'Ranking new signals against your profile',
];

const CHANGES = [
  { agentId: 'resv', at: '20:04', did: 'Held two covers at Belcanto', why: 'Cancellation detected 3 min before public release', undo: true },
  { agentId: 'events', at: '18:02', did: "Added the 'Atlântico' private view", why: 'Free and non-committal, inside your auto-add rules', undo: true },
  { agentId: 'news', at: '17:10', did: 'Flagged Santa Catarina closure', why: 'Affects a booked item, alternative proposed, nothing moved', undo: false },
  { agentId: 'triage', at: '20:04', did: 'Matched 4 adventures', why: 'Fit your safety, taste, and 0.85 threshold', undo: false },
];

type TripsProps = {
  destination: Destination;
  confirmed: boolean;
  missionStart?: boolean;
  onMissionConsumed?: () => void;
};

const RESCUE_ITINERARY: ItineraryRow[] = [
  { at: '19:00', name: 'Kampung Baru chef pop-up', sub: 'Two counter seats · held until 19:07', tag: 'held' },
  { at: '20:45', name: 'Covered heritage walk', sub: 'Dry route · 11 minutes', tag: 'adjusted' },
  { at: '21:15', name: 'Pandan cocktail lab', sub: 'Four-seat hidden tasting room', tag: 'auto-added' },
];

export function Trips({ destination, confirmed, missionStart = false, onMissionConsumed }: TripsProps) {
  const place = destination === 'malaysia' ? 'Kuala Lumpur' : destination === 'texas' ? 'Austin' : 'Lisbon';
  const localOpen: ItineraryRow[] = destination === 'malaysia' ? [
    { at: '18:30', name: 'ILHAM Gallery', sub: 'Curator-led evening viewing', tag: 'auto-added' },
    { at: '20:00', name: 'Open evening', sub: 'Detour is watching Kuala Lumpur', tag: 'open' },
    { at: '22:30', name: 'KLCC night walk', sub: 'Flexible route to the hotel', tag: 'adjusted' },
  ] : [
    { at: '18:00', name: 'The Contemporary Austin', sub: 'Sunset programme at Jones Center', tag: 'auto-added' },
    { at: '19:30', name: 'Open evening', sub: 'Detour is watching Austin', tag: 'open' },
    { at: '22:00', name: 'South Congress', sub: 'Flexible route to the hotel', tag: 'adjusted' },
  ];
  const localConfirmed: ItineraryRow[] = localOpen.map(row => row.tag === 'open' ? {
    at: row.at,
    name: destination === 'malaysia' ? 'Dewakan' : 'Chef counter',
    sub: 'Two seats · Detour find',
    tag: 'held',
  } : row);
  const itinerary = destination === 'lisbon'
    ? (confirmed ? CONFIRMED_ITINERARY : OPEN_ITINERARY)
    : (confirmed ? localConfirmed : localOpen);
  const exploringLines = destination === 'malaysia'
    ? ['Checking tables near KLCC', 'Watching tonight’s pasar malam', 'Scanning gallery programmes', 'Ranking new signals against your profile']
    : destination === 'texas'
      ? ['Checking tables in East Austin', 'Watching tonight’s venue posts', 'Scanning local arts listings', 'Ranking new signals against your profile']
      : EXPLORING;
  const [exploring, setExploring] = useState(0);
  const [mission, setMission] = useState(0);
  const missionHandled = useRef(false);

  useEffect(() => {
    setMission(0);
  }, [destination]);

  useEffect(() => {
    if (!missionStart) {
      missionHandled.current = false;
      return;
    }
    if (missionHandled.current || destination !== 'malaysia') return;
    missionHandled.current = true;
    setMission(1);
    onMissionConsumed?.();
  }, [missionStart, destination, onMissionConsumed]);

  useEffect(() => {
    if (mission < 1 || mission >= 4) return;
    const delays = [0, 3200, 4300, 3200];
    const timer = setTimeout(() => setMission(value => value + 1), delays[mission]);
    return () => clearTimeout(timer);
  }, [mission]);

  useEffect(() => {
    if (confirmed) return;
    const timer = setInterval(() => setExploring(i => (i + 1) % exploringLines.length), 1600);
    return () => clearInterval(timer);
  }, [confirmed, destination, exploringLines.length]);

  return (
    <ScrollView style={s.flex} showsVerticalScrollIndicator={false}>
      <View style={s.header}>
        <Serif style={s.title}>{place}</Serif>
        <Sans style={s.sub}>Active trip · Detour is watching</Sans>
      </View>

      {destination === 'malaysia' && mission > 0 ? (
        <View style={s.missionSection}>
          <View style={s.mapHeading}>
            <View>
              <Serif style={s.mapTitle}>Tonight, live</Serif>
              <Sans style={s.mapSub}>Kuala Lumpur · 18:36</Sans>
            </View>
            <View style={s.livePill}><PulseDot size={6} duration={700} /><Sans style={s.livePillText}>Live</Sans></View>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.filters}>
            {['Tonight', 'Weather', 'Tables', 'Under RM300'].map((item, index) => (
              <View key={item} style={[s.filter, index === 0 && s.filterActive]}><Sans style={[s.filterText, index === 0 && s.filterTextActive]}>{item}</Sans></View>
            ))}
          </ScrollView>
          <MissionMap stage={mission >= 4 ? 2 : 1} />
          {mission < 4 ? <Card radius={22} style={s.scanCard}>
            <View style={s.scanTop}><PulseDot size={7} /><Kicker>Detour is rerouting</Kicker><Sans style={s.scanCount}>{Math.min(5, mission + 2)}/5</Sans></View>
            <Serif style={s.scanTitle}>{mission === 1 ? 'Storm on your rooftop route' : mission === 2 ? 'A dry table just opened' : 'Checking the best way there'}</Serif>
            <View style={s.agentStrip}>
              {['news', 'social', 'resv', 'events', 'triage'].map((id, index) => { const agent = BY_ID[id]; return <View key={id} style={[s.miniAgent, { opacity: index <= mission + 1 ? 1 : .24 }]}><PixelAgent variant={agent.variant} color={agent.color} size={22} /></View>; })}
            </View>
          </Card> : mission < 5 ? <Card radius={24} style={s.routeCard}>
            <View style={s.routeHero}><View style={s.grow}><Kicker style={s.best}>Best detour · 93% match</Kicker><Serif style={s.routeTitle}>Chef pop-up, then Bar Trigona</Serif><Sans style={s.routeMeta}>Two seats held · covered route · RM240</Sans></View></View>
            <View style={s.compactRoute}>{RESCUE_ITINERARY.map((row, i) => <View key={row.at} style={s.routeStop}><View style={[s.routeDot, i === 0 && s.routeDotFirst]} />{i < RESCUE_ITINERARY.length - 1 && <View style={s.routeLine} />}<Sans style={s.routeTime}>{row.at}</Sans><Sans style={s.routeName}>{row.name}</Sans></View>)}</View>
            <View style={s.actions}><Button label="Take this Detour" onPress={() => setMission(5)} /><Button label="Keep my plan" tone="grey" onPress={() => setMission(0)} /></View>
          </Card> : null}

          {mission === 5 && <Card radius={24} style={s.receiptCard}>
            <View style={s.receiptCheck}><Sans style={s.receiptTick}>✓</Sans></View>
            <Serif style={s.receiptTitle}>Your route is ready.</Serif>
            <Sans style={s.receiptSub}>Table held · weather checked · itinerary updated</Sans>
            <View style={s.receiptList}>
              {['19:00  Chef pop-up', '20:45  Covered heritage walk', '21:15  Bar Trigona'].map(item => (
                <View key={item} style={s.receiptRow}><Sans style={s.check}>✓</Sans><Sans style={s.receiptItem}>{item}</Sans></View>
              ))}
            </View>
            <Pressable accessibilityRole="button" style={s.undoPill} onPress={() => setMission(0)}><Sans style={s.undoText}>Undo all changes</Sans></Pressable>
          </Card>}
        </View>
      ) : <View style={s.section}>
        <Serif style={s.sectionTitle}>Tonight</Serif>
        {!confirmed && (
          <Card radius={20} style={s.exploringCard}>
            <PulseDot size={7} />
            <View style={s.exploringCopy}>
              <Sans style={s.exploringTitle}>Detour is exploring {place}</Sans>
              <Sans style={s.exploringLine}>{exploringLines[exploring]}</Sans>
            </View>
          </Card>
        )}
        <Card radius={24} style={s.itineraryCard}>
          {itinerary.map((row, i) => (
            <View
              key={row.at}
              style={[s.row, i < itinerary.length - 1 && s.rowBorder]}
            >
              <Sans style={s.time}>{row.at}</Sans>
              <View style={s.rowBody}>
                <Serif style={s.rowName}>{row.name}</Serif>
                <Sans style={s.rowSub}>{row.sub}</Sans>
              </View>
              <Pill text={row.tag} tone={TAG_TONE[row.tag]} />
            </View>
          ))}
        </Card>
      </View>}

      {destination === 'lisbon' && <View style={s.changeSection}>
        <View style={s.changeHeader}>
          <Serif style={s.sectionTitle}>What Detour changed</Serif>
          <Sans style={s.reversible}>all reversible</Sans>
        </View>
        {CHANGES.filter(entry => confirmed || !entry.did.startsWith('Held two covers')).map((entry) => {
          const agent = BY_ID[entry.agentId];
          return (
            <Card key={entry.at + entry.did} radius={20} style={s.changeCard}>
              <View style={s.changeTop}>
                <PixelAgent variant={agent.variant} color={agent.color} size={22} />
                <Kicker style={s.changeAgentName}>{agent.name}</Kicker>
                <View style={s.grow} />
                <Sans style={s.changeTime}>{entry.at}</Sans>
              </View>
              <Sans style={s.changeDid}>{entry.did}</Sans>
              <Sans style={s.changeWhy}>{entry.why}</Sans>
              {entry.undo && (
                <Pressable style={s.undoPill} onPress={() => {}}>
                  <Sans style={s.undoText}>Undo</Sans>
                </Pressable>
              )}
            </Card>
          );
        })}
      </View>}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  flex: { flex: 1 },

  header: { paddingTop: 14, paddingHorizontal: 22, paddingBottom: 0, flexDirection: 'column', gap: 2 },
  title: { fontSize: 28, lineHeight: 31 },
  sub: { fontSize: 13, color: C.sub },

  section: { paddingTop: 18, paddingHorizontal: 22, paddingBottom: 0, flexDirection: 'column', gap: 10 },
  sectionTitle: { fontSize: 19 },
  itineraryCard: { padding: 4 },
  exploringCard: { padding: 14, flexDirection: 'row', alignItems: 'center', gap: 10 },
  exploringCopy: { flex: 1, gap: 2 },
  exploringTitle: { fontFamily: F.med, fontSize: 13.5, color: C.ink },
  exploringLine: { fontSize: 11.5, color: C.faint },

  row: { flexDirection: 'row', gap: 14, paddingVertical: 13, paddingHorizontal: 12, alignItems: 'center' },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: C.hairlineSoft },
  time: { fontFamily: F.med, fontSize: 12, color: C.faint, width: 46, paddingTop: 2,
    fontVariant: ['tabular-nums'], flexShrink: 0 },
  rowBody: { flex: 1, flexDirection: 'column', gap: 3 },
  rowName: { fontSize: 15.5 },
  rowSub: { fontSize: 11.5, color: C.sub },

  changeSection: { paddingTop: 18, paddingHorizontal: 22, paddingBottom: 30, flexDirection: 'column', gap: 10 },
  changeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  reversible: { fontSize: 11, color: C.faint },

  changeCard: { padding: 12, flexDirection: 'column', gap: 7 },
  changeTop: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  changeAgentName: { fontSize: 9.5 },
  grow: { flex: 1 },
  changeTime: { fontFamily: F.med, fontSize: 10, color: C.faint, fontVariant: ['tabular-nums'] },
  changeDid: { fontFamily: F.med, fontSize: 13.5, color: C.ink },
  changeWhy: { fontSize: 11.5, lineHeight: 17, color: C.sub },

  undoPill: { alignSelf: 'flex-start', backgroundColor: C.chip, borderRadius: 999,
    paddingHorizontal: 12, paddingVertical: 6 },
  undoText: { fontFamily: F.med, fontSize: 11, color: C.muted },

  missionSection: { paddingTop: 18, paddingHorizontal: 22, paddingBottom: 34, gap: 12 },
  mapHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  mapTitle: { fontSize: 25, lineHeight: 28 },
  mapSub: { color: C.sub, fontSize: 11.5, marginTop: 2 },
  livePill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: C.chipGreen, borderRadius: 999, paddingHorizontal: 11, paddingVertical: 7 },
  livePillText: { color: C.chipGreenInk, fontFamily: F.med, fontSize: 10.5 },
  filters: { gap: 7 },
  filter: { borderWidth: 1, borderColor: C.hairlineSoft, backgroundColor: '#fff', borderRadius: 999, paddingHorizontal: 13, paddingVertical: 8 },
  filterActive: { backgroundColor: C.ink, borderColor: C.ink },
  filterText: { color: C.sub, fontSize: 10.5 },
  filterTextActive: { color: '#fff', fontFamily: F.med },
  scanCard: { padding: 15, gap: 9 },
  scanTop: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  scanCount: { marginLeft: 'auto', color: C.faint, fontSize: 10.5 },
  scanTitle: { fontSize: 18, lineHeight: 21 },
  agentStrip: { flexDirection: 'row', gap: 8 },
  miniAgent: { width: 38, height: 38, borderRadius: 12, backgroundColor: C.footer, alignItems: 'center', justifyContent: 'center' },
  alertCard: { padding: 17, backgroundColor: '#fff7f2', borderColor: 'rgba(226,86,74,.18)', gap: 7 },
  alertTop: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  alertKicker: { color: '#b9483f' },
  liveTime: { marginLeft: 'auto', color: C.faint, fontSize: 10, fontVariant: ['tabular-nums'] },
  alertTitle: { fontSize: 22, lineHeight: 25 },
  alertCopy: { color: C.sub, fontSize: 12.5, lineHeight: 18 },
  missionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 5 },
  teamCard: { paddingHorizontal: 13 },
  agentRow: { minHeight: 60, flexDirection: 'row', alignItems: 'center', gap: 11, paddingVertical: 8 },
  agentBorder: { borderBottomWidth: 1, borderBottomColor: C.hairlineSoft },
  agentBubble: { width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  agentLine: { fontSize: 11.5, color: C.sub, marginTop: 2 },
  check: { color: C.green, fontFamily: F.bold, fontSize: 14 },
  callCard: { padding: 15, backgroundColor: '#20262d', gap: 10 },
  callTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  phoneDot: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#3a9e60', alignItems: 'center', justifyContent: 'center' },
  phoneGlyph: { color: '#fff', fontSize: 15 },
  callName: { color: '#fff', fontFamily: F.med, marginTop: 2 },
  callTime: { color: '#aeb9c4', fontSize: 11, fontVariant: ['tabular-nums'] },
  waveform: { height: 34, flexDirection: 'row', gap: 4, alignItems: 'center', justifyContent: 'center' },
  wavebar: { width: 3, borderRadius: 2, backgroundColor: '#6fd091' },
  transcript: { color: '#dce3e9', fontSize: 11.5, lineHeight: 17 },
  speaker: { color: '#6fd091', fontFamily: F.bold },
  planSection: { gap: 9 },
  plans: { flexDirection: 'row', gap: 7 },
  plan: { flex: 1, padding: 11, minHeight: 118, justifyContent: 'flex-end' },
  winner: { backgroundColor: '#edf7ed', borderColor: 'rgba(79,156,74,.35)', transform: [{ translateY: -3 }] },
  best: { color: '#3d7d3b', marginBottom: 5 },
  planName: { fontSize: 15, lineHeight: 17 },
  planNote: { color: C.faint, fontSize: 9.5, lineHeight: 13, marginTop: 4 },
  score: { color: C.faint, fontFamily: F.bold, fontSize: 17, marginTop: 8 },
  bestScore: { color: '#3d7d3b' },
  routeCard: { padding: 16, gap: 5 },
  routeHero: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 5 },
  routeTitle: { fontSize: 19, lineHeight: 22, maxWidth: 230 },
  routeMeta: { color: C.sub, fontSize: 11.5, marginTop: 5 },
  compactRoute: { marginTop: 8, gap: 0 },
  routeStop: { minHeight: 34, flexDirection: 'row', alignItems: 'flex-start', position: 'relative' },
  routeDot: { width: 9, height: 9, borderRadius: 5, backgroundColor: C.green, marginTop: 4, marginRight: 10, zIndex: 1 },
  routeDotFirst: { backgroundColor: '#3d8ee8' },
  routeLine: { position: 'absolute', left: 4, top: 12, bottom: -5, width: 1, backgroundColor: C.hairline },
  routeTime: { width: 42, color: C.faint, fontSize: 10.5, fontVariant: ['tabular-nums'] },
  routeName: { flex: 1, color: C.ink, fontFamily: F.med, fontSize: 11.5 },
  scoreOrb: { width: 48, height: 48, borderRadius: 24, backgroundColor: C.chipGreen, alignItems: 'center', justifyContent: 'center' },
  scoreOrbText: { color: C.chipGreenInk, fontFamily: F.bold, fontSize: 13 },
  routeRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10 },
  holdLine: { flexDirection: 'row', alignItems: 'center', gap: 7, backgroundColor: '#fff5ed', borderRadius: 12, padding: 10, marginTop: 7 },
  holdText: { color: '#9b493e', fontFamily: F.med, fontSize: 10.5 },
  actions: { flexDirection: 'row', gap: 8, marginTop: 8 },
  receiptCard: { padding: 20, alignItems: 'center', gap: 8 },
  receiptCheck: { width: 54, height: 54, borderRadius: 27, backgroundColor: C.chipGreen, alignItems: 'center', justifyContent: 'center' },
  receiptTick: { color: C.green, fontSize: 27, fontFamily: F.bold },
  receiptTitle: { fontSize: 24, marginTop: 4 },
  receiptSub: { color: C.sub, fontSize: 12, lineHeight: 17, textAlign: 'center' },
  receiptList: { alignSelf: 'stretch', backgroundColor: C.footer, borderRadius: 15, padding: 12, gap: 9, marginVertical: 6 },
  receiptRow: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  receiptItem: { color: C.body, fontSize: 11.5 },
});
