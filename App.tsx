import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StatusBar as RNStatusBar, StyleSheet, useWindowDimensions, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useFonts, DMSans_400Regular, DMSans_500Medium, DMSans_700Bold } from '@expo-google-fonts/dm-sans';
import { Newsreader_400Regular, Newsreader_500Medium } from '@expo-google-fonts/newsreader';

import { BACKDROP, C } from './src/theme';
import { cardsFor, Destination } from './src/data';
import { HomeIndicator, StatusBar, TabBar } from './src/components/Chrome';
import { LiveBanner } from './src/components/LiveBanner';
import { Feed } from './src/screens/Feed';
import { Detail } from './src/screens/Detail';
import { Confirm } from './src/screens/Confirm';
import { Swarm } from './src/screens/Swarm';
import { Trips } from './src/screens/Trips';
import { Profile } from './src/screens/Profile';
import { AskScout } from './src/screens/AskScout';
import { Splash, IntroPager, HeadingOut } from './src/screens/onboarding/Intro';
import { Questions } from './src/screens/onboarding/Questions';
import { runDemoPipeline, TRACE } from './src/agentRuntime';
import { Arrival, Place } from './src/screens/Arrival';

/** Where the feed tab is: its own little stack. */
type FeedStep = 'feed' | 'detail' | 'confirm';
type EntryStep = 'splash' | 'intro' | 'arrival' | 'questions' | 'heading' | 'app';
type DemoStatus = 'idle' | 'running' | 'surfaced';

const HOLD_SECONDS = 598;   // the 10-minute hold, two seconds already spent
const BANNER_FOR = 7000;    // how long it sits before retracting
const BANNER_EVERY = 40000; // and it comes back, so a demo can be picked up cold
const PHONE = { w: 390, h: 812 };

export default function App() {
  const [loaded] = useFonts({
    DMSans_400Regular, DMSans_500Medium, DMSans_700Bold,
    Newsreader_400Regular, Newsreader_500Medium,
  });

  const [tab, setTab] = useState('Feed');
  const [entry, setEntry] = useState<EntryStep>('splash');
  const [step, setStep] = useState<FeedStep>('feed');
  const [asking, setAsking] = useState(false);
  const [arrival, setArrival] = useState<Place | null>(null);
  const [destination, setDestination] = useState<Destination>('malaysia');
  const [selId, setSelId] = useState('belcanto');
  const [seconds, setSeconds] = useState(HOLD_SECONDS);
  const [banner, setBanner] = useState(false);
  const [demoStatus, setDemoStatus] = useState<DemoStatus>('idle');
  const [demoStep, setDemoStep] = useState(0);
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [confirmed, setConfirmed] = useState<string[]>([]);
  const [missionStart, setMissionStart] = useState(false);

  useEffect(() => {
    if (entry !== 'app' || demoStatus !== 'surfaced') return;
    const tick = setInterval(() => setSeconds(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(tick);
  }, [entry, demoStatus]);

  useEffect(() => {
    if (demoStatus !== 'running') return;
    const tick = setInterval(() => {
      setDemoStep(n => {
        if (n < TRACE.length) return n + 1;
        clearInterval(tick);
        setDemoStatus('surfaced');
        setBanner(true);
        return n;
      });
    }, 900);
    return () => clearInterval(tick);
  }, [demoStatus]);

  /**
   * Once the controlled signal surfaces, repeat the push so the demo can be
   * picked up cold without inventing a second event.
   */
  useEffect(() => {
    if (entry !== 'app' || demoStatus !== 'surfaced') return;
    let hide: ReturnType<typeof setTimeout>;
    const push = () => {
      setBanner(true);
      hide = setTimeout(() => setBanner(false), BANNER_FOR);
    };
    const again = setInterval(push, BANNER_EVERY);
    return () => { clearTimeout(hide); clearInterval(again); };
  }, [entry, demoStatus]);

  const { width, height } = useWindowDimensions();
  /** Desktop gets the design's phone frame; a real handset runs full-bleed. */
  const framed = width > PHONE.w + 60;
  const frameH = Math.min(PHONE.h, height - 48);

  const cards = useMemo(() => cardsFor(destination), [destination]);
  const sel = useMemo(() => cards.find(c => c.id === selId) ?? cards[0], [cards, selId]);
  const countdown = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

  const open = useCallback((id: string) => {
    setSelId(id); setBanner(false); setAsking(false); setTab('Feed'); setStep('detail');
  }, []);
  const back = useCallback(() => setStep('feed'), []);

  const triggerDemo = useCallback(async () => {
    if (demoStatus === 'running') return;
    setBanner(false);
    setSeconds(HOLD_SECONDS);
    setDemoStep(0);
    const cardId = await runDemoPipeline();
    if (cardId) setDemoStatus('running');
  }, [demoStatus]);

  if (!loaded) return <View style={s.fill} />;

  const mainBody = arrival ? (
    <Arrival
      place={arrival}
      onAccept={() => { setDestination(arrival); setArrival(null); setTab('Explore'); setDemoStatus('surfaced'); }}
      onKeep={() => setArrival(null)}
    />
  ) : asking ? (
    <AskScout cards={cards} destination={destination} onClose={() => setAsking(false)} />
  ) : tab === 'Explore' ? <Swarm destination={destination} cards={cards} status={demoStatus} shown={TRACE.slice(0, demoStep)} onTrigger={() => { void triggerDemo(); }} onOpen={open} />
    : tab === 'Trips' ? <Trips destination={destination} confirmed={confirmed.includes('belcanto')} missionStart={missionStart} onMissionConsumed={() => setMissionStart(false)} />
    : tab === 'Profile' ? <Profile onPreviewArrival={setArrival} />
    : step === 'detail' ? (
      <Detail
        card={sel}
        countdown={countdown}
        onBack={back}
        onConfirm={() => { setConfirmed(ids => ids.includes(sel.id) ? ids : ids.concat(sel.id)); setStep('confirm'); }}
        onDismiss={() => { setDismissed(d => d.concat(sel.id)); back(); }}
        onSeeWorkflow={() => { setStep('feed'); setTab('Explore'); }}
      />
    )
    : step === 'confirm' ? <Confirm card={sel} destination={destination} onBack={() => { setStep('feed'); setTab('Trips'); }} />
    : <Feed onOpen={open} onAsk={() => setAsking(true)} dismissed={dismissed} liveReady={demoStatus === 'surfaced'} cards={cards} destination={destination} />;

  const onboarding = entry === 'splash'
    ? <Splash onStart={() => setEntry('intro')} onSkip={() => setEntry('arrival')} />
    : entry === 'intro'
      ? <IntroPager onDone={() => setEntry('arrival')} />
      : entry === 'arrival'
        ? <Arrival place="malaysia" onAccept={() => setEntry('questions')} onKeep={() => setEntry('questions')} />
      : entry === 'questions'
        ? <Questions onDone={() => setEntry('heading')} />
        : <HeadingOut onDone={() => { setEntry('app'); setTab('Explore'); void triggerDemo(); }} />;

  const showBanner = entry === 'app' && banner && !asking && step === 'feed';

  const app = (
    <>
      {framed && entry === 'app' && <StatusBar />}
      {entry === 'app' ? mainBody : onboarding}
      {entry === 'app' && !arrival && (
        <TabBar
          active={tab}
          onSelect={(label) => { setAsking(false); setStep('feed'); setTab(label); }}
        />
      )}
      {framed && entry === 'app' && !arrival && <HomeIndicator />}
      {showBanner && <LiveBanner onPress={() => { setBanner(false); setMissionStart(true); setStep('feed'); setTab('Trips'); }} />}
    </>
  );

  if (framed) {
    return (
      <SafeAreaProvider>
        <LinearGradient colors={[...BACKDROP]} style={s.stage}>
          <LinearGradient colors={['#ffffff', C.phone]} style={[s.phone, { width: PHONE.w, height: frameH }]}>
            {app}
          </LinearGradient>
        </LinearGradient>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <LinearGradient colors={['#ffffff', C.phone]} style={s.fill}>
        <RNStatusBar barStyle="dark-content" />
        <SafeAreaView style={s.fill} edges={['top', 'bottom']}>{app}</SafeAreaView>
      </LinearGradient>
    </SafeAreaProvider>
  );
}

const s = StyleSheet.create({
  fill: { flex: 1 },
  stage: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  phone: {
    borderRadius: 46, overflow: 'hidden',
    shadowColor: '#1f3a66', shadowOpacity: 0.18, shadowRadius: 70,
    shadowOffset: { width: 0, height: 30 }, elevation: 20,
  },
});
