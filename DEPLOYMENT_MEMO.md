# Project Memo — Calculator App: Status & Next Steps

_Last updated: 2026-06-27_

## What this project is
Full-stack minimalist calculator (see `CLAUDE.md` for architecture).
- **Frontend**: React + TypeScript + Vite (`frontend/`)
- **Backend**: FastAPI + SQLModel + SQLite (`backend/`)
- **Repo**: https://github.com/tamasbalassafns/repo_one
- **Working branch**: `claude/claude-md-docs-nM7wq` (also the main branch for PRs)

## Current status — DONE ✅
All committed and pushed (commit `0822be0`):
1. **Fixed blank-screen crash** — `HistoryEntry` (a TS interface) was imported as a
   runtime value in `App.tsx` and `History.tsx`; under `verbatimModuleSyntax` this
   broke module load and the app never mounted. Changed to `import type`.
2. **Division by zero** now shows an error instead of saving `"Infinity"`/`"NaN"`
   (`Calculator.tsx` — added `Number.isFinite` guard).
3. **Repeated `=`** no longer re-saves the result (guard: skip if no operator present).
4. **CI** now runs on pushes to all branches, not just `main` (`.github/workflows/ci.yml`).
5. Added tests for division-by-zero and repeated-`=` (`Calculator.test.tsx`).

Tests passing locally: **backend 5/5, frontend 11/11**.

## Local dev environment — DONE ✅
- Installed **Node.js 24.18** and **Python 3.12.10** via winget (were missing).
- Backend deps: `pip install -r requirements.txt`. Frontend deps: `npm install`.
- App verified running: frontend http://localhost:5173, backend http://localhost:8000.
- NOTE: a leftover test entry `2 + 2 = 4` (id=1) was POSTed into `backend/calc.db`
  during smoke testing. Delete it from the History panel or remove `calc.db` if unwanted.

### To run locally (in two terminals)
```
cd backend  && uvicorn app.main:app --reload      # :8000
cd frontend && npm run dev                          # :5173
```

## Next task — DEPLOYMENT (paused here)
Goal: deploy so the app is available remotely. User is leaning toward
**Vercel (frontend + backend serverless) + Supabase (managed Postgres)**.
No final decision locked in; no deployment code changes made yet.

### Required code changes before any remote deploy
1. **CORS** — `backend/app/main.py:18` hardcodes `http://localhost:5173`.
   Make it env-driven and add the deployed frontend origin.
2. **Database** — `backend/app/database.py:3` hardcodes `sqlite:///./calc.db`.
   Make `DATABASE_URL` env-driven. SQLite has no persistence on serverless hosts.
3. **Frontend API URL** — set `VITE_API_URL` at build time (code already supports
   it via `frontend/src/api/history.ts:8`).
4. **Backend bind** — production start: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.

### Extra steps specific to Vercel + Supabase (the chosen-ish path)
- Switch SQLite → Postgres: add `psycopg[binary]` to `backend/requirements.txt`.
- **Use Supabase's connection POOLER** (port 6543, transaction mode), NOT the direct
  connection — serverless opens many short-lived connections. Configure SQLAlchemy
  with `poolclass=NullPool` and disable prepared-statement caching. (Most common pitfall.)
- ASGI **lifespan won't run reliably** on Vercel serverless, so `create_db_and_tables()`
  won't fire. Create the `historyentry` table once via the Supabase SQL editor or a
  one-off script instead.
- Add Vercel structure: `api/index.py` exposing the ASGI `app` + a `vercel.json` rewrite.

### Deliverables to produce when resuming
- Env-driven CORS + DATABASE_URL.
- `api/` entry + `vercel.json`.
- Postgres driver in requirements; Supabase table-creation SQL.
- `DEPLOY.md` with the exact pooler connection-string format and click-by-click
  Vercel + Supabase steps.
- Verify the build locally before pushing.

### Open questions for the user
- Confirm platform: **Vercel + Supabase** (vs. Render, Railway, Fly.io)?
- Confirm DB approach: **managed Postgres (Supabase)** — implied by the choice above.
- Account signup + clicking "deploy" is the user's to do (needs their GitHub/Vercel/
  Supabase auth); code prep + local verification is mine.
