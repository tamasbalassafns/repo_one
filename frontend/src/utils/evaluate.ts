export type Token = { type: 'number'; value: number } | { type: 'op'; value: string }

function tokenize(expr: string): Token[] {
  const tokens: Token[] = []
  let i = 0
  while (i < expr.length) {
    const ch = expr[i]
    if (ch === ' ') { i++; continue }
    if ('0123456789.'.includes(ch)) {
      let num = ''
      while (i < expr.length && '0123456789.'.includes(expr[i])) num += expr[i++]
      tokens.push({ type: 'number', value: parseFloat(num) })
    } else if (['+', '−', '×', '÷'].includes(ch)) {
      tokens.push({ type: 'op', value: ch })
      i++
    } else {
      throw new Error(`Unknown token: ${ch}`)
    }
  }
  return tokens
}

export function evaluate(expr: string): number {
  if (!expr.trim()) throw new Error('Empty expression')
  let tokens = tokenize(expr)

  // First pass: resolve × and ÷
  let pass1: Token[] = []
  let j = 0
  while (j < tokens.length) {
    const tok = tokens[j]
    if (tok.type === 'op' && (tok.value === '×' || tok.value === '÷')) {
      const left = pass1.pop()
      const right = tokens[j + 1]
      if (!left || !right || left.type !== 'number' || right.type !== 'number') {
        throw new Error('Invalid expression')
      }
      const result = tok.value === '×' ? left.value * right.value : left.value / right.value
      pass1.push({ type: 'number', value: result })
      j += 2
    } else {
      pass1.push(tok)
      j++
    }
  }

  // Second pass: resolve + and −
  if (pass1[0]?.type !== 'number') throw new Error('Invalid expression')
  let acc = (pass1[0] as { type: 'number'; value: number }).value
  let k = 1
  while (k < pass1.length) {
    const op = pass1[k]
    const right = pass1[k + 1]
    if (!op || !right || op.type !== 'op' || right.type !== 'number') {
      throw new Error('Invalid expression')
    }
    acc = op.value === '+' ? acc + right.value : acc - right.value
    k += 2
  }
  return acc
}
