# Billiamo — Clickable Prototype

Internal alignment tool: the full app with **fake data, no backend**. Phase 3 of the design program (see the vault wiki: `wiki/product/Information Architecture.md` and `wiki/product/Key Flows.md`).

```bash
npm install
npm run dev   # → http://localhost:5173
```

## Routes

| Route | Surface |
|---|---|
| `/#/` | Landing + Google OAuth (fake) |
| `/#/benvenuto` | Welcome first-run |
| `/#/dashboard` … | Freelancer app (rail: Dashboard, Fatture, Clienti, Pagamenti, Report, Impostazioni) |
| `/#/fatture/i14/correzione` | SDI Scartata guided correction |
| `/#/pay/demo` | Unauthenticated payment page (wallet-connect / on-chain / IBAN branches) |
| `/#/commercialista` | Read-only commercialista view |

## Where things live

- `src/data/fake.ts` — all fake entities (profile, clients, invoices, lots, snapshots). Flip `profile.complete = false` to see the deferred-onboarding banner and the send gate.
- `src/styles/app.css` — design tokens from `wiki/product/Design System.md` (Fraunces / Inter / IBM Plex Mono, orange #DC6019, 76px rail, 20px cards)
- `src/screens/` — one file per IA section

Stack: Vite + React + TypeScript, react-router (hash routing), lucide icons. No state library — this is a prototype, not the product (`../billiamo-app` is the real codebase).
