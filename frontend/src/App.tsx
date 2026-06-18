import { useEffect, useState } from 'react'
import { Calculator } from './components/Calculator'
import { History } from './components/History'
import { HistoryEntry, fetchHistory, saveEntry, deleteEntry } from './api/history'

export default function App() {
  const [history, setHistory] = useState<HistoryEntry[]>([])

  useEffect(() => {
    fetchHistory().then(setHistory).catch(() => {})
  }, [])

  async function handleResult(expression: string, result: string) {
    try {
      const entry = await saveEntry(expression, result)
      setHistory(prev => [entry, ...prev])
    } catch {
      // history unavailable — calculator still works offline
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteEntry(id)
      setHistory(prev => prev.filter(e => e.id !== id))
    } catch {}
  }

  return (
    <div className="app">
      <h1 className="app__title">Calculator</h1>
      <div className="app__layout">
        <Calculator onResult={handleResult} />
        <aside className="app__history">
          <h2 className="history__heading">History</h2>
          <History entries={history} onDelete={handleDelete} />
        </aside>
      </div>
    </div>
  )
}
