import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Costumed } from '../art';
import { C, F } from '../theme';
import { Serif, Sans, Card, Pill, Button } from '../ui';
import type { Place } from './Arrival';

const AUTONOMY: { what: string; state: 'automatic' | 'asks first' | 'never' }[] = [
  { what: 'Add free, non-committal items', state: 'automatic' },
  { what: 'Hold a table or a seat', state: 'asks first' },
  { what: 'Spend up to RM800 spontaneously', state: 'asks first' },
  { what: 'Cancel or move a booked item', state: 'never' },
  { what: 'Message a venue on your behalf', state: 'asks first' },
];

const AUTONOMY_TONE = { automatic: 'green', 'asks first': 'blue', never: 'grey' } as const;

const TASTE: [string, number][] = [
  ['Chef tasting menus', 0.94],
  ['Contemporary art', 0.81],
  ['Small-format dining', 0.77],
  ['Live music, late', 0.62],
  ['Crowded landmarks', 0.18],
];

export function Profile({ onPreviewArrival }: { onPreviewArrival: (place: Place) => void }) {
  const [policies, setPolicies] = useState(AUTONOMY);
  const [openPolicy, setOpenPolicy] = useState<number | null>(null);
  return (
    <ScrollView style={s.flex} showsVerticalScrollIndicator={false}>
      <View style={s.header}>
        <View style={s.avatar}>
          <Costumed kind="malaysia" size={42} />
        </View>
        <View style={s.headerCopy}>
          <Serif style={s.name}>Elena</Serif>
          <Sans style={s.sub}>Your team has been active since Tuesday</Sans>
        </View>
      </View>

      <View style={s.demoSection}>
        <Serif style={s.sectionTitle}>See Detour adapt</Serif>
        <Sans style={s.demoCopy}>Choose a country to preview the local outfit, icon, and agent roster.</Sans>
        <View style={s.demoButtons}>
          <Button label="Malaysia" onPress={() => onPreviewArrival('malaysia')} />
          <Button label="Texas" tone="grey" onPress={() => onPreviewArrival('texas')} />
        </View>
      </View>

      <View style={s.section}>
        <Serif style={s.sectionTitle}>What Detour may do alone</Serif>
        <Card radius={24} style={s.autonomyCard}>
          {policies.map((row, i) => (
            <View key={row.what} style={i < policies.length - 1 && s.rowBorder}>
              <View style={s.autonomyRow}>
                <Sans style={s.autonomyWhat}>{row.what}</Sans>
                <Pressable onPress={() => setOpenPolicy(openPolicy === i ? null : i)}>
                  <Pill text={`${row.state}⌄`} tone={AUTONOMY_TONE[row.state]} />
                </Pressable>
              </View>
              {openPolicy === i && <View style={s.policyMenu}>
                {(['automatic', 'asks first', 'never'] as const).map(state => (
                  <Pressable key={state} onPress={() => { setPolicies(items => items.map((item, n) => n === i ? { ...item, state } : item)); setOpenPolicy(null); }}>
                    <Pill text={state} tone={AUTONOMY_TONE[state]} />
                  </Pressable>
                ))}
              </View>}
            </View>
          ))}
        </Card>
      </View>

      <View style={s.section}>
        <Serif style={s.sectionTitle}>What it weights</Serif>
        <Card radius={24} style={s.tasteCard}>
          {TASTE.map(([label, w]) => (
            <View key={label} style={s.tasteRow}>
              <View style={s.tasteHead}>
                <Sans style={s.tasteLabel}>{label}</Sans>
                <Sans style={s.tasteValue}>{w.toFixed(2)}</Sans>
              </View>
              <View style={s.track}>
                <View style={[s.trackFill, { width: `${w * 100}%` }]} />
              </View>
            </View>
          ))}
          <Sans style={s.tasteFoot}>
            Learned from what you kept and dismissed. Adventure only surfaces thrills above your interrupt threshold.
          </Sans>
        </Card>
      </View>

      <View style={s.lastSection}>
        <Serif style={s.sectionTitle}>Interrupt threshold</Serif>
        <Card radius={24} style={s.thresholdCard}>
          <View style={s.thresholdHead}>
            <Sans style={s.thresholdValue}>0.85</Sans>
            <Sans style={s.thresholdCaption}>higher means quieter</Sans>
          </View>
          <View style={s.thresholdTrack}>
            <View style={s.thresholdFill} />
          </View>
          <Sans style={s.thresholdFoot}>
            Tonight the team scanned 1,284 signals, ranked 17 candidates and interrupted you once.
          </Sans>
        </Card>
      </View>

    </ScrollView>
  );
}

const s = StyleSheet.create({
  flex: { flex: 1 },

  header: { paddingTop: 14, paddingHorizontal: 22, paddingBottom: 0, flexDirection: 'row',
    alignItems: 'center', gap: 12 },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#e7eef6', overflow: 'hidden',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  headerCopy: { flex: 1, flexDirection: 'column', gap: 2 },
  name: { fontSize: 24 },
  sub: { fontSize: 12.5, color: C.sub },

  section: { paddingTop: 18, paddingHorizontal: 22, paddingBottom: 0, flexDirection: 'column', gap: 10 },
  lastSection: { paddingTop: 18, paddingHorizontal: 22, paddingBottom: 30, flexDirection: 'column', gap: 10 },
  demoSection: { paddingTop: 18, paddingHorizontal: 22, flexDirection: 'column', gap: 10 },
  demoCopy: { fontSize: 11.5, lineHeight: 17, color: C.sub },
  demoButtons: { flexDirection: 'row', gap: 10 },
  sectionTitle: { fontSize: 19 },

  autonomyCard: { padding: 4 },
  autonomyRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13, paddingHorizontal: 12 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: C.hairlineSoft },
  autonomyWhat: { flex: 1, fontFamily: F.med, fontSize: 13.5, color: C.ink },
  policyMenu: { flexDirection: 'row', gap: 7, paddingHorizontal: 12, paddingBottom: 12, justifyContent: 'flex-end' },

  tasteCard: { padding: 16, flexDirection: 'column', gap: 12 },
  tasteRow: { flexDirection: 'column', gap: 6 },
  tasteHead: { flexDirection: 'row', justifyContent: 'space-between' },
  tasteLabel: { fontFamily: F.med, fontSize: 12.5, color: C.ink },
  tasteValue: { fontFamily: F.med, fontSize: 11, color: C.faint, fontVariant: ['tabular-nums'] },
  track: { height: 6, borderRadius: 3, backgroundColor: C.chip },
  trackFill: { height: 6, borderRadius: 3, backgroundColor: C.blue },
  tasteFoot: { fontSize: 11, lineHeight: 17, color: C.faint },

  thresholdCard: { padding: 16, flexDirection: 'column', gap: 10 },
  thresholdHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  thresholdValue: { fontFamily: F.med, fontSize: 30, color: C.ink, fontVariant: ['tabular-nums'] },
  thresholdCaption: { fontSize: 11.5, color: C.faint },
  thresholdTrack: { height: 8, borderRadius: 4, backgroundColor: C.chip },
  thresholdFill: { width: '85%', height: 8, borderRadius: 4, backgroundColor: C.green },
  thresholdFoot: { fontSize: 11.5, lineHeight: 17, color: C.sub },
});
