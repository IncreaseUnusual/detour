/**
 * Web replacement for `expo-linear-gradient`.
 *
 * Same props, same layout behaviour: it is a View you can put children in, and
 * the gradient paints behind them. The gradient itself is a CSS
 * `linear-gradient` on an absolutely positioned layer, which keeps the View's
 * own flex/padding/border styles untouched.
 */
import * as React from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';

type Point = { x: number; y: number };

export type LinearGradientProps = ViewProps & {
  colors: readonly string[];
  /** Unit-square start point. Defaults to the top edge, like expo. */
  start?: Point;
  /** Unit-square end point. Defaults to the bottom edge, like expo. */
  end?: Point;
  /** 0..1 stop positions, one per color. */
  locations?: readonly number[];
};

const DEFAULT_START: Point = { x: 0.5, y: 0 };
const DEFAULT_END: Point = { x: 0.5, y: 1 };

/**
 * CSS angles run clockwise from "to top"; the start/end points run down-positive
 * in the unit square. atan2(dx, -dy) converts between the two, so a default
 * top-to-bottom pair lands on 180deg exactly as expo renders it.
 */
function angleOf(start: Point, end: Point): number {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  if (dx === 0 && dy === 0) return 180;
  return (Math.atan2(dx, -dy) * 180) / Math.PI;
}

function toCss(colors: readonly string[], start: Point, end: Point, locations?: readonly number[]): string {
  const stops = colors.map((color, i) => {
    const at = locations?.[i];
    return at == null ? color : `${color} ${(at * 100).toFixed(3).replace(/\.?0+$/, '')}%`;
  });
  return `linear-gradient(${angleOf(start, end).toFixed(3).replace(/\.?0+$/, '')}deg, ${stops.join(', ')})`;
}

/** Corner radii have to be copied onto the layer, or the gradient overhangs them. */
function radiiOf(flat: Record<string, unknown>) {
  const keys = [
    'borderRadius',
    'borderTopLeftRadius', 'borderTopRightRadius',
    'borderBottomLeftRadius', 'borderBottomRightRadius',
  ] as const;
  const out: Record<string, unknown> = {};
  for (const k of keys) if (flat[k] != null) out[k] = flat[k];
  return out;
}

export function LinearGradient({
  colors, start = DEFAULT_START, end = DEFAULT_END, locations, style, children, ...rest
}: LinearGradientProps) {
  const flat = (StyleSheet.flatten(style) ?? {}) as Record<string, unknown>;

  return (
    <View style={style} {...rest}>
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: toCss(colors, start, end, locations),
          ...radiiOf(flat),
        }}
      />
      {children}
    </View>
  );
}

export default LinearGradient;
