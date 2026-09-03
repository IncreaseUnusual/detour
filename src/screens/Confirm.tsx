import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, KV, Sans, Serif, Button } from '../ui';
import { Icon, P } from '../icons';
import { C, F } from '../theme';
import type { Card as CardType, Destination } from '../data';

export function Confirm({ card, destination, onBack }:
  { card: CardType; destination: Destination; onBack: () => void }) {
  const place = destination === 'malaysia' ? 'Kuala Lumpur' : destination === 'texas' ? 'Austin' : 'Lisbon';
  return (
    <View style={s.wrap}>
      <View style={s.head}>
        <View style={s.badge}>
          <Icon d={P.check} size={22} color={C.card} />
        </View>
        <Serif style={s.title}>{card.confirmTitle}</Serif>
        <Sans style={s.body}>{card.confirmBody}</Sans>
      </View>

      <Card radius={24} style={s.summary}>
        <KV k="Added to" v={card.when} />
        <KV k="Cited source" v={card.source} />
        <KV k="Agents" v={`still running · ${place}`} />
      </Card>

      <View style={{ flexDirection: 'row' }}>
        <Button label="See updated trip" onPress={onBack} />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, minHeight: 0, justifyContent: 'center', gap: 22, padding: 24 },
  head: { gap: 12, alignItems: 'flex-start' },
  badge: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center',
    backgroundColor: C.green },
  title: { fontFamily: F.serif, fontSize: 30, lineHeight: 34 },
  body: { fontFamily: F.sans, fontSize: 13.5, lineHeight: 21, color: C.sub },
  summary: { padding: 16, gap: 8 },
});
