/* eslint-disable */
export default function runProgram(lexemsJSON, poliz) {
  let lexems = JSON.parse(lexemsJSON)
  run(poliz)
}

function run(poliz) {
  alert('running the program!\n' + poliz.join(' | '))
  console.log('RUNNING PROGRAM')

  const polizCopy = [...poliz]

  let stack = []
  let vars = []
  let loopTags = [ { title: 'r_0', value: undefined }, { title: 'r_1', value: undefined } ]

  let currentItem = ''


  // Declaration block
  while (currentItem !== 'EoDecl') {
    currentItem = poliz.shift()
    if (isVariableType(currentItem)) {  // Encountered variable type
      pushVariables(currentItem, stack, vars)
    } else {                            // Encountered variable
      stack.push(currentItem)
    }
  }
  stack.pop() // remove 'EoDecl'

  // Operation block
  while (currentItem !== 'EoOper') {
    currentItem = poliz[0]

    // console.log('main stack: ')
    // console.log(stack)
    // console.log('main poliz: ')
    // console.log(poliz)
    
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
        processAssignment(vars, loopTags, stack)
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
      // push value to stack
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
  console.log('END OF PROGRAM')
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
      let v = vars.find(v => v.title === item)
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
      let v = vars.find(v => v.title === item)
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

function processAssignment(vars, tags, stack) {
  let value = stack.pop()
  let assignee = stack.pop()

  // console.log(`|| v2 PROCESSING ASSIGNMENT (v: ${value} | ass: ${assignee})`)

  // process for variables
  let indexVar = vars.findIndex(v => v.title === assignee)
  let indexTag = tags.findIndex(v => v.title === assignee)

  if (indexVar !== -1) {        // among vars title
    vars[indexVar].value = value
  } else {
    indexVar = vars.findIndex(el => el.value === assignee)
    if (indexVar !== -1) {      // among vars values
      vars[indexVar].value = value
    } else {
      if (indexTag !== -1) {    // among tags titles
        tags[indexTag].value = value
      } else {
        indexTag = tags.findIndex(el => el.value === assignee)
        if (indexTag !== -1) {  // among tags values
          tags[indexTag].value = value
        } else {
          // default case (never is) !!!
          console.log('---------------------------')
          console.log('<< DEFAULT CASE INCOMING >>')
          console.log('---------------------------')
          stack.push(value)
        }
      }
    }
  }
}

function processRelation(sign, stack) {
  let right = stack.pop()
  let left = stack.pop()
  
  // console.log(` !!! PROCESSING RELATION: ${left} vs ${right}`)
  // console.log([left])
  // console.log([right])

  if (sign === '>')       return left > right
  else if (sign === '>=') return left >= right
  else if (sign === '<')  return left < right
  else if (sign === '<=') return left <= right
  else if (sign === '==') return left == right
  else                    return left != right
}

function processTagOperation(tag, poliz, polizCopy) {
  // console.log(` ||| IN PROCESS TAG (${tag})`)

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
  // console.log(` |||| IN CHECK GET VALUE (${value}) (${typeof value})`)
  // console.log(array)

  // check for array of variables
  for (let v of array)
    if (v.title === value)
      return (v.value === undefined) ? v.title : v.value
  // constants
  return value
}

function log(string) {
  console.log(`>> ${string}`)
}