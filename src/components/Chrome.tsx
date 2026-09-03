import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { Icon, P } from '../icons';
import { Costumed } from '../art';
import { TABS } from '../data';
import { C, F } from '../theme';

/** Faux iOS status bar: only drawn inside the desktop phone frame. */
export const StatusBar = () => (
  <View style={s.status}>
    <Text style={s.time}>9:41</Text>
    <View style={s.icons}>
      <Svg width={16} height={12} viewBox="0 0 18 12">
        {[[0, 8, 4], [5, 5.5, 6.5], [10, 3, 9], [15, 0, 12]].map(([x, y, h]) => (
          <Rect key={x} x={x} y={y} width={3} height={h} rx={1} fill={C.ink} />
        ))}
      </Svg>
      <Svg width={15} height={12} viewBox="0 0 256 200">
        <Path fill={C.ink} d="M128 160a16 16 0 1 1-16 16 16 16 0 0 1 16-16Zm0-48a72 72 0 0 1 51 21 12 12 0 0 0 17-17 96 96 0 0 0-136 0 12 12 0 0 0 17 17 72 72 0 0 1 51-21Zm0-48a120 120 0 0 1 85 35 12 12 0 0 0 17-17 144 144 0 0 0-204 0 12 12 0 0 0 17 17 120 120 0 0 1 85-35Z" />
      </Svg>
      <View style={s.battery}><View style={s.batteryFill} /></View>
    </View>
  </View>
);

export const HomeIndicator = () => (
  <View style={s.homeWrap}><View style={s.home} /></View>
);

export const TabBar = ({ active, onSelect }:
  { active: string; onSelect: (label: string) => void }) => (
  <View style={s.tabs}>
    {TABS.map((tab) => {
      const isActive = tab.label === active;
      return (
        <Pressable key={tab.label} style={s.tab} onPress={() => onSelect(tab.label)}>
          {tab.label === 'Profile'
            ? <View style={{ opacity: isActive ? 1 : 0.55 }}><Costumed kind="malaysia" size={22} /></View>
            : <Icon d={P[tab.icon]} size={20} color={isActive ? C.ink : C.faint} opacity={isActive ? 1 : 0.55} />}
          <Text style={[s.tabLabel, isActive && s.tabActive]}>{tab.label}</Text>
        </Pressable>
      );
    })}
  </View>
);

const s = StyleSheet.create({
  status: { height: 42, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between',
    paddingHorizontal: 26, paddingBottom: 6 },
  time: { fontFamily: F.med, fontSize: 13, color: C.ink },
  icons: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  battery: { width: 22, height: 11, borderWidth: 1.4, borderColor: C.ink, borderRadius: 3, padding: 1.6 },
  batteryFill: { flex: 1, backgroundColor: C.ink, borderRadius: 1.5 },
  homeWrap: { alignItems: 'center', paddingBottom: 9, backgroundColor: C.card },
  home: { width: 134, height: 5, borderRadius: 3, backgroundColor: C.ink },

  tabs: { flexDirection: 'row', backgroundColor: C.card, paddingTop: 12, paddingBottom: 10,
    borderTopWidth: 1, borderTopColor: C.hairlineSoft },
  tab: { flex: 1, alignItems: 'center', gap: 4 },
  tabLabel: { fontFamily: F.sans, fontSize: 11, color: C.faint },
  tabActive: { fontFamily: F.bold, color: C.ink },

});
