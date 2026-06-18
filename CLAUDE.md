# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

**Backend** (FastAPI + Python 3.12)
```bash
cd backend && pip install -r requirements.txt
cd backend && uvicorn app.main:app --reload        # http://localhost:8000
cd backend && pytest                               # all tests
cd backend && pytest tests/test_history.py::test_create_entry  # single test
```

**Frontend** (React + TypeScript + Vite)
```bash
cd frontend && npm install
cd frontend && npm run dev                         # http://localhost:5173
cd frontend && npx vitest run                      # all tests
cd frontend && npx vitest run Calculator           # single test file
```

**CI** runs both suites automatically on push/PR via `.github/workflows/ci.yml`.

## Architecture Overview

Full-stack minimalist calculator. The frontend works standalone; the backend only stores calculation history.

**Backend** (`backend/app/`):
- `models.py` — single `HistoryEntry` SQLModel (id, expression, result, created_at)
- `database.py` — SQLite engine + `get_session` dependency (overridden in tests with in-memory DB)
- `routes/history.py` — three endpoints: `GET /history`, `POST /history`, `DELETE /history/{id}`
- `main.py` — FastAPI app with lifespan (creates tables), CORS for localhost:5173, mounts router

**Frontend** (`frontend/src/`):
- `utils/evaluate.ts` — hand-rolled two-pass expression evaluator (no `eval`). First pass resolves `×`/`÷`, second resolves `+`/`−`. Uses Unicode minus `−` and multiply `×` throughout.
- `api/history.ts` — typed fetch wrappers; base URL from `VITE_API_URL` env var (defaults to `http://localhost:8000`)
- `components/Calculator.tsx` — owns expression state; button grid maps clicks to expression edits or an evaluate+save call
- `components/History.tsx` — pure display component; receives entries and `onDelete` from App
- `App.tsx` — orchestrates: fetches history on mount, passes `onResult` to Calculator which triggers a POST + state update

**Cross-layer flow**: user hits `=` → `evaluate.ts` computes result locally → `App.handleResult` POSTs to `/history` → new entry prepended to local state → History re-renders.

## Key Conventions

- Operators in expressions use Unicode: `−` (U+2212), `×` (U+00D7), `÷` (U+00F7). The `+` is standard ASCII. All four must be consistent between `Calculator.tsx` (input), `evaluate.ts` (parsing), and any test fixtures.
- Backend test fixtures override `get_session` via `app.dependency_overrides` — always use in-memory SQLite (`sqlite://`) with `StaticPool` to keep tests isolated and fast.
- Frontend test files query the display via `document.querySelector('.display__expr')` rather than `getByText` to avoid ambiguity with digit buttons that share the same text content.
