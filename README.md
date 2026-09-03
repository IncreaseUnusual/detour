# Detour

A travel app prototype: an agent called Scout watches for things worth changing
your plans for, and the app shows the change arriving. Onboarding, a feed of
surfaced finds, a live multi-agent trace, an itinerary that updates, and an
arrival flow.

**Stack:** React 19 · React Native Web · Vite · TypeScript · react-native-svg

```bash
npm install
npm run dev      # http://localhost:8081
npm run build    # -> dist/
```

## What it is

The UI is written as React Native components and rendered on the web through
`react-native-web`. That keeps a single component tree that reads like the
design spec in `design/`, while shipping as an ordinary static web build.

There is no backend and no model call. Every number is a literal in
`src/data.ts` and the agent traces are scripted in `src/agentRuntime.ts`, so the
Swarm and Ask Scout screens label themselves as scripted replays. The one real
network call is a Lisbon weather check against Open-Meteo, which fails over
cleanly when offline.

On a desktop viewport the app renders inside a 390x812 phone frame with a
painted status bar and home pill. On a handset it renders full bleed to the safe
area. That switch is the `framed` flag in `App.tsx`, keyed off window width.

## Layout

| Path | What |
|---|---|
| `App.tsx` | Root component: onboarding route and tab state |
| `src/main.tsx` | Web entry, mounts through `AppRegistry` |
| `src/screens/` | Feed, Detail, Confirm, Swarm, Trips, Profile, AskScout, Arrival |
| `src/components/` | Phone chrome, live banner, mission map |
| `src/theme.ts` | Colors, fonts, shared card shell. Single source of truth |
| `src/ui.tsx` `src/icons.tsx` `src/art.tsx` | Shared primitives, pixel sprites, SVG art |
| `src/web/` | Small web implementations of native modules, see below |
| `design/` | The design canvas files this was ported from. Treat as spec |

## `src/web/`

Four native-only packages are replaced by local modules, so nothing else in the
tree has to know it is running on the web:

| Module | Replaces | How |
|---|---|---|
| `LinearGradient.tsx` | `expo-linear-gradient` | CSS `linear-gradient` on a layer behind the children |
| `fonts.ts` | `expo-font`, `@expo-google-fonts/*` | `@font-face` from bundled @fontsource files, under the family names `theme.ts` already uses |
| `SafeArea.tsx` | `react-native-safe-area-context` | The browser's own `env(safe-area-inset-*)` |
| `globals.d.ts` | React Native's `__DEV__` | Defined by Vite |

See `AGENT-INSTRUCTIONS.md` for setup detail, house rules and the demo
behaviour that looks like a bug but is not.
