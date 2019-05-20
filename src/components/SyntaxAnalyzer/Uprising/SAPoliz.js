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
    console.log('> current input[0] and stack: \'' + input[0].title + '\'')
    let stackOut = []
    for (let i in stack) stackOut[i] = stack[i].title
    console.log(stackOut)
    console.log(' ===================================')

    pushOutputTable(outputTable, input[0].title, stack, poliz)

    // 1) IDN or CON [or LAB]
    if (input[0].value !== null) {
      poliz.push(input[0].title)
      input.shift()
    }
    // 2) operations
    else if (isInPriorities(input[0].title, priorities) && stack.length !== 0) {
      console.log('>> current input[0] and stack: \'' + input[0].title + '\'')
      let stackOut = []
      for (let i in stack) stackOut[i] = stack[i].title
      console.log(stackOut)
      
      while (stack.length !== 0) {
        console.log('>>> current token (input[0]): ' + input[0].title)
        console.log('>>> tags: ' + tags)

        // uncond statement
        if (input[0].title === 'goto') {
          console.log('Processing uncond statement')
          input.shift()
          poliz.push('m_' + input.shift().title)
          poliz.push('UPH')
          if (stack[stack.length - 1].title === 'if') {
            stack.pop() // popping off the ending 'm_' tag for cond statement
            poliz.push(tags.shift())
            poliz.push(':')
          }
          break
        }

        // cond statement
        else if (input[0].title === 'then') {
          console.log('Processing middle cond statement')
          input.shift()

          let indexIf = stack.length - 1
          for (; indexIf >= 0; indexIf--)
            if (stack[indexIf].title === 'if') break

          let i = stack.length - 1 // 2 - 1 =  1
          while (i-- > indexIf) // while stack[i] is not 'if'
            poliz.push(stack.pop().title)

          tags.unshift('m_')
          tags[0] = '' + tags[0] + (tags.length.toString() - 1)
          poliz.push(tags[0])
          poliz.push('UPH')
          break
        }

        // loop

        // ()
        else if (input[0].title === ')') {
          console.log('Processing ()')
          while (stack[stack.length - 1].title !== '(')
            poliz.push(stack.pop().title)
          stack.pop()
          input.shift()
          break
        }
        // input
        else if (input[0].title === 'iput') {
          console.log('Processing iput <<')
          stack.push(input.shift())
          poliz.push('IPUT')
          break
        }
        // output
        else if (input[0].title === 'oput') {
          console.log('Processing oput >>')
          stack.push(input.shift())
          poliz.push('OPUT')
          break
        }
        // wrapping \n
        else if (input[0].title === '\n') {
          console.log('Processing wrapping \\n')
          while (stack.length !== 0 && stack[stack.length - 1].row === input[0].row - 1) {
            if (stack[stack.length - 1].title === 'oput') {
              console.log('Processing end of output')
              poliz.push('oEND')
              stack.pop()
            } else if (stack[stack.length - 1].title === 'iput') {
              console.log('Processing end of input')
              poliz.push('iEND')
              stack.pop()
            } else {
              let stackUnit = stack.pop()
              poliz.push(stackUnit.title)
            }
          }
          input.unshift()
          break
        }
        else if (stack.length !== 0 &&
            priorities[stack[stack.length - 1].title].stack >= priorities[input[0].title].compare) {
          console.log(stack[stack.length - 1].title + ' is >= than ' + input[0].title)
          console.log('So we are outputting to poliz from stack')
          poliz.push(stack.pop().title)
        }
        else {
          console.log('Putting to stack from input')
          stack.push(input.shift())
          break
        }
      }
    }
    // 3) Empty stack
    else if (isInPriorities(input[0].title, priorities) && stack.length === 0) {
      if (input[0].title === '\n') {
        input.shift()
      } 
      
      // label
      else if (input[0].title === '@') {
        console.log('Processing label')
        input.shift()
        poliz.push('m_' + input.shift().title)
        poliz.push(':')
      }
      // uncond statement
      else if (input[0].title === 'goto') {
        console.log('Processing uncond statement | no stack')
        input.shift()
        poliz.push('m_' + input.shift().title)
        poliz.push('UPH')
      }

      // cond statement
      else if (input[0].title === 'if') {
        console.log('Processing start of cond statement')
        stack.push(input.shift())
      }

      // loop


      // input / output
      else if (input[0].title === 'iput' || input[0].title === 'oput') {
        console.log('Processing start of iput/oput')
        poliz.push(input[0].title)
        stack.push(input.shift())
      } 
      else {
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
    poliz.push(stack.pop().title) // SO -> poliz
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