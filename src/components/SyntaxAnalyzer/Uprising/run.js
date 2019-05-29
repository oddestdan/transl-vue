/* eslint-disable */
export default function runProgram(lexemsJSON, poliz) {
  let lexems = JSON.parse(lexemsJSON)
  console.log('RUNNING PROGRAM')

  // return run(poliz)
  run(poliz)
}

function run(poliz) {
  alert('running the program!\n' + poliz.join(' | '))

  const polizCopy = [...poliz]

  let stack = []
  let vars = []
  let loopTags = [ { title: 'r_0', value: undefined }, { title: 'r_1', value: undefined } ]

  let currentItem = ''


  // Declaration
  while (currentItem !== 'EoDecl') {
    currentItem = poliz.shift()
    if (isVariableType(currentItem)) {  // Encountered variable type
      pushVariables(currentItem, stack, vars)
    } else {                            // Encountered variable
      stack.push(currentItem)
    }
  }
  stack.pop() // remove 'EoDecl'

  console.log('vars')
  console.log(vars)

  // Operation
  // while (currentItem !== 'EoOper') {
  for (let i = 0; i < 80; i++) {
    currentItem = poliz[0]

    console.log('main stack: ')
    console.log(stack)
    console.log('main poliz: ')
    console.log(poliz)
    // console.log(`main tag1: v ${loopTags[0].value} | t ${loopTags[0].title}`)
    // console.log(`main tag1: v ${loopTags[1].value} | t ${loopTags[1].title}`)
    
    if (currentItem === 'IPUT') {         // Processing input
      processInput(poliz, vars)
    } else if (currentItem === 'OPUT') {  // Processing output
      processOutput(poliz, vars)
    } else {                              // Other operation
      // arithmetic operation
      if (itemAmongArithmSigns(currentItem)) {
        processArithmOperation(currentItem, stack)
      } 
      // assignment
      else if (currentItem === '=') {
        processAss(vars, stack)
        // processAssignment(vars, stack, loopTags)
      }
      // relation
      else if (itemAmongRelSigns(currentItem)) {
        let relation = processRelation(currentItem, stack)
        poliz.shift()               // rel sign
        let tagUPH = poliz.shift()  // m_x

        if (!relation)              // follow UPH
          poliz = processTagOperation(tagUPH, poliz, polizCopy)
      }
      // uncond operation
      else if (currentItem === 'BP') {
        poliz = processTagOperation(stack.pop(), poliz, polizCopy)
      }
      else {
        if (itemAmongArray(currentItem, vars))
          currentItem = checkGetValue(currentItem, vars)
        if (itemAmongArray(currentItem, loopTags))
          currentItem = checkGetValue(currentItem, loopTags)
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
    if (itemAmongArray(item, vars)) {
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
  let output = []

  while (item !== 'oEND') {
    if (itemAmongArray(item, vars)) {
      let v = getVariable(item, vars)
      output.push(v.value !== undefined ? v.value : (v.title + ': undefined'))
    } else {
      output.push(item)
    }
    poliz.shift()
    item = poliz[0]
  }

  log(output.join(' '))
}

function processArithmOperation(sign, stack) {
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

function processAssignment(vars, stack, loopTags) {
  let value = stack.pop()
  let assignee = stack.pop()
  console.log(`|| PROCESSING ASSIGNMENT (v: ${value} | ass: ${assignee})`)

  let index = getVariableIndex(assignee, vars)
  if (index === -1) {
    // processing usual values
    if (!isNaN(assignee)) {
      index = vars.findIndex(el => el.value === assignee)
      vars[index].value = value
    }
    // processing r_x
    else {
      console.log('] loop tags:')
      let i = loopTags.findIndex(el => el.title === assignee)
      console.log(`] tag1: v ${loopTags[0].value} | t ${loopTags[0].title}`)
      console.log(`] tag1: v ${loopTags[1].value} | t ${loopTags[1].title}`)
      console.log(`] index: ${i}`)
      if (i !== -1)
        loopTags[i].value = value
    }
  } else {
    vars[index].value = value
  }
}

function processAss(array, stack) {
  let value = stack.pop()
  let assignee = stack.pop()
  console.log(`|| v2 PROCESSING ASSIGNMENT (v: ${value} | ass: ${assignee})`)

  let index = array.findIndex(v => v.title === assignee)
  if (index === -1) {
    if (!isNaN(assignee)) {
      index = array.findIndex(el => el.value === assignee)
    }
  }
  array[index].value = value
}

function processRelation(sign, stack) {
  let right = stack.pop()
  let left = stack.pop()
  console.log(`Relating: ${left} vs ${right}`)
  console.log([left])
  console.log([right])

  if (sign === '>')       return left > right
  else if (sign === '>=') return left >= right
  else if (sign === '<')  return left < right
  else if (sign === '<=') return left <= right
  else if (sign === '==') return left == right
  else                    return left != right
}

function processTagOperation(tag, poliz, polizCopy) {
  console.log(` ||| IN PROCESS TAG (${tag})`)
  // need to search through the full poliz ?

  // let index = poliz.findIndex(el => el === `${tag}:`)
  // poliz.splice(0, index)
  let index = polizCopy.findIndex(el => el === `${tag}:`)
  return poliz = [...polizCopy.slice(index)]
}


// Utility functions
function isVariableType(item) {
  return item === 'int' || item === 'fixed' || item === 'label'
}

function itemAmongArray(item, array) {
  for (let v of array) {
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
function itemAmongRelSigns(sign) {
  let signs = ['>', '>=', '<', '<=', '==', '!=']
  for (let s of signs)
    if (s === sign) return true
  return false
}

// push only values to stack (instead of variables)
function checkGetValue(value, array) {
  // check for array of variables
  for (let v of array)
    if (v.title === value)
      return (v.value === undefined) ? v.title : v.value
  // constants
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