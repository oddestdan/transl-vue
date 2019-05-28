/* eslint-disable */
export default function runProgram(lexemsJSON, poliz) {
  let lexems = JSON.parse(lexemsJSON)
  console.log('RUNNING PROGRAM')

  // return run(poliz)
  run(poliz)
}

function run(poliz) {
  alert('running the program!\n' + poliz.join(' | '))

  let stack = []
  let vars = []
  let cons = []

  let currentItem = ''


  // Declaration
  while (currentItem !== 'EoDecl') {
    currentItem = poliz[0]
    if (isVariableType(currentItem)) {  // Encountered variable type
      pushVariables(currentItem, stack, vars)
    } else {                            // Encountered variable
      stack.push(currentItem)
    }
    poliz.shift()
  }

  console.log('vars')
  console.log(vars)
  console.log('poliz')
  console.log(poliz)
  console.log('stack')
  console.log(stack)

  // Operation
  while (currentItem !== 'EoOper') {
    currentItem = poliz[0]

    if (currentItem === 'IPUT') {         // Processing input
      processInput(poliz, vars)
    } else if (currentItem === 'OPUT') {  // Processing output
      processOutput(poliz, vars)
    } else {                              // Other operation
      // process arithmetic first
      if (itemAmongArithmSigns(currentItem)) {
        processArithmOperation(currentItem, vars, stack)
      } else if (currentItem === '=') {
        processAssignment(vars, stack)
      }

      // assignment

      // if

      // for

      else {
        if (itemAmongVariables(currentItem, vars))
          currentItem = checkGetVarValue(currentItem, vars)
        // (/^\d+$/.test(currentItem))
        if (!isNaN(currentItem))
          currentItem = Number.parseInt(currentItem)
        stack.push(currentItem)
      }
    }

    poliz.shift()
  }
  
  console.log('vars')
  console.log(vars)
}


function pushVariables(varType, stack, vars) {
  while (stack.length !== 0) {
    vars.push({
      title: stack.pop(),
      value: undefined,
      type: varType
    })
  }
}

function processInput(poliz, vars) {
  poliz.shift()
  let item = poliz[0]

  while (item !== 'iEND') {
    if (itemAmongVariables(item, vars)) {
      let v = getVariable(item, vars)
      v.value = prompt('Enter value', '<value>')
      if (v.value !== undefined)
        log(`Successful input! ${v.title}: ${v.value}`)
      else
        log(`Failed input! ${v.title}: ${v.value}`)
    } else {
      log(`Can't input non-variable: ${v.title}`)
    }
    
    poliz.shift()
    item = poliz[0]
  }
}

function processOutput(poliz, vars) {
  poliz.shift()
  let item = poliz[0]

  while (item !== 'oEND') {
    if (itemAmongVariables(item, vars)) {
      let v = getVariable(item, vars)
      log(v.value !== undefined ? v.value : (v.title + ': undefined'))
      // console.log(`${v.title}: ${v.value}`)
    } else {
      log(item)
    }
    
    poliz.shift()
    item = poliz[0]
  }
}

// TODO: add variable support
function processArithmOperation(sign, vars, stack) {
  console.log(' ---- stack')
  console.log(stack)
  let ns = stack.length

  if (sign === '+')
    stack[ns - 2] = stack[ns - 2] + stack.pop()
  else if (sign === '-')
    stack[ns - 2] = stack[ns - 2] - stack.pop()
  else if (sign === '*')
    stack[ns - 2] = stack[ns - 2] * stack.pop()
  else if (sign === '/')
    stack[ns - 2] = stack[ns - 2] / stack.pop()
  else
    stack[ns - 1] = - stack[ns - 1]
}

// TODO: add variable support
function processAssignment(vars, stack) {
  let value = stack.pop()
  let index = getVariableIndex(stack.pop(), vars)
  vars[index].value = value
}


// Utility functions
function isVariableType(item) {
  return item === 'int' || item === 'fixed' || item === 'label'
}

function itemAmongVariables(item, vars) {
  for (let v of vars) {
    if (v.title === item) return true
  }
  return false
}
function itemAmongArithmSigns(sign) {
  let signs = ['+', '-', '*', '/', '@', '']
  for (let s of signs)
    if (s === sign) return true
  return false
}

// push only values to stack (instead of variables)
function checkGetVarValue(value, vars) {
  for (let v of vars)
    if (v.title === value)
      return (v.value === undefined) ? v.title : v.value
  return value
}

function getVariable(title, vars) {
  return vars.find(v => v.title === title)
}
function getVariableIndex(title, vars) {
  return vars.findIndex(v => v.title === title)
}

function log(string) {
  console.log(`>> ${string}`)
}