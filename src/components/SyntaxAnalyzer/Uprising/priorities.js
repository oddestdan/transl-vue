/* eslint-disable */
export let priorities = {
  // '{':      { stack: 0, compare: 0 },
  '(':      { stack: 0, compare: 10 },
  'if':     { stack: 0, compare: 0 },
  'for':    { stack: 0, compare: 0 },
  'iput':   { stack: 0, compare: 0 },
  'oput':   { stack: 0, compare: 0 },

  // '}':      { stack: 1, compare: 1 },
  ')':      { stack: 1, compare: 1 },
  'goto':   { stack: 1, compare: 1 },
  'then':   { stack: 1, compare: 1 },
  'by':     { stack: 1, compare: 1 },
  'while':  { stack: 1, compare: 1 },
  'do':     { stack: 1, compare: 1 },
  '\n':     { stack: 1, compare: 1 },

  '=':      { stack: 2, compare: 11 },
  'int':    { stack: 2, compare: 10 },
  'fixed':  { stack: 2, compare: 10 },
  'label':  { stack: 2, compare: 10 },

  '<':      { stack: 3, compare: 3 },
  '<=':     { stack: 3, compare: 3 },
  '>':      { stack: 3, compare: 3 },
  '>=':     { stack: 3, compare: 3 },
  '!=':     { stack: 3, compare: 3 },
  '==':     { stack: 3, compare: 3 },

  '+':      { stack: 4, compare: 4 },
  '-':      { stack: 4, compare: 4 },
  '*':      { stack: 5, compare: 5 },
  '/':      { stack: 5, compare: 5 },
  '@':      { stack: 5, compare: 5 }
}
