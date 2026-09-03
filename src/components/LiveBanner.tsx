import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, View } from 'react-native';
import { PixelAgent } from '../icons';
import { BY_ID } from '../data';
import { Kicker, Sans } from '../ui';
import { C } from '../theme';
const liveAgent = BY_ID.news;

/** Slide-down live notification over the feed. */
export function LiveBanner({ onPress }: { onPress: () => void }) {
  const y = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    y.setValue(0);
    Animated.timing(y, {
      toValue: 1,
      duration: 450,
      easing: Easing.bezier(0.2, 0.9, 0.2, 1),
      useNativeDriver: true,
    }).start();
  }, [y]);

  const translateY = y.interpolate({ inputRange: [0, 1], outputRange: [-80, 0] });

  return (
    <Animated.View style={[s.wrap, { opacity: y, transform: [{ translateY }] }]}>
      <Pressable style={s.row} onPress={onPress}>
        <View style={s.icon}>
          <PixelAgent variant={liveAgent.variant} color={liveAgent.color} size={36} />
        </View>
        <View style={s.copy}>
          <Kicker style={s.kicker}>Live trip rescue · Weather agent</Kicker>
          <Sans style={s.body}>Storm at 18:40. Detour found a better way through tonight.</Sans>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  wrap: {
    position: 'absolute',
    top: 50,
    left: 12,
    right: 12,
    zIndex: 5,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    shadowColor: 'rgba(31,58,102,.2)',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 1,
    shadowRadius: 34,
    elevation: 8,
    padding: 14,
  },
  row: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  icon: { flexShrink: 0 },
  copy: { flex: 1, flexDirection: 'column', gap: 3, minWidth: 0 },
  kicker: { fontSize: 10.5, letterSpacing: 0.06 * 10.5 },
  body: { fontSize: 13.5, lineHeight: 13.5 * 1.4, color: C.ink },
});
