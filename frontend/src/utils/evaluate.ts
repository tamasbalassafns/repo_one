export type Token =
  | { type: 'number'; value: number }
  | { type: 'op'; value: string }
  | { type: 'paren'; value: '(' | ')' }

const OPERATORS = ['+', '−', '×', '÷', '^']

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
    } else if (ch === '(' || ch === ')') {
      tokens.push({ type: 'paren', value: ch })
      i++
    } else if (OPERATORS.includes(ch)) {
      tokens.push({ type: 'op', value: ch })
      i++
    } else {
      throw new Error(`Unknown token: ${ch}`)
    }
  }
  return tokens
}

// Recursive-descent parser. Precedence (low → high):
//   expr   :  + −           (left-associative)
//   term   :  × ÷           (left-associative)
//   power  :  ^             (right-associative)
//   factor :  number | ( expr )
export function evaluate(expr: string): number {
  if (!expr.trim()) throw new Error('Empty expression')
  const tokens = tokenize(expr)
  let pos = 0

  const peek = (): Token | undefined => tokens[pos]

  function parseExpr(): number {
    let value = parseTerm()
    let tok = peek()
    while (tok?.type === 'op' && (tok.value === '+' || tok.value === '−')) {
      pos++
      const right = parseTerm()
      value = tok.value === '+' ? value + right : value - right
      tok = peek()
    }
    return value
  }

  function parseTerm(): number {
    let value = parsePower()
    let tok = peek()
    while (tok?.type === 'op' && (tok.value === '×' || tok.value === '÷')) {
      pos++
      const right = parsePower()
      value = tok.value === '×' ? value * right : value / right
      tok = peek()
    }
    return value
  }

  function parsePower(): number {
    const base = parseFactor()
    const tok = peek()
    if (tok?.type === 'op' && tok.value === '^') {
      pos++
      // Right-associative: the exponent is itself a power expression.
      return Math.pow(base, parsePower())
    }
    return base
  }

  function parseFactor(): number {
    const tok = peek()
    if (!tok) throw new Error('Invalid expression')
    if (tok.type === 'number') {
      pos++
      return tok.value
    }
    if (tok.type === 'paren' && tok.value === '(') {
      pos++
      const value = parseExpr()
      const close = peek()
      if (close?.type !== 'paren' || close.value !== ')') {
        throw new Error('Mismatched parentheses')
      }
      pos++
      return value
    }
    throw new Error('Invalid expression')
  }

  const result = parseExpr()
  if (pos !== tokens.length) throw new Error('Invalid expression')
  return result
}
