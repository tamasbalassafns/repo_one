# Calculator

A full-stack minimalist calculator. The frontend works standalone for arithmetic;
the backend persists calculation history.

- **Frontend** — React + TypeScript + Vite. A hand-rolled expression evaluator
  (no `eval`) computes results locally.
- **Backend** — FastAPI + SQLModel + SQLite. Stores and serves calculation history.

## Features

- Arithmetic with correct precedence: `+`, `−`, `×`, `÷`
- Exponentiation `^` (right-associative) and parentheses for grouping
- Full keyboard support — digits, `+ - * / ^ ( )`, `Enter`/`=`, `Backspace`, `Esc`
- Calculation history persisted via the backend, with per-entry delete

## Project structure

```
repo_one/
├── backend/                 # FastAPI app
│   └── app/
│       ├── main.py          # app entry, CORS, router mount, table creation
│       ├── database.py      # SQLite engine + session dependency
│       ├── models.py        # HistoryEntry model + request/response schemas
│       └── routes/history.py # GET / POST / DELETE /history
├── frontend/                # React + Vite SPA
│   └── src/
│       ├── App.tsx          # orchestrates calculator + history
│       ├── components/      # Calculator, History
│       ├── api/history.ts   # typed fetch wrappers (base URL from VITE_API_URL)
│       └── utils/evaluate.ts # recursive-descent expression evaluator
├── CLAUDE.md                # architecture notes & conventions
└── DEPLOYMENT_MEMO.md       # deployment status & next steps
```

## Prerequisites

- **Python 3.12**
- **Node.js 20+**

## Getting started

### Quick start (Windows)

Double-click **`dev.cmd`** (or run `.\dev.ps1` from a terminal) to launch both
servers at once, each in its own window. The first time — or after dependency
changes — run `.\dev.cmd -Setup` to install dependencies first. Then open
http://localhost:5173.

### Manual start

Run the backend and frontend in two separate terminals.

### Backend (http://localhost:8000)

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Interactive API docs are available at http://localhost:8000/docs.
On first run, a `calc.db` SQLite file is created in `backend/`.

### Frontend (http://localhost:5173)

```bash
cd frontend
npm install
npm run dev
```

Then open http://localhost:5173.

> The calculator works without the backend — only the History panel requires it,
> and it degrades gracefully when the API is unavailable.

To point the frontend at a non-default backend, set `VITE_API_URL`
(e.g. create `frontend/.env.local` with `VITE_API_URL=http://localhost:8000`).

## Testing

```bash
# Backend
cd backend && pytest

# Frontend
cd frontend && npx vitest run
```

CI builds the frontend (`npm run build`) and runs both test suites on push and
pull request (`.github/workflows/ci.yml`).

## API

| Method | Endpoint          | Description                       |
|--------|-------------------|-----------------------------------|
| GET    | `/history`        | List history entries, newest first |
| POST   | `/history`        | Create an entry (`expression`, `result`) |
| DELETE | `/history/{id}`   | Delete an entry by id             |

## Notes

- Expression operators use Unicode characters: `−` (U+2212), `×` (U+00D7),
  `÷` (U+00F7); `+`, `^`, `(`, `)` are standard ASCII. These must stay consistent
  across the calculator UI, the evaluator, and any test fixtures.
- Keyboard input is translated to button labels via `KEY_MAP` in
  `Calculator.tsx` — e.g. the `-` `*` `/` keys map to `−` `×` `÷`.
- Deployment is not yet set up — see [DEPLOYMENT_MEMO.md](DEPLOYMENT_MEMO.md)
  for the current plan (Vercel + Supabase) and required changes.
