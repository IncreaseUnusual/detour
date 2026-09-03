# Detour — handoff instructions for the receiving agent

You have been given this project as **three zip archives**. Read this file
completely before running anything. Everything below is verified against the
actual project, not assumed.

---

## 1. What this project is

**Detour** (package name `detour`, app display name `Detour`) is an
**Expo + React Native + TypeScript** prototype of a travel app with a scripted
multi-agent "Scout" runtime. It runs **on web and on a real iPhone via Expo Go**.

Stack, pinned in `package.json`:

- Expo SDK **~57.0.19**
- React Native **0.86.3**
- React **19.2.3**
- TypeScript **~6.0.3**
- `react-native-web` 0.21, `react-native-svg` 15.15, `expo-linear-gradient`,
  `expo-font`, `react-native-safe-area-context`
- Google fonts via `@expo-google-fonts/*`: DM Sans, Newsreader, Space Grotesk,
  IBM Plex Mono

> **Expo has changed.** This is SDK 57. Before writing any code, read the exact
> versioned docs at <https://docs.expo.dev/versions/v57.0.0/>. Do not rely on
> memory of older Expo APIs. This rule comes from the project's own `AGENTS.md`
> and is repeated here because it is the most common source of wrong code in
> this repo.

There is **no backend and no model call**. Every number is a literal in
`src/data.ts`; agent traces are scripted in `src/agentRuntime.ts`. The one real
network call is a Lisbon weather check against Open-Meteo, which fails over
cleanly offline.

---

## 2. The three archives

The project is ~43 MB of mostly already-compressed PNG, so zip cannot shrink it
further. It is split three ways to keep every archive under 20 MB. Nothing was
modified or omitted — the three zips together are a byte-for-byte copy of all
78 project files.

| # | File | Size | Contents |
|---|------|------|----------|
| 1 | `detour-1-code.zip` | 9.1 MB | All source, config and design: `src/`, `App.tsx`, `index.ts`, `package.json`, `package-lock.json`, `tsconfig.json`, `app.json`, `AGENTS.md`, `CLAUDE.md`, `LICENSE`, `.gitignore`, `.claude/`, `design/`, and the icon/splash files in `assets/` |
| 2 | `detour-2-explore-a.zip` | 17 MB | `assets/explore/` — 8 photos, `austin-counter` → `dewakan` |
| 3 | `detour-3-explore-b.zip` | 18 MB | `assets/explore/` — 8 photos, `ilham` → `vinyl-room` |

**Not included:** `node_modules/` (~372 MB) and `.expo/`. Both are regenerated
locally — see step 4. `package-lock.json` **is** included, so installs are
reproducible.

### Why all three are mandatory

The 16 explore photos are not optional media. They are pulled in with
`require()` at **bundle time** in `src/data.ts` (lines 32-46) and
`src/screens/Swarm.tsx` (lines 53-55, 97, 101). Metro resolves those paths while
building. If you unpack only zip 1, **the bundle fails to build** with a module
resolution error naming a missing `assets/explore/*.png`. It is not a runtime
placeholder or a broken-image square — it is a hard build failure.

---

## 3. Combining the archives

All three zips store paths relative to the project root and do not overlap, so
they unpack on top of each other. Order does not matter.

```bash
mkdir Detour-project && cd Detour-project

unzip ../detour-1-code.zip
unzip ../detour-2-explore-a.zip
unzip ../detour-3-explore-b.zip
```

On macOS, prefer this over double-clicking in Finder: Finder renames colliding
folders (`explore 2`) instead of merging them, which produces exactly the
missing-asset build failure described above.

### Verify before you build

```bash
ls assets/explore/*.png | wc -l      # must be exactly 16
ls src/screens/*.tsx | wc -l         # must be 8
test -f App.tsx && test -f package.json && echo "root ok"
```

If the first check prints anything other than 16, one of the explore zips did
not unpack into the project root. Fix that before running `npm install` —
otherwise you will debug a bundler error whose real cause is an unpack mistake.

---

## 4. Installing and running

```bash
npm install              # restores node_modules from package-lock.json, ~1 min
```

Expect `npm install` to report a few moderate advisories and a deprecated
transitive `uuid`. That is the normal state of this dependency tree. **Do not**
run `npm audit fix --force` — it will force-upgrade pinned Expo packages and
break the SDK 57 lockstep between `expo`, `react-native` and `react`.

Then pick a target:

```bash
npx expo start --web     # browser at http://localhost:8081
npx expo start           # QR / exp://<lan-ip>:8081 for Expo Go on a device
npm run ios              # requires Xcode
npm run android          # requires Android SDK
```

`npm start`, `npm run web`, `npm run ios`, `npm run android` are the scripts
defined in `package.json`.

### Confirming it actually works

A returned HTTP 200 on `http://localhost:8081` only proves the dev server is
listening — it does **not** prove the app compiles. Force a real bundle:

```bash
curl -s "http://localhost:8081/index.bundle?platform=web&dev=true" \
  -o /tmp/bundle.js -w "http=%{http_code} size=%{size_download}\n"
```

A healthy build is **HTTP 200 at roughly 2.6 MB**. A compile or missing-asset
error returns a small JSON error body instead — check the size, not just the
status code.

Entry point is `index.ts` → `registerRootComponent(App)` → `App.tsx`.

### What you should see

The launch route is onboarding, not the feed: splash → three intro pages → four
questions → "heading out" → main app. There is a returning-user button that
skips it. On desktop the app renders inside a **390×812 phone frame** with a
painted status bar and home pill; on a real handset it renders full-bleed to the
safe area. That switch is the `framed` flag in `App.tsx`, keyed off window width
— a desktop-looking frame is correct behaviour, not a layout bug.

---

## 5. Project map

```
App.tsx                  root component, onboarding + tab state machine
index.ts                 registerRootComponent entry
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
design/                  the design spec — see below
assets/explore/          16 photos, required at bundle time
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

## 9. Re-splitting after you change things

If you need to hand the project on again, rebuild the same way — exclude the
generated directories, then split the explore photos across two archives:

```bash
zip -rq detour-1-code.zip . \
  -x "node_modules/*" ".expo/*" "assets/explore/*" "*.DS_Store"

ls assets/explore/*.png | sort > /tmp/all.txt
head -8 /tmp/all.txt | zip -q detour-2-explore-a.zip -@
tail -8 /tmp/all.txt | zip -q detour-3-explore-b.zip -@
```

Verify coverage before sending — file count in the zips must equal the file
count on disk:

```bash
find . -type f -not -path "./node_modules/*" -not -path "./.expo/*" \
  -not -name ".DS_Store" | wc -l
for z in detour-*.zip; do unzip -Z1 "$z"; done | grep -v '/$' | sort -u | wc -l
```

Both numbers were **78** at the time this archive was created.
