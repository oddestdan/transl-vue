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
      

      // assignment

      // if

      // for
    }

    // main logic here


    poliz.shift()
  }
}


function pushVariables(varType, stack, vars) {
  while (stack.length !== 0) {
    vars.push({
      title: stack.pop(),
      value: null,
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
      if (v.value !== null)
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
      log(v.value !== null ? v.value : (v.title + ': undefined'))
      // console.log(`${v.title}: ${v.value}`)
    } else {
      log(item)
    }
    
    poliz.shift()
    item = poliz[0]
  }
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

function getVariable(item, vars) {
  return vars.find(v => v.title === item)
}

function log(string) {
  console.log(`>> ${string}`)
}