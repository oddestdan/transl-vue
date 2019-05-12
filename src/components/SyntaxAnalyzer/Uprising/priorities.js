/* eslint-disable */
export let priorities = {
  '(':      { stack: 0, compare: 10 },
  '{':      { stack: 0, compare: 10 },
  'if':     { stack: 0, compare: 10 },
  'for':    { stack: 0, compare: 10 },
  'iput':   { stack: 0, compare: 10 },
  'oput':   { stack: 0, compare: 10 },

  '\\n':    { stack: 1, compare: 1 },
  ')':      { stack: 1, compare: 1 },
  '}':      { stack: 1, compare: 1 },
  'goto':   { stack: 1, compare: 1 },
  'then':   { stack: 1, compare: 1 },
  'by':     { stack: 1, compare: 1 },
  'while':  { stack: 1, compare: 1 },
  'do':     { stack: 1, compare: 1 },

  '=':      { stack: 2, compare: 101 },
  'int':    { stack: 2, compare: 101 },
  'float':  { stack: 2, compare: 101 },
  'label':  { stack: 2, compare: 101 },

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
