/* eslint-disable */
import { mapTableToObjectWithKeys } from '@/utils/utility'
import { priorities } from "./priorities";

export default function parserUprising(lexemsJSON) {
  let lexems = JSON.parse(lexemsJSON)
  addValuesToLexems(lexems)

  let outputTable = []
  let poliz = []
  parser(lexems, poliz, outputTable)

  outputTable = mapTableToObjectWithKeys(outputTable, ['operation', 'stack', 'poliz'])
  return [poliz, outputTable]
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
let parser = function(lexems, poliz, outputTable) {
  let stack = [],
      input = []

  for (let i in lexems) {
    input[i] = lexems[i]
  }
  dijkstra(stack, input, poliz, outputTable)
}

// dijkstra algorithm
let dijkstra = function(stack, input, poliz, outputTable) {
  let tags = []
  let loopVar = ''
  let prevInput

  while (input.length !== 0) {
    prevInput = input[0]

    pushOutputTable(outputTable, input[0].title, stack, poliz)

    // 1) IDN or CON [or LAB]
    if (input[0].value !== null) {
      poliz.push(input[0].title)
      input.shift()
    }
    // 2) operations
    else if (isInPriorities(input[0].title, priorities) && stack.length !== 0) {
      while (stack.length !== 0) {
        // unary minus
        if (input[0].title === '-') {
          if (prevInput.value !== 'IDN' &&
              prevInput.value !== 'CON' &&
              prevInput.title !== ')') {
            input[0].title = '@'
          }
        }
        // uncond statement
        else if (input[0].title === 'goto') {
          console.log('Processing uncond statement')
          input.shift()
          poliz.push('m_' + input.shift().title)
          poliz.push('BP')
          if (stack[stack.length - 1].title === 'if') {
            stack.pop() // popping off the ending 'm_' tag for cond statement
            poliz.push(`${tags[tags.length - 1].title}:`)
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

          let i = stack.length - 1
          while (i-- > indexIf) // while stack[i] is not 'if'
            poliz.push(stack.pop().title)

          tags.push({ title: `m_${tags.length}`, code: 200 })
          poliz.push(tags[tags.length - 1].title)
          poliz.push('UPH')
          break
        }
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
          while (stack.length !== 0
            && stack[stack.length - 1].row === input[0].row - 1) {

            if (stack.length >= 4 && stack[stack.length - 4].title === 'for') {
              console.log('Processing end of loop')
              poliz.push(stack[stack.length - 3].title) // m_0
              poliz.push('BP') // BP
              poliz.push(`${stack[stack.length - 1].title}:`) // m_2:

              // stack.splice(stack.length - 4, 4) // remove: for m1 m2 m3
              for (let i = 0; i < 4; i++)
                stack.pop()
            }
            else if (stack[stack.length - 1].title === 'oput') {
              console.log('Processing end of output')
              poliz.push('oEND')
              stack.pop()
            }
            else if (stack[stack.length - 1].title === 'iput') {
              console.log('Processing end of input')
              poliz.push('iEND')
              stack.pop()
            }
            else {
              console.log('Processing else in wrapping \\n')
              let stackUnit = stack.pop()
              poliz.push(stackUnit.title)
            }
          }

          input.unshift()
          break
        }
        // loop
        else if (stack.length >= 4 && stack[stack.length - 4].title === 'for') {
          console.log('Processing for loop | stack is full')
          if (input[0].title === '=') {
            let tl = tags.length

            // loopVar = IDN // CON --> i 0 =
            stack.push(input.shift()) // = -> stack
            poliz.push(input.shift().title) // IDN // CON
            poliz.push(stack.pop().title)   // = <- stack

            // by --> r0 1 = m0 : r1
            input.shift() // by
            // loopHelp.push(`r_${loopHelp.length - 1}`) // r_0
            poliz.push(...['r_0', '1', '=', `${tags[tl - 3].title}:`, 'r_1'])

            // step --> step
            poliz.push(input.shift().title) // step

            // while --> = r0 0 = m1 UPH lVar lVar r1 + = m1 : r0 0 =
            input.shift() // while
            poliz.push(...['=', 'r_0', '0', '==', tags[tl - 2].title, 'UPH'])
            poliz.push(...[loopVar, loopVar, 'r_1', '+', '='])
            poliz.push(...[`${tags[tl - 2].title}:`, 'r_0', '0', '='])

            // relation --> poliz(relation)
            poliz.push(input.shift().title) // 1st
            stack.push(input.shift()) // sign -> stack
            poliz.push(input.shift().title) // 2nd
            poliz.push(stack.pop().title)   // sign <- stack

            // do --> m2 UPH
            input.shift() // do
            poliz.push(...[tags[tl - 1].title, 'UPH'])

            // operation --> poliz(operation)
            // .....
          }
        }
        else if (stack.length !== 0
          && stack[stack.length - 1].code !== 200 // ! poliz tag 
          && priorities[stack[stack.length - 1].title].stack >= priorities[input[0].title].compare) {
          
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
        poliz.push(`m_${input.shift().title}:`)
      }
      // uncond statement
      else if (input[0].title === 'goto') {
        console.log('Processing uncond statement | no stack')
        input.shift()
        poliz.push('m_' + input.shift().title)
        poliz.push('BP')
      }
      // cond statement
      else if (input[0].title === 'if') {
        console.log('Processing start of cond statement')
        stack.push(input.shift())
      }
      // loop
      else if (input[0].title === 'for') {
        console.log('Processing start of loop')
        stack.push(input.shift())

        let tl = tags.length
        for (let i = tl; i < tl + 3; i++) {
          tags[i] = {
            title: `m_${i}`,
            code: 200,
            row: stack[stack.length - 1].row
          }
          stack.push(tags[i])
        }

        loopVar = input[0].title
        poliz.push(input.shift().title) // loopVar
      }
      // input / output
      else if (input[0].title === 'iput' || input[0].title === 'oput') {
        console.log('Processing start of iput/oput')
        poliz.push(input[0].title)
        stack.push(input.shift())
      }
      else {
        console.log('Processing something else | stack is empty')
        stack.push(input.shift())
      }
    }
    // filter through not needed symbols (e.g., '{', '}', ...)
    else {
      // end of declarations EoDecl
      if (input[0].title === '{') {
        console.log('Processing end of declaration block')
        poliz.push('EoDecl')
      }
      // end of operations EoOper
      else if (input[0].title === '}') {
        console.log('Processing end of operation block')
        poliz.push('EoOper')
      }
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