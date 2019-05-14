/* eslint-disable */
// import { lexemDictionary } from '@/components/LexemAnalyzer/lexemDictionary'
// import Lexeme from '@/components/LexemAnalyzer/Lexeme'
// import { displayParserError } from '@/utils/utility'
import { priorities } from "./priorities";

export default function parserUprising(lexemsJSON) {
  let lexems = JSON.parse(lexemsJSON)
  addValuesToLexems(lexems)

  let syntaxTable = parser(lexems)
  return syntaxTable // TODO: can be shortened
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
let parser = function(lexems) {
  console.log('those are lexems currently')
  console.log(lexems)

  let stack = [],
      input = [],
      output = []

  for (let i in lexems) {
    input[i] = lexems[i].title
  }

  console.log('input')
  console.log(input)

  dijkstra(lexems, stack, input, output)

  console.log('input')
  console.log(input)

  console.log('stack')
  console.log(stack)

  console.log('output')
  console.log(output)

  return []
}

// dijkstra algorithm
let dijkstra = function(lexems, stack, input, output) {
  for (let operation in input) {
    console.log('>>> ' + lexems[operation].value)

    // if IDN or CON [or LAB]
    if (lexems[operation].value !== null) {
      output.push(input[operation]) // IO -> output
      continue
    }

    let isCheckingStack = true
    while (isCheckingStack) {
      // console.log(stack[0])
      // console.log(priorities[stack[0]])
      // console.log(input[operation])
      // console.log(priorities[input[operation]])
      if (stack.length !== 0 && priorities[stack[0]].stack >= priorities[input[operation]].stack) {
        output.push(stack.shift()) // stack[0] -> output, repeat this part
      } else {
        stack.unshift(input[operation]) // IO -> stack
        isCheckingStack = false
      }
    }

    // if stack is empty
    if (stack.length === 0) {
      stack.unshift(input[operation]) // IO -> stack
    }
  }

  // if input is empty
  console.log('empty input -> clearing stack & adding it to output')
  console.log('stack is: ')
  console.log(stack)
  while (stack.length !== 0) {
    output.push(stack.shift()) // SO -> output
  }
}












// main parser function
// let parser = function(uprisingRelationTable, rulesArray) {
//   // Preparation
//   let counter = -1 // special counter for "{"
//   let syntaxTable = [] // step-by-step output table
//   let mainRelation = '' // main relation sign
//   let poliz = [] // poliz array of string values

//   let lexemDictInversed = {} // inversed lexemDictionary
//   Object.keys(lexemDictionary).forEach(key => (lexemDictInversed[lexemDictionary[key]] = key))

//   // add special values to lexems
//   for (let lexem of lexemTable) {
//     if (lexem.title === '\n') lexem.title = '\\n' // adjusting \n
    
//     if (lexem.code === 100) lexem.value = 'IDN'
//     else if (lexem.code === 101) lexem.value = 'CON'
//     else if (lexem.code === 102) lexem.value = 'LAB'
//     else lexem.value = lexem.title
//   }

//   // limit lexems via # at start and end
//   let start = new Lexeme(null, '#', null, null, null, null, null)
//   start.value = '#'
//   let end = new Lexeme(null, '#', null, null, null, null, null)
//   end.value = '#'
//   lexemTable = [start, ...lexemTable, end]

//   // RHS row of program words ['', '', ...]
//   let programInput = []
//   for (let i in lexemTable) programInput[i] = lexemTable[i].title
//   programInput.shift() // remove first '#'

//   // LHS stack of titles ['', '', ...]
//   let stack = [lexemTable.shift()]

//   // output
//   debug(lexemTable)
//   debug(programInput)
//   debug(stack)
//   debug(grammar)
//   debug(rulesArray)
//   // ================================================================================

//     // Parsing
//     while (stack.length !== 2 || lexemTable.length !== 1) {

//       if (stack[stack.length - 1].value === '\\n' && poliz.length !== 0) {
//         calculatePoliz(poliz)
//         poliz = [] // reset the poliz
//       }
  
//       if (stack[stack.length - 1].value === '{') counter++

//       if (stack[stack.length - 1].value === '#') {
//         mainRelation = '<'
//         pushSyntaxTable(syntaxTable, stack, mainRelation, programInput, poliz)
//       }
      
//       else if (lexemTable[0].value === '#') mainRelation = '>'
      
//       else {
//         let leftIndex = rulesArray.indexOf(stack[stack.length - 1].value)
//         let rightIndex = rulesArray.indexOf(lexemTable[0].value)
//         // debug('in left right indexes are: ' + leftIndex + ' & ' + rightIndex)
//         mainRelation = uprisingRelationTable[leftIndex][rightIndex]
//       }
  
//       if (stack[stack.length - 1] !== '#') {
//         pushSyntaxTable(syntaxTable, stack, mainRelation, programInput, poliz)
//       }
  
//       if (mainRelation === '<' || mainRelation === '=') {
//         let grammarKeys = []
//         for (let i in grammar) grammarKeys[i] = grammar[i].title

//         if (counter >= 0 && grammarKeys.indexOf('variable_list')) {
//           for (let lexIndex in grammar)
//             if (grammar[lexIndex].title === 'variable_list') grammar.splice(lexIndex, 1)
//         }
  
//         stack.push(lexemTable.shift())
//         programInput.shift()
//       }


//       else if (mainRelation === '>') {
//         let base = [] // accumulate the base in stack before excahnge
//         let stackIndex = 0 // general stack index
//         let gramIndex = 0 // general grammar index
//         let ruleVariant  = '' // some grammar rule from all RHS variants

//         // select the base from stack
//         for (stackIndex = stack.length - 1; stackIndex > 0; stackIndex--) {
//         // for (i = stack.length - 1; i > 0; i--) {
//           if (stack[stackIndex - 1].value === '#') {
//             base = stack.slice(stackIndex, stack.length)
//             for (let i in base) base[i] = base[i].value
//             break
//           } 
          
//           else {
//             let stackLeftIndex = rulesArray.indexOf(stack[stackIndex - 1].value)
//             let stackRightIndex = rulesArray.indexOf(stack[stackIndex].value)
//             let relation = uprisingRelationTable[stackLeftIndex][stackRightIndex]
//             if (relation === '<') {
//               base = stack.slice(stackIndex, stack.length)
//               for (let i in base) base[i] = base[i].value
//               break
//             }
//           }
//         }

//         // all LHS values of the grammar
//         let rules = []
//         grammar.forEach((el, i) => rules[i] = el.title)

//         // find RHS that is equal to possible base and wrap it
//         for (gramIndex in grammar) {
//           for (ruleVariant of grammar[gramIndex].statements) {
//             ruleVariant = trimTerminalSingleQuotes(ruleVariant)
//             if (base.join(' ') === ruleVariant) {
//               let ruleLHS = rules[gramIndex]
              
//               // fill the poliz
//               poliz.push(getPoliz(base, ruleLHS, stack[stack.length - 1].title, false))
//               if (poliz[poliz.length - 1] === '') poliz.splice(-1)

//               // remove selected base from stack
//               stack.splice(stackIndex)

//               // add current LHS rule title to stack
//               let ruleLexem = new Lexeme(null, ruleLHS, null, null, null, null, null)
//               ruleLexem.value = ruleLHS
//               stack.push(ruleLexem)

//               if (lexemTable[0].value === '#') {
//                 pushSyntaxTable(syntaxTable, stack, mainRelation, programInput, poliz)
//               }

//               break
//             }
          
//           }
//           if (base.join(' ') === ruleVariant) break
//         }

//         if (base.join(' ') !== ruleVariant) {
//           displayParserError(`Incorrect end of program on ${stack[stack.length - 1].title}`, lexemTable)
//           break
//         }

//       } else {
//         displayParserError(`No table relation found for: ${stack[stack.length - 1].value} and ${lexemTable[0].value}`,lexemTable)
//         break
//       }
//     }
  
//     return syntaxTable
//   }



// function getPoliz(base, rule, returnValue, flag = false) {
//   base = base.join(' ')
//   console.log('in getPoliz()-- base: ' + base + ' | rule: ' + rule)

//   if (flag) return (-1 * float(returnValue)).toString()

//   else if (base === 'expression + term1' && rule === 'expression') return '+'
//   else if (base === 'expression - term1' && rule === 'expression') return '-'
//   else if (base === '- term1' && rule === 'expression') return '@'
//   else if (base === 'term * factor1' && rule === 'term') return '*'
//   else if (base === 'term / factor1' && rule === 'term') return '/'
//   else if (base === 'IDN' && rule === 'factor') return returnValue
//   else if (base === 'CON' && rule === 'factor') return returnValue
//   else return ''
// }

// // change to floats when done
// function calculatePoliz(poliz) {
//   let stackPoliz = []
//   let tmp

//   while (poliz.length !== 0) {
//     if (poliz[0].match(/^[0-9]\d*(\.\d+)?$/)) {
//       stackPoliz.push(poliz.shift())
//     }
    
//     else if (poliz[0].indexOf(['+', '-', '*', '/'] !== -1)) {
//       if (poliz[0] === '+')
//         tmp = float(stackPoliz[-2]) + float(stackPoliz[-1])
//       else if (poliz[0] === '-')
//         tmp = float(stackPoliz[-2]) - float(stackPoliz[-1])
//       else if (poliz[0] === '*')
//         tmp = float(stackPoliz[-2]) * float(stackPoliz[-1])
//       else
//         tmp = float(stackPoliz[-2]) / float(stackPoliz[-1])

//       stackPoliz.splice(stackPoliz.length - 2, 2, tmp)
//       poliz.shift()
//     } else if (poliz[0] === '@') {
//       tmp = float(stackPoliz[stackPoliz.length - 1]) * -1
//       stackPoliz.splice(-1, 1, tmp)
//       poliz.shift()
//     }
//   }

//   console.log('Expression = ' + stackPoliz[0].toString())
// }



// Utility functions

// easier check for null / undefined
function isDefined(value) {
  return (value !== null && value !== undefined)
}

// pushing to output Syntax Table
function pushSyntaxTable(tab, stack, relation, input, poliz) {
  let outputStack = []
  for (let stackItem of stack) outputStack.push(stackItem.title)
  tab.push([outputStack.join(' '), relation, input.join(' '), poliz.join(' ')])
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