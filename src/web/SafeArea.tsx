/**
 * Web replacement for `react-native-safe-area-context`.
 *
 * On the web the safe area is already exposed by the browser as the
 * `env(safe-area-inset-*)` CSS variables, which is what makes a notch or a home
 * bar work on an iPhone in Safari. The provider therefore has nothing to set up
 * and simply renders its children.
 */
import * as React from 'react';
import { View, type ViewProps } from 'react-native';

export type Edge = 'top' | 'right' | 'bottom' | 'left';

export function SafeAreaProvider({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}

const ALL: Edge[] = ['top', 'right', 'bottom', 'left'];

export function SafeAreaView({ edges = ALL, style, children, ...rest }: ViewProps & { edges?: readonly Edge[] }) {
  const pad = (edge: Edge) => (edges.includes(edge) ? `env(safe-area-inset-${edge}, 0px)` : 0);

  // The insets go on a plain div: env() is a CSS value React Native's own style
  // system has no way to express.
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minHeight: 0,
        paddingTop: pad('top'),
        paddingRight: pad('right'),
        paddingBottom: pad('bottom'),
        paddingLeft: pad('left'),
      }}
    >
      <View style={style} {...rest}>{children}</View>
    </div>
  );
}

/** Provided for parity; the browser applies the insets itself via env(). */
export function useSafeAreaInsets() {
  return { top: 0, right: 0, bottom: 0, left: 0 };
}
