# Detour — Base44 dev environment

Frontend-only prototype: React 19 + React Native Web + Vite + TypeScript. No backend, no database, no external secrets. The one network call (Lisbon weather via Open-Meteo) fails over cleanly when offline.

## Run

```
docker compose -f docker-compose.base44.yml up -d
```

- Web entry point on host port 3000 (container port 8081).
- `node:22` base image, source bind-mounted; `npm install` + `vite` dev server with HMR run on container start.
- Vite `allowedHosts: true` added so the preview's external hostname is accepted.

## Verify

```
curl -sf -H "Host: external-preview.example.com" http://localhost:3000/
```
Should return the Detour HTML with the Vite HMR client script.

## Notes

- Vite 8 logs a deprecation warning about `optimizeDeps.esbuildOptions` (use `rolldownOptions`); harmless, app still serves.
- `vite.config.ts` aliases `react-native` → `react-native-web`; `.web.*` extension order matters for react-native-svg.
