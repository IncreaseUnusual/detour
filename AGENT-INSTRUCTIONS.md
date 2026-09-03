# Detour — handoff instructions for the receiving agent

Read this file completely before running anything. Everything below is verified
against the actual project, not assumed.

---

## 1. What this project is

**Detour** (package name `detour`, display name `Detour`) is a
**React Native Web + Vite + TypeScript** prototype of a travel app with a
scripted multi-agent "Scout" runtime. It is a **web project**: it builds to
static files in `dist/` and runs in a browser.

Stack, pinned in `package.json`:

- React **19.2** and React DOM
- **react-native-web** 0.21 — the UI is authored as React Native components
- **Vite** 8 with `@vitejs/plugin-react`
- `react-native-svg` 15.15 for the pixel art and icons
- `@fontsource/dm-sans` and `@fontsource/newsreader` for bundled webfonts
- TypeScript 5.9

> **This project was previously built with Expo (SDK 57) and no longer is.**
> Expo, `expo-font`, `expo-linear-gradient`, `expo-status-bar` and
> `@expo-google-fonts/*` were removed so the project imports into web-only
> platforms such as Base44, which reject a repo carrying `expo` in
> `package.json`. The rendered result is unchanged. **Do not reintroduce an
> Expo dependency** — it will break the import. The four native modules that
> were needed are now local implementations under `src/web/`; see section 5.
> Native builds and Expo Go are no longer supported; the previous Expo setup is
> recoverable from git history.

There is **no backend and no model call**. Every number is a literal in
`src/data.ts`; agent traces are scripted in `src/agentRuntime.ts`. The one real
network call is a Lisbon weather check against Open-Meteo, which fails over
cleanly offline.

---

## 2. Getting the project

The repository is the source of truth:

```bash
git clone https://github.com/IncreaseUnusual/detour.git
cd detour
```

`node_modules/`, `.expo/` and `dist/` are gitignored and regenerated.
`package-lock.json` is committed, so installs are reproducible.

The 16 photos in `assets/explore/` are **not optional media**. They are pulled
in with `require()` at bundle time in `src/data.ts` (lines 32-46) and
`src/screens/Swarm.tsx` (lines 53-55, 97, 101), so a missing file is a hard
build failure naming the path, not a broken-image square.

Three zip archives of this project were circulated before it was on GitHub.
They contain the older Expo version and are **superseded** by this repo.

## 3. Sanity checks before you build

```bash
ls assets/explore/*.png | wc -l      # must be exactly 16
ls src/screens/*.tsx | wc -l         # must be 8
test -f App.tsx && test -f vite.config.ts && echo "root ok"
```

## 4. Installing and running

```bash
npm install          # ~40 packages, clean audit
npm run dev          # http://localhost:8081
npm run build        # static output in dist/
npm run preview      # serve the built output
npm run typecheck    # tsc --noEmit, currently clean
```

`npm start` is an alias of `npm run dev`, so a platform that runs the
conventional script gets the dev server.

### Confirming it actually works

A 200 from `http://localhost:8081` only proves the server is listening. The
build is the real check:

```bash
npm run build
```

A healthy build emits `dist/assets/index-*.js` at roughly **557 kB**
(~168 kB gzipped) plus the 16 photos. Vite warns that the chunk is over 500 kB;
that is expected for a single-bundle app and is not an error.

Vite does not typecheck during a build, so run `npm run typecheck` separately
when you change types.

### What you should see

The launch route is onboarding, not the feed: splash, three intro pages, four
questions, "heading out", then the main app. A returning-user button skips it.

`App.tsx` returns an empty view until the webfonts report ready
(`if (!loaded) return <View style={s.fill} />`), so a blank frame for a moment
on first load is the font gate, not a crash. If a font fails outright the gate
opens anyway and the app renders in fallback type.

## 5. Project map

```
App.tsx                  root component, onboarding + tab state machine
index.html               page shell, Vite entry
vite.config.ts           react-native -> react-native-web alias, .web.* resolution
src/main.tsx             web entry, mounts via AppRegistry.runApplication
src/theme.ts             C colors, F font families, BACKDROP, cardShell
src/ui.tsx               Serif Sans Kicker Card Pill KV Button PulseDot
src/icons.tsx            PixelRows (run-length sprites), PixelAgent, Icon, P
src/art.tsx              AppIcon, Sticker (12 motifs), Costumed, HatMark, SPRITES
src/data.ts              AGENTS, BY_ID, CARDS, QUICK, TABS + explore image map
src/agentRuntime.ts      TraceStep, Phase, PHASE_LABEL/COLOR, TRACE, useStream,
                         useSwarmCounters
src/components/          Chrome.tsx (status bar, tab bar, home pill),
                         LiveBanner.tsx, MissionMap.tsx
src/screens/             Feed, Detail, Confirm, Swarm, Trips, Profile,
                         AskScout, Arrival
src/screens/onboarding/  Intro.tsx (splash, pager, heading out), Questions.tsx
src/web/                 web implementations of native modules (below)
design/                  the design spec — see below
assets/explore/          16 photos, required at bundle time
```

### `src/web/` — the four replaced native modules

Everything else in the tree imports from `'react-native'` and knows nothing
about the web. These four modules absorb the difference:

| Module | Replaces | Implementation |
|---|---|---|
| `LinearGradient.tsx` | `expo-linear-gradient` | Same props (`colors`, `start`, `end`, `locations`). Paints a CSS `linear-gradient` on an absolutely positioned layer behind the children, so the View's own flex and padding are untouched. Start/end points convert to a CSS angle with `atan2(dx, -dy)`; corner radii are copied onto the layer so the gradient does not overhang them. |
| `fonts.ts` | `expo-font` + `@expo-google-fonts/*` | Registers `@font-face` rules under the exact family names `theme.ts` already uses (`DMSans_500Medium`, `Newsreader_400Regular`, ...), from woff2 files bundled via @fontsource. `useFonts` keeps the same signature and `[loaded]` tuple, resolving off `document.fonts`. A font that fails to load opens the gate rather than hanging the splash. |
| `SafeArea.tsx` | `react-native-safe-area-context` | `SafeAreaProvider` renders its children; `SafeAreaView` applies the browser's `env(safe-area-inset-*)`. |
| `globals.d.ts` | RN's `__DEV__` | Declared for TypeScript; defined by Vite. |

Because `theme.ts` was left alone, `fontFamily: F.med` still resolves and every
`<Text>` in the app is untouched.

```
```

All screens listed in `design/STATUS.md` are marked **done**. The one unbuilt
item is the dark variant (`design/Scout App (dark).dc.html`).

---

## 6. The design folder is the spec

`design/*.dc.html` are verbatim Claude Design canvas files: `<x-dc>` markup plus
a `DCLogic` class holding state and the SVG/pixel-art generators. Treat them as
the source of truth and **port the numbers exactly** — radii, gaps, font sizes,
colors. `support.js`, `image-slot.js`, `_ds/` and `uploads/` are shipped beside
them for complete design context.

`design/STATUS.md` is the living handoff doc. **Update it when you finish a
screen** — that is the project's stated convention.

---

## 7. House rules — follow these, do not reinvent

From `design/STATUS.md`, verbatim in intent:

1. Colors and fonts come from `theme.ts`. Never hardcode a hex that already has
   a token.
2. Every `<Text>` needs an explicit `fontFamily` from `F`. **React Native does
   not inherit fonts.**
3. **No em dashes** in user-visible copy, including copy lifted from the design.
   Use commas, colons or periods. The middle dot `·` is the house separator.
4. Fixed-size elements beside flexible text need `flexShrink: 0`. This bug has
   landed twice: `flex: 0` lets an SVG collapse to zero width while still
   painting at full size, so the icon overlaps the text beside it.
5. Animations are part of the spec, not decoration. Port them.

Reuse the shared contracts in `theme.ts`, `ui.tsx`, `icons.tsx`, `art.tsx`,
`data.ts` and `agentRuntime.ts` rather than writing parallel versions.

---

## 8. Demo behaviour that looks like a bug but is not

- The Swarm trace **streams and loops on its own** — the screen is never static.
- The signals counter increments by itself.
- The hold countdown ticks down from **9:58** in real time.
- The push banner **repeats every 40 seconds** after the first surface, so the
  demo can be picked up cold without inventing a new signal.
- Swarm's controlled cancellation runs the trace end to end, then surfaces the
  Belcanto card and push.
- Swarm and Ask Scout **explicitly label themselves as scripted replays.**
  Keep that labelling. Do not present the prototype's fan-out, tool calls,
  triage, policy checks or citations as live integrations.
- Completing onboarding starts a two-minute consumer story on the open
  itinerary: Scout explores, the controlled signal surfaces, Hold updates the
  itinerary, confirmation returns to the changed trip.

---

## 9. Deploying and importing elsewhere

It is a standard static Vite site: build command `npm run build`, output
directory `dist`, no server and no environment variables. That is what Netlify,
Vercel, Cloudflare Pages or Base44 need to know.

If an import tool rejects the repo as a mobile project, the cause is a
dependency name in `package.json`. `react-native-web` and `react-native-svg`
are web libraries despite their names and must stay. `react-native` itself is
**not** a dependency: it is present in `node_modules` only because
`@types/react-native-web` pulls it in for its type definitions, which is what
`npm run typecheck` reads. Do not promote it to a direct dependency.
