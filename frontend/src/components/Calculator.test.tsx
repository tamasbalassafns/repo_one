import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { Calculator } from './Calculator'

function display() {
  return document.querySelector('.display__expr') as HTMLElement
}

describe('Calculator', () => {
  it('renders initial display as 0', () => {
    render(<Calculator onResult={vi.fn()} />)
    expect(display().textContent).toBe('0')
  })

  it('builds expression on digit clicks', () => {
    render(<Calculator onResult={vi.fn()} />)
    fireEvent.click(screen.getByText('4'))
    fireEvent.click(screen.getByText('2'))
    expect(display().textContent).toBe('42')
  })

  it('calls onResult with correct values on =', () => {
    const onResult = vi.fn()
    render(<Calculator onResult={onResult} />)
    fireEvent.click(screen.getByText('3'))
    fireEvent.click(screen.getByText('+'))
    fireEvent.click(screen.getByText('5'))
    fireEvent.click(screen.getByText('='))
    expect(onResult).toHaveBeenCalledWith('3+5', '8')
  })

  it('clears expression on C', () => {
    render(<Calculator onResult={vi.fn()} />)
    fireEvent.click(screen.getByText('9'))
    fireEvent.click(screen.getByText('C'))
    expect(display().textContent).toBe('0')
  })

  it('removes last char on ⌫', () => {
    render(<Calculator onResult={vi.fn()} />)
    // Click the '7' button (there is only one button labelled '7')
    const btn7 = within(document.querySelector('.buttons') as HTMLElement).getByText('7')
    fireEvent.click(btn7)
    fireEvent.click(screen.getByText('8'))
    fireEvent.click(screen.getByText('⌫'))
    expect(display().textContent).toBe('7')
  })

  it('shows error state on invalid expression', () => {
    render(<Calculator onResult={vi.fn()} />)
    fireEvent.click(screen.getByText('+'))
    fireEvent.click(screen.getByText('='))
    expect(document.querySelector('.display--error')).toBeInTheDocument()
  })
})
