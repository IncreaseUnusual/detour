# Detour: build status

Living handoff doc. Update it when you finish a screen.

## What this is
An Expo (React Native + TypeScript) port of the Claude Design project
`c59ec275-e2fd-47cb-974f-6ceb19eb7a57`. Runs on web and on a real iPhone
via Expo Go. No Xcode on the build machine, so no simulator and no native
build: Expo Go or the browser only.

## Run it
    cd scout-app
    npx expo start --web     # http://localhost:8081
    npx expo start           # then exp://<lan-ip>:8081 in Expo Go

Desktop renders inside a 390x812 phone frame with a painted status bar and
home pill. A real handset renders full bleed on the device safe area. The
switch is `framed` in App.tsx, keyed off window width.

## Design sources
Stored `design/*.dc.html` files are verbatim copies of the Claude Design files. Treat them
as the spec. They are Claude Design canvas files: `<x-dc>` markup plus a
`DCLogic` class holding the state and the SVG/pixel art generators. Port the
numbers exactly (radii, gaps, font sizes, colors).

- `Scout App.dc.html` ............ STORED. Main app implementation is done.
- `Scout Onboarding.dc.html` ..... STORED. Flow implementation is done.
- `Scout Onboarding copy.dc.html`  STORED. Byte-identical to the above.
- `Scout Costumes.dc.html` ....... STORED. Country arrival screen and art are implemented.
- `Scout App (dark).dc.html` ..... STORED. Dark variant is not implemented.

`support.js`, `image-slot.js`, `_ds/`, `uploads/`, and the image-slot metadata
are stored beside the HTML sources for complete design context.

## Shared contracts, use these, do not reinvent
- `src/theme.ts` ......... `C` colors, `F` font families, `BACKDROP`, `cardShell`.
- `src/ui.tsx` ........... `Serif` `Sans` `Kicker` `Card` `Pill` `KV` `Button` `PulseDot`.
- `src/icons.tsx` ........ `PixelRows` (run-length sprite renderer), `PixelAgent`,
                           `Icon`, `P` (phosphor paths).
- `src/art.tsx` .......... `AppIcon`, `Sticker` (12 motifs), `Costumed`, `HatMark`, `SPRITES`.
- `src/data.ts` .......... `AGENTS`, `BY_ID`, `CARDS`, `QUICK`, `TABS`.
- `src/agentRuntime.ts` .. `TraceStep`, `Phase`, `PHASE_LABEL`, `PHASE_COLOR`,
                           `TRACE`, `useStream`, `useSwarmCounters`.

## House rules
1. Colors and fonts come from `theme.ts`. Never hardcode a hex that is already a token.
2. Every `<Text>` needs an explicit `fontFamily` from `F`. React Native does not inherit fonts.
3. NO EM DASHES in user-visible copy, including copy lifted from the design.
   Use commas, colons or periods. Middle dots are the house separator.
4. Fixed-size elements beside flexible text need `flexShrink: 0`. Real bug hit
   twice: `flex: 0` lets an SVG collapse to zero width while still painting at
   full size, so the icon lands on top of the text next to it.
5. Animations are part of the spec, not decoration. Port them.

## Screens
| Screen | File | State |
|---|---|---|
| Feed | `src/screens/Feed.tsx` | done |
| Detail | `src/screens/Detail.tsx` | done |
| Confirm | `src/screens/Confirm.tsx` | done |
| Swarm (live agent trace) | `src/screens/Swarm.tsx` | done |
| Trips (itinerary + change log) | `src/screens/Trips.tsx` | done |
| Profile (autonomy + taste) | `src/screens/Profile.tsx` | done |
| Ask Scout (fan-out to answer) | `src/screens/AskScout.tsx` | done |
| Live banner | `src/components/LiveBanner.tsx` | done |
| Phone chrome + tab bar | `src/components/Chrome.tsx` | done |
| Splash / intros / heading out | `src/screens/onboarding/Intro.tsx` | done |
| 4 onboarding questions | `src/screens/onboarding/Questions.tsx` | done |
| Country arrival | `src/screens/Arrival.tsx` | done, Profile has Malaysia/Texas demo triggers |

## Demo behaviour worth knowing
- Onboarding is the launch route: splash, three intros, four questions,
  heading out, then the main app. The returning-user button skips it.
- The Swarm tab's controlled cancellation runs the trace end to end, then
  surfaces the Belcanto card and push. The push repeats every 40s afterward,
  so the demo can be picked up cold without inventing another signal.
- The hold countdown ticks from 9:58 in real time.
- The Swarm trace streams and loops on its own, so the screen is never static.
- The signals counter increments on its own.
- Swarm and Ask Scout explicitly label themselves as scripted replays. Agent
  access, fan-out, tool calls, triage, policy checks, citations, and action are
  visible without claiming that prototype integrations are connected.
- Completing onboarding starts the two-minute consumer story on the open
  itinerary. Scout explores, the controlled signal surfaces, Hold updates the
  itinerary, and confirmation returns to the changed trip.
- The controlled trigger also checks current Lisbon weather through Open-Meteo
  as the demo's real, non-critical API source. It falls back cleanly offline.

## Not real
Apart from the live Open-Meteo context check, every number is a literal in
`data.ts`; the traces are scripted in `agentRuntime.ts`. No backend, social or
reservation feed, or model calls. The runtime is
shaped like the real thing (typed `TraceStep`, phases, a streaming hook), so
swapping the scripted array for a websocket is a contained change.
