import { useState, useEffect, useRef } from 'react'
import { evaluate } from '../utils/evaluate'

interface Props {
  onResult: (expression: string, result: string) => void
}

const BUTTONS = [
  ['C', '⌫', '(', ')'],
  ['7', '8', '9', '÷'],
  ['4', '5', '6', '×'],
  ['1', '2', '3', '−'],
  ['0', '.', '^', '+'],
  ['='],
]

// Maps a keyboard key to the equivalent calculator button label.
// Digits and '.' are handled separately. ASCII operators map to the
// Unicode symbols the evaluator expects.
const KEY_MAP: Record<string, string> = {
  '+': '+',
  '-': '−',
  '*': '×',
  '/': '÷',
  '^': '^',
  '(': '(',
  ')': ')',
  '.': '.',
  '=': '=',
  Enter: '=',
  Backspace: '⌫',
  Escape: 'C',
  Delete: 'C',
}

export function Calculator({ onResult }: Props) {
  const [expr, setExpr] = useState('')
  const [error, setError] = useState(false)

  function handleButton(label: string) {
    setError(false)
    if (label === 'C') {
      setExpr('')
      return
    }
    if (label === '⌫') {
      setExpr(e => e.slice(0, -1))
      return
    }
    if (label === '=') {
      // Nothing to evaluate unless the expression contains an operator.
      // This also stops a bare result (after a prior '=') from being re-saved.
      if (!['+', '−', '×', '÷', '^'].some(op => expr.includes(op))) return
      try {
        const result = evaluate(expr)
        if (!Number.isFinite(result)) throw new Error('Math error')
        const resultStr = String(parseFloat(result.toFixed(10)))
        onResult(expr, resultStr)
        setExpr(resultStr)
      } catch {
        setError(true)
      }
      return
    }
    const ops = ['+', '−', '×', '÷', '^']
    if (ops.includes(label) && ops.includes(expr.slice(-1))) {
      setExpr(e => e.slice(0, -1) + label)
    } else {
      setExpr(e => e + label)
    }
  }

  // Keep a ref to the latest handler so the keydown listener (attached once)
  // always sees current state without re-binding on every render.
  const handleButtonRef = useRef(handleButton)
  handleButtonRef.current = handleButton

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const label = /^[0-9]$/.test(e.key) ? e.key : KEY_MAP[e.key]
      if (label === undefined) return
      e.preventDefault()
      handleButtonRef.current(label)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  function isOperator(label: string) {
    return ['÷', '×', '−', '+', '^'].includes(label)
  }

  function isAction(label: string) {
    return label === 'C' || label === '⌫'
  }

  return (
    <div className="calculator">
      <div className={`display${error ? ' display--error' : ''}`}>
        <span className="display__expr">{expr || '0'}</span>
      </div>
      <div className="buttons">
        {BUTTONS.map((row, ri) => (
          <div key={ri} className="buttons__row">
            {row.map(label => (
              <button
                key={label}
                className={`btn${isOperator(label) ? ' btn--op' : ''}${isAction(label) ? ' btn--action' : ''}${label === '=' ? ' btn--eq' : ''}`}
                onClick={() => handleButton(label)}
              >
                {label}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
