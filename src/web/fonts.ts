/**
 * Web replacement for `expo-font` + `@expo-google-fonts/*`.
 *
 * The design tokens in `theme.ts` name fonts the way Expo did
 * (`DMSans_500Medium`, `Newsreader_400Regular`, ...), so we register real
 * @font-face rules under those exact family names. Nothing in `theme.ts` or
 * any screen has to change: `fontFamily: F.med` keeps resolving.
 *
 * Font files come from @fontsource, so they are bundled and served locally
 * rather than fetched from Google at runtime.
 */
import dmSans400 from '@fontsource/dm-sans/files/dm-sans-latin-400-normal.woff2';
import dmSans500 from '@fontsource/dm-sans/files/dm-sans-latin-500-normal.woff2';
import dmSans700 from '@fontsource/dm-sans/files/dm-sans-latin-700-normal.woff2';
import newsreader400 from '@fontsource/newsreader/files/newsreader-latin-400-normal.woff2';
import newsreader500 from '@fontsource/newsreader/files/newsreader-latin-500-normal.woff2';

import { useEffect, useState } from 'react';

/** Family name, the weight it really is, and the file behind it. */
const FACES = [
  { family: 'DMSans_400Regular', weight: 400, url: dmSans400 },
  { family: 'DMSans_500Medium', weight: 500, url: dmSans500 },
  { family: 'DMSans_700Bold', weight: 700, url: dmSans700 },
  { family: 'Newsreader_400Regular', weight: 400, url: newsreader400 },
  { family: 'Newsreader_500Medium', weight: 500, url: newsreader500 },
] as const;

/** The names screens import, kept identical to the Expo font constants. */
export const DMSans_400Regular = 'DMSans_400Regular';
export const DMSans_500Medium = 'DMSans_500Medium';
export const DMSans_700Bold = 'DMSans_700Bold';
export const Newsreader_400Regular = 'Newsreader_400Regular';
export const Newsreader_500Medium = 'Newsreader_500Medium';

let injected = false;

function injectFaces() {
  if (injected || typeof document === 'undefined') return;
  injected = true;
  const css = FACES.map(
    f => `@font-face{font-family:'${f.family}';src:url(${f.url}) format('woff2');` +
         `font-weight:${f.weight};font-style:normal;font-display:swap;}`,
  ).join('\n');
  const tag = document.createElement('style');
  tag.setAttribute('data-detour-fonts', '');
  tag.appendChild(document.createTextNode(css));
  document.head.appendChild(tag);
}

injectFaces();

/**
 * Drop-in for expo-font's `useFonts`. Same signature, same [loaded] tuple, so
 * App.tsx keeps gating the splash on real font readiness instead of guessing.
 */
export function useFonts(_map?: Record<string, unknown>): [boolean] {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let alive = true;
    injectFaces();

    const done = () => { if (alive) setLoaded(true); };

    if (typeof document === 'undefined' || !document.fonts) { done(); return; }

    // Ask for each face explicitly: document.fonts.ready alone can resolve
    // before a face that nothing has painted yet has been fetched.
    Promise.all(FACES.map(f => document.fonts.load(`${f.weight} 16px '${f.family}'`)))
      .then(() => document.fonts.ready)
      .then(done)
      .catch(done); // a font failing to load must not hold the app on the splash

    return () => { alive = false; };
  }, []);

  return [loaded];
}
