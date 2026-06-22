import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { History } from './History'
import { HistoryEntry } from '../api/history'

const ENTRIES: HistoryEntry[] = [
  { id: 1, expression: '3 + 5', result: '8', created_at: '2024-01-01T00:00:00Z' },
  { id: 2, expression: '9 × 2', result: '18', created_at: '2024-01-01T00:01:00Z' },
]

describe('History', () => {
  it('renders empty state when no entries', () => {
    render(<History entries={[]} onDelete={vi.fn()} />)
    expect(screen.getByText('No calculations yet')).toBeInTheDocument()
  })

  it('renders all entries', () => {
    render(<History entries={ENTRIES} onDelete={vi.fn()} />)
    expect(screen.getByText('3 + 5')).toBeInTheDocument()
    expect(screen.getByText('8')).toBeInTheDocument()
    expect(screen.getByText('9 × 2')).toBeInTheDocument()
    expect(screen.getByText('18')).toBeInTheDocument()
  })

  it('calls onDelete with entry id', () => {
    const onDelete = vi.fn()
    render(<History entries={ENTRIES} onDelete={onDelete} />)
    const deleteButtons = screen.getAllByLabelText('Delete entry')
    fireEvent.click(deleteButtons[0])
    expect(onDelete).toHaveBeenCalledWith(1)
  })
})
