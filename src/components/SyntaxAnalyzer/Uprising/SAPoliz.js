/* eslint-disable */
// import Lexeme from '@/components/LexemAnalyzer/Lexeme'
import { mapTableToObjectWithKeys } from '@/utils/utility'
import { priorities } from "./priorities";

export default function parserUprising(lexemsJSON) {
  let lexems = JSON.parse(lexemsJSON)
  addValuesToLexems(lexems)

  let outputTable = []
  parser(lexems, outputTable)

  outputTable = mapTableToObjectWithKeys(outputTable, ['operation', 'stack', 'poliz'])
  return outputTable // TODO: can be shortened
}

// add extra 'value' property to lexems for poliz algorithm 
function addValuesToLexems(lexems) {
  for (let lexem of lexems) {
    if (isDefined(lexem.idCode)) {
      lexem.value = 'IDN'
    } else if (isDefined(lexem.constCode)) {
      lexem.value = 'CON'
    } else if (isDefined(lexem.labelCode)) {
      lexem.value = 'LAB'
    } else {
      lexem.value = null
    }
  }
}

// main parser function
let parser = function(lexems, outputTable) {
  console.log('initial lexems')
  console.log(lexems)

  let stack = [],
      input = [],
      poliz = []

  for (let i in lexems) {
    input[i] = lexems[i]
  }
  dijkstra(lexems, stack, input, poliz, outputTable)
}

// dijkstra algorithm
let dijkstra = function(lexems, stack, input, poliz, outputTable) {
  let tags = []

  // for loop helpers
  let loopVariable = '',
      loopFeature = 0,
      loopHelp = [],
      isLoop = []

  while (input.length !== 0) {
    console.log('   --- input[0]: ' + input[0].title)
    console.log('   === stack: ')
    let stackOut = []
    for (let i in stack) stackOut[i] = stack[i].title
    console.log(stackOut)
    console.log('   === ======================')

    pushOutputTable(outputTable, input[0].title, stack, poliz)

    // 1) IDN or CON [or LAB]
    if (input[0].value !== null) {
      poliz.push(input[0].title)
      input.shift()
    }
    // 2) operations
    else if (isInPriorities(input[0].title, priorities) && stack.length !== 0) {
      console.log('current token: ' + input[0].title)
      console.log('input')
      console.log(input)
      let stackOut = []
      for (let i in stack) stackOut[i] = stack[i].title
      console.log(stackOut)
      
      while (stack.length !== 0) {
        console.log('current token: ' + input[0].title)

        // if

        // for

        if (input[0].title === ')') {
          while (stack[stack.length - 1].title !== '(') {
            let stackUnit = stack.pop()
            poliz.push(stackUnit.title)
          }
          stack.pop()
          input.shift()
          break
        }

        // if (input[0].title === '\n') {
        // } else 
        else if (stack.length !== 0 &&
            priorities[stack[stack.length - 1].title].stack >= priorities[input[0].title].compare) {
          let stackItem = stack.pop()
          poliz.push(stackItem.title)
        } else {
          stack.push(input.shift())
          break
        }
      }
    }
    // 3) Empty stack
    else if (isInPriorities(input[0].title, priorities) && stack.length === 0) {
      if (input[0].title === '\n') {
        input.shift()
      } else {
        stack.push(input.shift())
      }
    }
    // filter through not needed symbols (e.g., '{', '}', ...)
    else {
      input.shift()
    }
  }

  // 4) Empty input
  while (stack.length !== 0) {
    let stackItem = stack.pop()
    poliz.push(stackItem.title) // SO -> poliz
  }
    
  pushOutputTable(outputTable, '', stack, poliz)
}




// Utility functions

// check if current operation is present in priorities table
function isInPriorities(operation, priorities) {
  return Object.keys(priorities).includes(operation)
}

// easier check for null / undefined
function isDefined(value) {
  return (value !== null && value !== undefined)
}

// pushing to Output Poliz Table
function pushOutputTable(tab, operation, stack, poliz) {
  // symbol (current) | stack (full) | poliz (current)
  let stackOutput = []
  for (let i in stack) stackOutput[i] = stack[i].title
  tab.push([operation, stackOutput.join(' '), poliz.join(' ')])
}

// easy debug
function debug(variable) {
  // console.log(`>> ${Object.keys({variable})[0]} :`)
  console.log(`>>> debugging... <<<`)
  console.log(variable)
}

// easier conversion to float
function float(str) {
  return Number.parseFloat(str)
}

export { parserUprising }