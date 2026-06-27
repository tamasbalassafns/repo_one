import type { HistoryEntry } from '../api/history'

interface Props {
  entries: HistoryEntry[]
  onDelete: (id: number) => void
}

export function History({ entries, onDelete }: Props) {
  if (entries.length === 0) {
    return <p className="history__empty">No calculations yet</p>
  }
  return (
    <ul className="history__list">
      {entries.map(entry => (
        <li key={entry.id} className="history__item">
          <span className="history__expr">{entry.expression}</span>
          <span className="history__eq"> = </span>
          <span className="history__result">{entry.result}</span>
          <button
            className="history__delete"
            aria-label="Delete entry"
            onClick={() => onDelete(entry.id)}
          >
            ×
          </button>
        </li>
      ))}
    </ul>
  )
}
