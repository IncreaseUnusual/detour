import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, G, LinearGradient, Path, Polygon, Rect, Stop, Text } from 'react-native-svg';

export function MissionMap({ stage = 0 }: { stage?: number }) {
  return (
    <View
      accessibilityLabel="Live Kuala Lumpur route map"
      accessibilityRole="image"
      style={styles.shell}
    >
      <Svg width="100%" height="100%" viewBox="0 0 360 270">
        <Defs>
          <LinearGradient id="surface" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#17242d" />
            <Stop offset="1" stopColor="#0d171e" />
          </LinearGradient>
          <LinearGradient id="dry" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor="#48a8ff" />
            <Stop offset="1" stopColor="#57d49b" />
          </LinearGradient>
        </Defs>

        <Rect width="360" height="270" rx="24" fill="url(#surface)" />
        <Path d="M-15 226 C70 184 91 202 150 171 S269 129 376 86" fill="none" stroke="#203642" strokeWidth="26" />
        <Path d="M-15 226 C70 184 91 202 150 171 S269 129 376 86" fill="none" stroke="#49606b" strokeWidth="1.5" />

        <G fill="#1b2c35" stroke="#29404a" strokeWidth="1">
          <Rect x="20" y="25" width="43" height="25" rx="3" /><Rect x="73" y="19" width="31" height="45" rx="3" />
          <Rect x="120" y="28" width="57" height="28" rx="3" /><Rect x="190" y="18" width="28" height="43" rx="3" />
          <Rect x="231" y="29" width="45" height="22" rx="3" /><Rect x="292" y="17" width="47" height="38" rx="3" />
          <Rect x="14" y="82" width="61" height="30" rx="3" /><Rect x="91" y="78" width="32" height="42" rx="3" />
          <Rect x="137" y="74" width="44" height="31" rx="3" /><Rect x="205" y="79" width="55" height="25" rx="3" />
          <Rect x="278" y="72" width="67" height="36" rx="3" /><Rect x="20" y="137" width="42" height="34" rx="3" />
          <Rect x="79" y="136" width="29" height="30" rx="3" /><Rect x="265" y="129" width="35" height="33" rx="3" />
          <Rect x="314" y="124" width="33" height="47" rx="3" /><Rect x="25" y="204" width="54" height="37" rx="3" />
          <Rect x="103" y="211" width="36" height="35" rx="3" /><Rect x="247" y="201" width="50" height="39" rx="3" />
          <Rect x="312" y="191" width="33" height="50" rx="3" />
        </G>

        <G fill="none" stroke="#354b55" strokeWidth="2">
          <Path d="M5 64 C74 68 102 111 178 116 S282 102 355 119" />
          <Path d="M50 -8 C54 55 87 103 78 151 S51 230 69 278" />
          <Path d="M158 -8 C151 62 170 95 171 149 S151 224 171 278" />
          <Path d="M280 -8 C271 63 306 97 294 151 S276 223 286 278" />
          <Path d="M6 180 C78 157 126 180 197 207 S292 234 370 218" />
        </G>
        <G fill="none" stroke="#293d47" strokeWidth="1">
          <Path d="M0 128 L360 31" /><Path d="M113 0 L229 270" /><Path d="M220 0 L89 270" />
        </G>

        {stage >= 1 && <G>
          <Circle cx="270" cy="55" r="67" fill="#925266" opacity=".18" />
          <Circle cx="270" cy="55" r="47" fill="#b15b6a" opacity=".13" stroke="#f08492" strokeDasharray="4 7" />
          <Path d="M145 224 C164 184 219 173 231 132 S248 76 279 51" fill="none" stroke="#ef6d72" strokeWidth="4" strokeLinecap="round" strokeDasharray="8 7" opacity=".9" />
          <Text x="276" y="25" fill="#f4a0aa" fontSize="8" fontWeight="700" letterSpacing="1">STORM CELL</Text>
        </G>}

        {stage >= 2 && <G>
          <Path d="M145 224 C122 194 131 158 171 145 S228 167 251 142 S285 121 306 105" fill="none" stroke="#10242b" strokeWidth="9" strokeLinecap="round" />
          <Path d="M145 224 C122 194 131 158 171 145 S228 167 251 142 S285 121 306 105" fill="none" stroke="url(#dry)" strokeWidth="4.5" strokeLinecap="round" />
          <Circle cx="202" cy="151" r="4" fill="#8bdec0" stroke="#eafff7" strokeWidth="2" />
          <Rect x="189" y="161" width="72" height="18" rx="9" fill="#dff9ee" />
          <Text x="225" y="173" fill="#246b56" fontSize="8" fontWeight="700" textAnchor="middle">DRY ROUTE · 18 MIN</Text>
        </G>}

        <Place x={279} y={51} label="KLCC" color="#f0c675" />
        <Place x={231} y={132} label="ILHAM" color="#9bb8c7" />
        <Place x={145} y={224} label="Dewakan" color="#ff9a69" />
        <Place x={306} y={105} label="Bar Trigona" color="#8bdec0" />

        <G transform="translate(20 247)">
          <Circle r="4" fill={stage >= 2 ? '#57d49b' : '#6e8490'} />
          <Text x="10" y="3" fill="#9db0ba" fontSize="8" fontWeight="700" letterSpacing=".8">
            {stage >= 2 ? 'ROUTE SECURED' : stage >= 1 ? 'REROUTING LIVE' : 'KUALA LUMPUR · LIVE'}
          </Text>
        </G>
      </Svg>
    </View>
  );
}

function Place({ x, y, label, color }: { x: number; y: number; label: string; color: string }) {
  const left = x > 265;
  return <G>
    <Circle cx={x} cy={y} r="10" fill="#102029" stroke={color} strokeWidth="1.5" />
    <Circle cx={x} cy={y} r="3.5" fill={color} />
    <Polygon points={`${x - 3},${y + 9} ${x + 3},${y + 9} ${x},${y + 15}`} fill={color} />
    <Text x={left ? x - 15 : x + 15} y={y + 3} fill="#eef5f7" fontSize="9" fontWeight="700" textAnchor={left ? 'end' : 'start'}>{label}</Text>
  </G>;
}

const styles = StyleSheet.create({
  shell: { width: '100%', aspectRatio: 4 / 3, borderRadius: 24, overflow: 'hidden' },
});
