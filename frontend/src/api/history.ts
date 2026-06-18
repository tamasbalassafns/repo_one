export interface HistoryEntry {
  id: number
  expression: string
  result: string
  created_at: string
}

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export async function fetchHistory(): Promise<HistoryEntry[]> {
  const res = await fetch(`${BASE}/history`)
  if (!res.ok) throw new Error('Failed to fetch history')
  return res.json()
}

export async function saveEntry(expression: string, result: string): Promise<HistoryEntry> {
  const res = await fetch(`${BASE}/history`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ expression, result }),
  })
  if (!res.ok) throw new Error('Failed to save entry')
  return res.json()
}

export async function deleteEntry(id: number): Promise<void> {
  const res = await fetch(`${BASE}/history/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete entry')
}
