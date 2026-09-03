import React, { useEffect, useState } from 'react';
import { Image, ImageBackground, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { PixelAgent } from '../icons';
import { AGENTS, BY_ID, Card as CardType, Destination, cardImage } from '../data';
import { PHASE_COLOR, PHASE_LABEL, TraceStep, useSwarmCounters } from '../agentRuntime';
import { C, F } from '../theme';
import { Button, Card, Kicker, Pill, PulseDot, Sans, Serif } from '../ui';

export function Swarm({ cards, status, shown, onTrigger, onOpen }:
  { destination: Destination; cards: CardType[]; status: 'idle' | 'running' | 'surfaced'; shown: TraceStep[]; onTrigger: () => void; onOpen: (id: string) => void }) {
  const { scanned } = useSwarmCounters();
  const [workflow, setWorkflow] = useState(false);
  const [weather, setWeather] = useState('Live weather ready');
  const [visible, setVisible] = useState(() => cards.slice(0, 3));
  const [refreshing, setRefreshing] = useState(false);
  const [quest, setQuest] = useState(-1);
  const [verifying, setVerifying] = useState(false);
  const [wrongAnswer, setWrongAnswer] = useState('');
  const [selectedAnswer, setSelectedAnswer] = useState('');
  useEffect(() => setVisible(cards.slice(0, 3)), [cards]);
  const discover = async () => {
    if (refreshing) return;
    setRefreshing(true);
    void trigger();
    await new Promise(resolve => setTimeout(resolve, 900));
    setVisible([...cards].sort(() => Math.random() - 0.5).slice(0, 3));
    setRefreshing(false);
  };
  const trigger = async () => {
    if (status === 'running') return;
    onTrigger(); setWeather('Checking live Kuala Lumpur weather...');
    try {
      const r = await fetch('https://api.open-meteo.com/v1/forecast?latitude=3.14&longitude=101.69&current=temperature_2m,precipitation&timezone=Asia%2FKuala_Lumpur');
      if (!r.ok) throw new Error();
      const d = await r.json(); setWeather(`${d.current.temperature_2m}°C in KL · ${d.current.precipitation} mm rain`);
    } catch { setWeather('Live weather unavailable · agents still watching'); }
  };

  const verify = async (choice: string, answer: string) => {
    if (verifying) return;
    setSelectedAnswer(choice);
    if (choice !== answer) { setWrongAnswer(choice); return; }
    setWrongAnswer('');
    setVerifying(true);
    await new Promise(resolve => setTimeout(resolve, 1200));
    setQuest(step => Math.min(3, step + 1));
    setSelectedAnswer('');
    setVerifying(false);
  };

  if (quest >= 0) {
    const stops = [
      { agent: 'resv', title: 'Crack the noodle code', place: 'Lot 10 Hutong', clue: 'Which sauce brand is displayed beside the beef noodle stall?', options: ['Lee Kum Kee', 'Kikkoman', 'Maggi'], answer: 'Lee Kum Kee', image: require('../../assets/explore/kampung-counter.png') },
      { agent: 'events', title: 'Read the old cinema', place: 'REXKL', clue: 'What was this building originally known as?', options: ['Rex Cinema', 'Central Market', 'Majestic Theatre'], answer: 'Rex Cinema', image: require('../../assets/explore/ilham.png') },
      { agent: 'social', title: 'Unlock the skyline', place: 'The Exchange TRX · before 21:00', clue: 'Which landmark can you spot from the rooftop garden?', options: ['Petronas Towers', 'Batu Caves', 'Stadthuys'], answer: 'Petronas Towers', image: require('../../assets/explore/kl-hero.png') },
    ];
    const current = stops[Math.min(quest, 2)];
    const agent = BY_ID[current.agent];
    return <ScrollView style={s.flex} contentContainerStyle={s.questPage} showsVerticalScrollIndicator={false}>
      <Pressable onPress={() => setQuest(-1)}><Sans style={s.back}>‹ Explore Kuala Lumpur</Sans></Pressable>
      <View style={s.questTop}><View><Kicker>City escape adventure</Kicker><Serif style={s.questName}>The KL Code</Serif></View><Pill text={`${Math.min(quest, 3)}/3`} tone="green" /></View>
      <View style={s.progress}>{stops.map((_, i) => <View key={i} style={[s.progressBar, i < quest && s.progressDone, i === quest && s.progressNow]} />)}</View>
      {quest < 3 ? <>
        <ImageBackground source={current.image} style={s.questHero} imageStyle={s.questHeroImage}>
          <View style={s.questShade}><View style={s.questAgent}><PixelAgent variant={agent.variant} color={agent.color} size={28} /></View><Kicker style={s.questPlace}>{current.place}</Kicker></View>
        </ImageBackground>
        <Card radius={24} style={s.questCard}>
          <Kicker>Checkpoint {quest + 1}</Kicker><Serif style={s.questTitle}>{current.title}</Serif><Sans style={s.questClue}>{current.clue}</Sans>
          <View style={s.answerList}>{current.options.map(choice => <Pressable key={choice} disabled={verifying} style={[s.answer, wrongAnswer === choice && s.answerWrong, verifying && selectedAnswer === choice && s.answerCorrect]} onPress={() => { void verify(choice, current.answer); }}><Sans style={[s.answerLetter, verifying && selectedAnswer === choice && s.answerLetterCorrect]}>{String.fromCharCode(65 + current.options.indexOf(choice))}</Sans><Sans style={[s.answerText, verifying && selectedAnswer === choice && s.answerTextCorrect]}>{choice}</Sans></Pressable>)}</View>
          <Sans style={[s.answerHint, wrongAnswer && s.answerHintWrong]}>{verifying ? 'Correct. Unlocking the next checkpoint…' : wrongAnswer ? 'Not quite. Look around and try again.' : 'Choose the answer to unlock your next stop.'}</Sans>
        </Card>
      </> : <Card radius={28} style={s.completeCard}>
        <View style={s.completeIcon}><Sans style={s.completeTick}>✓</Sans></View><Kicker>KL unlocked</Kicker><Serif style={s.completeTitle}>You cracked The KL Code.</Serif><Sans style={s.completeCopy}>Three hidden places · one city-scale escape room</Sans><Button label="Back to Detour" onPress={() => setQuest(-1)} />
      </Card>}
    </ScrollView>;
  }

  if (workflow) return <ScrollView style={s.flex} contentContainerStyle={s.workflow} showsVerticalScrollIndicator={false}>
    <Pressable onPress={() => setWorkflow(false)}><Sans style={s.back}>‹ Explore Kuala Lumpur</Sans></Pressable>
    <Serif style={s.title}>How Detour works</Serif><Sans style={s.sub}>A live, auditable run from signal to action.</Sans>
    <Button label={status === 'running' ? 'Agents are working...' : 'Run live cancellation'} onPress={trigger} /><Sans style={s.weather}>{weather}</Sans>
    <View style={s.agentGrid}>{AGENTS.map(a => <Card key={a.id} radius={18} style={s.agentRow}>
      <PixelAgent variant={a.variant} color={a.color} size={30} /><View style={s.agentCopy}><Sans style={s.agentName}>{a.name}</Sans><Sans style={s.access}>{a.access}</Sans></View><PulseDot size={6} />
    </Card>)}</View>
    <View style={s.traceHead}><Serif style={s.section}>Agent trace</Serif><Pill text="live replay" tone="green" /></View>
    {shown.map(step => { const agent = BY_ID[step.agentId]; return <Card key={step.id} radius={18} style={s.traceCard}>
      <View style={s.traceTop}><PixelAgent variant={agent.variant} color={agent.color} size={22} /><Kicker>{agent.name}</Kicker><Sans style={s.time}>{step.at}</Sans></View>
      <Sans style={[s.phase, { color: PHASE_COLOR[step.phase] }]}>{PHASE_LABEL[step.phase]}</Sans>
      <Sans style={s.call}>{step.call.replaceAll('belcanto', 'dewakan').replaceAll('lisbon', 'kuala_lumpur').replaceAll('galeria_madragoa', 'ilham_gallery')}</Sans>
      <Sans style={s.result}>{step.result.replace('Santa Catarina closed', 'storm window detected')} · {step.ms}ms</Sans>
    </Card>; })}
  </ScrollView>;

  return <ScrollView style={s.flex} contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
    <View><Serif style={s.title}>Explore Kuala Lumpur</Serif><Sans style={s.sub}>Ideas for tonight, picked for you ✨</Sans></View>
    <Pressable onPress={() => setQuest(0)}>
      <ImageBackground source={require('../../assets/explore/kl-rain-route.png')} style={s.gameCard} imageStyle={s.gameImage}>
        <View style={s.gameShade}><View><Kicker style={s.gameKicker}>Mall escape · 3 checkpoints</Kicker><Serif style={s.gameTitle}>The KL Code</Serif><Sans style={s.gameText}>Explore malls. Crack clues. Unlock KL.</Sans></View><View style={s.play}><Sans style={s.playIcon}>▶</Sans></View></View>
      </ImageBackground>
    </Pressable>
    <ImageBackground source={require('../../assets/explore/kl-hero.png')} style={s.hero} imageStyle={s.heroImage}>
      <View style={s.heroCopy}><Serif style={s.heroTitle}>Detour is watching over KL for you 👀</Serif><Sans style={s.heroText}>We find what is worth your time, so you can enjoy the moment.</Sans><View style={s.status}><PulseDot size={7} /><Sans style={s.statusText}>Keeping things up to date</Sans></View></View>
    </ImageBackground>
    <Card radius={24} style={s.stats}>{[['✦', '18', 'new detours'], ['♥', '4', 'saved'], ['↻', '7', 'updated']].map(([icon, value, label]) => <View key={label} style={s.stat}><Sans style={s.statIcon}>{icon}</Sans><View><Sans style={s.statValue}>{value}</Sans><Sans style={s.statLabel}>{label}</Sans></View></View>)}</Card>
    <Button label={refreshing ? 'Detour is looking...' : "✦  Find more detours"} onPress={() => { void discover(); }} />
    {visible.map((card, i) => <Pressable key={card.id} onPress={() => onOpen(card.id)}><Card radius={22} style={s.findCard}>
      <Image source={cardImage(card)} style={s.thumb} /><View style={s.findCopy}><Serif style={s.findTitle}>{card.title.split(',')[0]}</Serif><Sans style={s.findMeta} numberOfLines={2}>{card.meta}</Sans><View style={s.findFoot}><Pill text={`${card.match}% for you`} tone={i === 2 ? 'blue' : 'green'} /><Sans style={s.distance}>{i === 0 ? '11' : i === 1 ? '8' : '12'} min away</Sans></View></View>
    </Card></Pressable>)}
    <Pressable style={s.workflowLink} onPress={() => setWorkflow(true)}><PulseDot size={7} /><Sans style={s.workflowText}>{scanned.toLocaleString('en-US')} signals watched · See the agent workflow →</Sans></Pressable>
  </ScrollView>;
}

const s = StyleSheet.create({
  flex: { flex: 1 }, scroll: { padding: 22, paddingTop: 12, paddingBottom: 30, gap: 14 }, title: { fontSize: 29, lineHeight: 34 }, sub: { color: C.sub, fontSize: 13.5 },
  gameCard: { height: 150, borderRadius: 24, overflow: 'hidden', justifyContent: 'flex-end' }, gameImage: { borderRadius: 24 }, gameShade: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', padding: 17, backgroundColor: 'rgba(13,23,30,.48)' }, gameKicker: { color: '#bce8d1' }, gameTitle: { color: '#fff', fontSize: 24, lineHeight: 28 }, gameText: { color: '#e8f2ef', fontSize: 11.5 }, play: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }, playIcon: { color: C.ink, fontSize: 13, marginLeft: 2 },
  questPage: { padding: 22, paddingTop: 12, paddingBottom: 34, gap: 13 }, questTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, questName: { fontSize: 28, lineHeight: 32 }, progress: { flexDirection: 'row', gap: 6 }, progressBar: { flex: 1, height: 5, borderRadius: 3, backgroundColor: C.hairline }, progressDone: { backgroundColor: C.green }, progressNow: { backgroundColor: C.blue }, questHero: { height: 245, borderRadius: 26, overflow: 'hidden', justifyContent: 'flex-end' }, questHeroImage: { borderRadius: 26 }, questShade: { padding: 15, flexDirection: 'row', alignItems: 'center', gap: 9, backgroundColor: 'rgba(12,20,27,.42)' }, questAgent: { width: 42, height: 42, borderRadius: 14, backgroundColor: 'rgba(255,255,255,.9)', alignItems: 'center', justifyContent: 'center' }, questPlace: { color: '#fff', fontSize: 10.5 }, questCard: { padding: 17, gap: 10 }, questTitle: { fontSize: 23, lineHeight: 26 }, questClue: { color: C.sub, fontSize: 13, lineHeight: 19 }, answerList: { gap: 7 }, answer: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 11, borderRadius: 14, backgroundColor: C.footer, borderWidth: 1, borderColor: 'transparent' }, answerWrong: { backgroundColor: '#fff0ef', borderColor: '#e2564a' }, answerCorrect: { backgroundColor: C.chipGreen, borderColor: C.green }, answerLetter: { width: 25, height: 25, borderRadius: 13, textAlign: 'center', paddingTop: 4, backgroundColor: '#fff', color: C.blue, fontFamily: F.bold, fontSize: 11 }, answerLetterCorrect: { backgroundColor: C.green, color: '#fff' }, answerText: { color: C.ink, fontFamily: F.med, fontSize: 12 }, answerTextCorrect: { color: C.chipGreenInk }, answerHint: { color: C.faint, fontSize: 10.5, textAlign: 'center' }, answerHintWrong: { color: '#b9483f' }, completeCard: { marginTop: 90, padding: 25, alignItems: 'center', gap: 11 }, completeIcon: { width: 62, height: 62, borderRadius: 31, backgroundColor: C.chipGreen, alignItems: 'center', justifyContent: 'center' }, completeTick: { color: C.green, fontFamily: F.bold, fontSize: 30 }, completeTitle: { textAlign: 'center', fontSize: 27, lineHeight: 31 }, completeCopy: { textAlign: 'center', color: C.sub, lineHeight: 19, marginBottom: 7 },
  hero: { height: 190, justifyContent: 'center', overflow: 'hidden', borderRadius: 26 }, heroImage: { borderRadius: 26 }, heroCopy: { width: '66%', marginLeft: 18, gap: 9 }, heroTitle: { fontSize: 22, lineHeight: 27 }, heroText: { color: C.body, lineHeight: 19 }, status: { backgroundColor: 'rgba(255,255,255,.9)', borderRadius: 12, padding: 10, flexDirection: 'row', alignItems: 'center', gap: 8 }, statusText: { color: C.sub, fontSize: 11 },
  stats: { flexDirection: 'row', paddingVertical: 14, paddingHorizontal: 10 }, stat: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 7 }, statIcon: { fontSize: 20, color: C.blue }, statValue: { fontFamily: F.med, fontSize: 19 }, statLabel: { color: C.faint, fontSize: 9.5 },
  findCard: { padding: 9, flexDirection: 'row', gap: 12, alignItems: 'center' }, thumb: { width: 112, height: 94, borderRadius: 15 }, findCopy: { flex: 1, gap: 5 }, findTitle: { fontSize: 16.5, lineHeight: 19 }, findMeta: { color: C.sub, fontSize: 11, lineHeight: 15 }, findFoot: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, distance: { color: C.faint, fontSize: 9.5 }, workflowLink: { padding: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }, workflowText: { color: C.blue, fontFamily: F.med, fontSize: 11 },
  workflow: { padding: 22, paddingTop: 12, paddingBottom: 30, gap: 10 }, back: { color: C.blue, marginBottom: 4 }, weather: { color: C.blue, textAlign: 'center', fontSize: 11 }, agentGrid: { gap: 8 }, agentRow: { padding: 11, flexDirection: 'row', alignItems: 'center', gap: 10 }, agentCopy: { flex: 1 }, agentName: { fontFamily: F.med }, access: { color: C.faint, fontSize: 10 }, traceHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }, section: { fontSize: 19 }, traceCard: { padding: 12, gap: 5 }, traceTop: { flexDirection: 'row', alignItems: 'center', gap: 8 }, time: { marginLeft: 'auto', color: C.faint, fontSize: 10 }, phase: { fontFamily: F.bold, fontSize: 9, letterSpacing: 1 }, call: { backgroundColor: C.chip, borderRadius: 8, padding: 7, fontFamily: F.med, fontSize: 11 }, result: { color: C.sub, fontSize: 10.5 },
});
