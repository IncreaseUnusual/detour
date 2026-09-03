import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { C, F } from '../../theme';
import { Serif, Sans, Kicker, Button } from '../../ui';
import { PixelAgent } from '../../icons';
import { Sticker, StickerKind } from '../../art';

export type Answers = {
  tastes: string[];
  dial: number; // 1..10
  ceiling: string; // '60' | '200' | '500' | 'ask'
  perms: { free: boolean; hold: boolean; book: boolean; move: boolean };
};

const TASTE_OPTIONS: { id: string; label: string; art: StickerKind }[] = [
  { id: 'tasting', label: 'Chef tasting menus', art: 'mug' },
  { id: 'art', label: 'Contemporary art', art: 'book' },
  { id: 'walks', label: 'Long walks, no plan', art: 'boots' },
  { id: 'music', label: 'Live music, small rooms', art: 'guitar' },
  { id: 'markets', label: 'Markets and makers', art: 'flower' },
  { id: 'late', label: 'Late nights', art: 'disco' },
];

const DIAL_WORDS = [
  'Nothing unasked', 'Barely', 'Cautious', 'Gentle', 'Open',
  'Curious', 'Adventurous', 'Bold', 'Reckless', 'Anything remarkable',
];

const CEILING_OPTIONS: { id: string; label: string; note: string; art: StickerKind }[] = [
  { id: '60', label: 'Up to RM250', note: 'Coffees, entries, small plates', art: 'coin' },
  { id: '200', label: 'Up to RM800', note: 'A dinner for two, a private view', art: 'mushroom' },
  { id: '500', label: 'Up to RM2,000', note: 'A private day or tasting with wine', art: 'compass' },
  { id: 'ask', label: 'Always ask me', note: 'I’ll hold things, never commit', art: 'owl' },
];

const PERM_ROWS: { id: keyof Answers['perms']; label: string; note: string }[] = [
  { id: 'free', label: 'Add anything free', note: 'Openings, markets, viewpoints' },
  { id: 'hold', label: 'Hold a table or a seat', note: 'Reversible, nothing charged' },
  { id: 'book', label: 'Book inside the ceiling', note: 'Charges my card up to RM800' },
  { id: 'move', label: 'Reshuffle my day', note: 'Shuffle stops to fit something good' },
];

export function Questions({ onDone }: { onDone: (a: Answers) => void }) {
  const [step, setStep] = useState(0);
  const [tastes, setTastes] = useState<string[]>(['tasting', 'art']);
  const [dial, setDial] = useState(6);
  const [ceiling, setCeiling] = useState('200');
  const [perms, setPerms] = useState<Answers['perms']>({ free: true, hold: true, book: false, move: false });

  const toggleTaste = (id: string) => {
    setTastes((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]));
  };

  const togglePerm = (id: keyof Answers['perms']) => {
    setPerms((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const next = () => {
    if (step < 3) setStep(step + 1);
    else onDone({ tastes, dial, ceiling, perms });
  };

  return (
    <View style={s.flex}>
      <View style={s.topBar}>
        <Sans style={s.time}>9:41</Sans>
        <Sans style={s.stepCount}>{step + 1} of 4</Sans>
      </View>

      <ScrollView
        style={s.flex}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.body}
      >
        {step === 0 && (
          <>
            <View style={s.heading}>
              <Kicker style={s.kicker}>Taste profile</Kicker>
              <Serif style={s.title}>What would make this trip?</Serif>
              <Sans style={s.sub}>Pick whatever rings true. I&apos;ll weigh everything I find against these.</Sans>
            </View>
            <View style={s.grid}>
              {TASTE_OPTIONS.map((o) => {
                const selected = tastes.includes(o.id);
                return (
                  <Pressable
                    key={o.id}
                    onPress={() => toggleTaste(o.id)}
                    style={[s.tasteCell, selected ? s.tasteCellOn : s.tasteCellOff]}
                  >
                    <Sticker kind={o.art} size={40} />
                    <Sans style={s.tasteLabel}>{o.label}</Sans>
                  </Pressable>
                );
              })}
            </View>
          </>
        )}

        {step === 1 && (
          <>
            <View style={s.heading}>
              <Kicker style={s.kicker}>How adventurous?</Kicker>
              <Serif style={s.title}>How much should I surprise you?</Serif>
            </View>
            <View style={s.dialPanel}>
              <PixelAgent
                variant={dial > 6 ? 'ears' : 'brim'}
                color={dial > 6 ? '#7c6fd0' : '#d99a2b'}
                size={76}
              />
              <Serif style={s.dialWord}>{DIAL_WORDS[dial - 1]}</Serif>
              <View style={s.dialRow}>
                {Array.from({ length: 10 }).map((_, i) => (
                  <Pressable
                    key={i}
                    onPress={() => setDial(i + 1)}
                    style={[s.dialBar, { backgroundColor: i < dial ? '#6fa8dc' : '#e4ecf3' }]}
                  />
                ))}
              </View>
              <View style={s.dialLabels}>
                <Sans style={s.dialLabelText}>Only what I asked for</Sans>
                <Sans style={s.dialLabelText}>Anything remarkable</Sans>
              </View>
            </View>
            <Sans style={s.dialBody}>
              {dial >= 8
                ? 'At this setting I’ll bring you things well outside your usual pattern, a one-night rooftop, a boat leaving in an hour, as long as they fit your ceiling.'
                : dial <= 3
                ? 'I’ll stay close to what you asked for and only tap you when something you’ve booked changes.'
                : 'I’ll keep to things near your taste and only interrupt when something probably won’t hang around.'}
            </Sans>
          </>
        )}

        {step === 2 && (
          <>
            <View style={s.heading}>
              <Kicker style={s.kicker}>Spend ceiling</Kicker>
              <Serif style={s.title}>How far can I go without asking?</Serif>
              <Sans style={s.sub}>Anything above this and I&apos;ll ask you first instead of grabbing it.</Sans>
            </View>
            <View style={s.ceilingList}>
              {CEILING_OPTIONS.map((o) => {
                const selected = ceiling === o.id;
                return (
                  <Pressable
                    key={o.id}
                    onPress={() => setCeiling(o.id)}
                    style={[s.ceilingRow, selected ? s.tasteCellOn : s.tasteCellOff]}
                  >
                    <Sticker kind={o.art} size={38} />
                    <View style={s.ceilingCopy}>
                      <Sans style={s.ceilingLabel}>{o.label}</Sans>
                      <Sans style={s.ceilingNote}>{o.note}</Sans>
                    </View>
                    <View style={[s.radio, selected ? s.radioOn : s.radioOff]} />
                  </Pressable>
                );
              })}
            </View>
          </>
        )}

        {step === 3 && (
          <>
            <View style={s.heading}>
              <Kicker style={s.kicker}>Standing permissions</Kicker>
              <Serif style={s.title}>When can I just go ahead?</Serif>
            </View>
            <View style={s.permList}>
              {PERM_ROWS.map((r) => (
                <PermRow key={r.id} label={r.label} note={r.note} on={perms[r.id]} onToggle={() => togglePerm(r.id)} />
              ))}
            </View>
            <Sans style={s.footnote}>
              Whatever I do lands in your feed with its source. Nothing happens off the record.
            </Sans>
          </>
        )}
      </ScrollView>

      <View style={s.footer}>
        {step === 0 && (
          <View style={s.step0Footer}>
            <Sans style={s.selectedCount}>{tastes.length} selected</Sans>
            <View style={s.fullWidth}>
              <Button label="Continue" onPress={next} />
            </View>
          </View>
        )}
        {step === 1 && (
          <View style={s.fullWidth}>
            <Button label="Continue" onPress={next} />
          </View>
        )}
        {step === 2 && (
          <View style={s.fullWidth}>
            <Button label="Continue" onPress={next} />
          </View>
        )}
        {step === 3 && (
          <View style={s.fullWidth}>
            <Button label="Go have a look" onPress={next} />
          </View>
        )}
      </View>
    </View>
  );
}

function PermRow({ label, note, on, onToggle }:
  { label: string; note: string; on: boolean; onToggle: () => void }) {
  const anim = useRef(new Animated.Value(on ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, { toValue: on ? 1 : 0, duration: 180, useNativeDriver: true }).start();
  }, [on, anim]);

  const translateX = anim.interpolate({ inputRange: [0, 1], outputRange: [0, 18] });

  return (
    <Pressable onPress={onToggle} style={s.permRow}>
      <View style={s.permCopy}>
        <Sans style={s.permLabel}>{label}</Sans>
        <Sans style={s.permNote}>{note}</Sans>
      </View>
      <View style={[s.switchTrack, { backgroundColor: on ? C.green : '#dfe5ec' }]}>
        <Animated.View style={[s.switchKnob, { transform: [{ translateX }] }]} />
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  flex: { flex: 1 },
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
  body: {
    paddingTop: 14,
    paddingHorizontal: 24,
    paddingBottom: 20,
    gap: 20,
  },
  footer: { paddingHorizontal: 24, paddingBottom: 34 },
  heading: { gap: 8 },
  kicker: { fontSize: 11, letterSpacing: 1.3 },
  title: { fontSize: 26, lineHeight: 31 },
  sub: { fontSize: 13.5, lineHeight: 20, color: C.sub },

  fullWidth: { flexDirection: 'row', alignSelf: 'stretch' },

  /* step 1 */
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  tasteCell: {
    width: '48%',
    borderRadius: 20,
    padding: 14,
    minHeight: 104,
    flexDirection: 'column',
    gap: 12,
    justifyContent: 'space-between',
  },
  tasteCellOn: {
    backgroundColor: '#eaf3fb',
    borderWidth: 2,
    borderColor: C.ink2,
  },
  tasteCellOff: {
    backgroundColor: C.card,
    borderWidth: 2,
    borderColor: 'rgba(27,31,36,.07)',
  },
  tasteLabel: { fontFamily: F.med, fontSize: 13.5, lineHeight: 17, color: C.ink },
  step0Footer: { flexDirection: 'column', gap: 14, alignItems: 'center' },
  selectedCount: { fontFamily: F.sans, fontSize: 12, color: C.faint },

  /* step 2 */
  dialPanel: {
    backgroundColor: '#f3f8fc',
    borderRadius: 26,
    padding: 20,
    flexDirection: 'column',
    gap: 18,
    alignItems: 'center',
  },
  dialWord: { fontSize: 22 },
  dialRow: { flexDirection: 'row', gap: 6, alignSelf: 'stretch' },
  dialBar: { flex: 1, height: 38, borderRadius: 8 },
  dialLabels: { flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'stretch' },
  dialLabelText: { fontFamily: F.sans, fontSize: 11.5, color: C.faint },
  dialBody: { fontFamily: F.sans, fontSize: 13.5, lineHeight: 21, color: C.sub },

  /* step 3 */
  ceilingList: { flexDirection: 'column', gap: 10 },
  ceilingRow: {
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  ceilingCopy: { flex: 1, flexDirection: 'column', gap: 2 },
  ceilingLabel: { fontFamily: F.med, fontSize: 15, color: C.ink },
  ceilingNote: { fontFamily: F.sans, fontSize: 12, color: C.sub },
  radio: { width: 20, height: 20, borderRadius: 10, flexShrink: 0 },
  radioOn: { backgroundColor: C.ink2 },
  radioOff: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: '#cfd6de' },

  /* step 4 */
  permList: { flexDirection: 'column', gap: 10 },
  permRow: {
    backgroundColor: C.card,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(27,31,36,.06)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  permCopy: { flex: 1, flexDirection: 'column', gap: 3 },
  permLabel: { fontFamily: F.med, fontSize: 14.5, lineHeight: 19, color: C.ink },
  permNote: { fontFamily: F.sans, fontSize: 12, lineHeight: 17, color: C.sub },
  switchTrack: {
    width: 46,
    height: 28,
    borderRadius: 14,
    padding: 3,
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
  },
  switchKnob: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#ffffff',
    shadowColor: C.ink,
    shadowOpacity: 0.25,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  footnote: { fontFamily: F.sans, fontSize: 12.5, lineHeight: 19, color: C.faint },
});
