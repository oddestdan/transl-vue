/* eslint-disable */
import { lexemDictionary } from '@/components/LexemAnalyzer/lexemDictionary'
import Lexeme from '@/components/LexemAnalyzer/Lexeme'
import { displayParserError } from '@/utils/utility'
import { grammar } from './grammar'

let rulesArray = []
let lexemTable = []

export default function parserUprising(lexems, uprisingRelationTable, rules) {
  lexemTable = JSON.parse(lexems)
  rulesArray = rules

  try {
    // trim all terminal rules from surrunding ''
    for (let rule in rulesArray)
      rulesArray[rule] = rulesArray[rule].replace(/[']+/g, '')
      // rulesArray[rule] = trimTerminalSingleQuotes(rulesArray[rule])

    let syntaxTable = parser(uprisingRelationTable, rulesArray)

    // alert('Uprising SA successful')
    return syntaxTable
  } catch (error) {
    return displayParserError('Ending error\n' + error)
  }
}

// main parser function
let parser = function(uprisingRelationTable, rulesArray) {
  // Preparation
  let counter = -1 // special counter for "{"
  let syntaxTable = [] // step-by-step output table
  let mainRelation = '' // main relation sign
  let poliz = [] // poliz array of string values

  let lexemDictInversed = {} // inversed lexemDictionary
  Object.keys(lexemDictionary).forEach(key => (lexemDictInversed[lexemDictionary[key]] = key))

  // add special values to lexems
  for (let lexem of lexemTable) {
    if (lexem.title === '\n') lexem.title = '\\n' // adjusting \n
    
    if (lexem.code === 100) lexem.value = 'IDN'
    else if (lexem.code === 101) lexem.value = 'CON'
    else if (lexem.code === 102) lexem.value = 'LAB'
    else lexem.value = lexem.title
  }

  // limit lexems via # at start and end
  let start = new Lexeme(null, '#', null, null, null, null, null)
  start.value = '#'
  let end = new Lexeme(null, '#', null, null, null, null, null)
  end.value = '#'
  lexemTable = [start, ...lexemTable, end]

  // RHS row of program words ['', '', ...]
  let programInput = []
  for (let i in lexemTable) programInput[i] = lexemTable[i].title
  programInput.shift() // remove first '#'

  // LHS stack of titles ['', '', ...]
  let stack = [lexemTable.shift()]

  // output
  debug(lexemTable)
  debug(programInput)
  debug(stack)
  debug(grammar)
  debug(rulesArray)
  // ================================================================================

    // Parsing
    while (stack.length !== 2 || lexemTable.length !== 1) {

      // // --------------
      // let outputStack = []
      // for (let stackItem of stack) outputStack.push(stackItem.title)
      // let outputStack2 = []
      // for (let stackItem of stack) outputStack2.push(stackItem.value)
      // console.log(`<< INPUT :: ${programInput.join(' ')}`)
      // console.log(`   MAIN REL :: ${mainRelation}`)
      // console.log(`   STACK TTL :: ${outputStack.join(' ')}`)
      // console.log(`   STACK VAL :: ${outputStack2.join(' ')}`)
      // console.log(`   LEX[0] :: `)
      // console.log(lexemTable[0])
      // // --------------


      // TODO: Add poliz counter here
      // Don't forget to use `float(...)` in `calculatePoliz()`
      // if (stack[stack.length - 1].value === '\\n' && poliz.length !== 0) {
      //   calculatePoliz(poliz)
      //   poliz = [] // reset the poliz
      // }
  
      if (stack[stack.length - 1].value === '{') counter++

      if (stack[stack.length - 1].value === '#') {
        mainRelation = '<'
        let outputStack = [] // TODO: Create a function for adding to syntaxTable
        for (let stackItem of stack) outputStack.push(stackItem.title)
        syntaxTable.push([outputStack.join(' '), mainRelation, programInput.join(' '), poliz.join(' ')])
      }
      
      else if (lexemTable[0].value === '#') mainRelation = '>'
      
      else {
        let leftIndex = rulesArray.indexOf(stack[stack.length - 1].value)
        let rightIndex = rulesArray.indexOf(lexemTable[0].value)
        debug('in left right indexes are: ' + leftIndex + ' & ' + rightIndex)
        mainRelation = uprisingRelationTable[leftIndex][rightIndex]
      }
  
      if (stack[stack.length - 1] !== '#') {
        let outputStack = []
        for (let stackItem of stack) outputStack.push(stackItem.title)
        syntaxTable.push([outputStack.join(' '), mainRelation, programInput.join(' '), poliz.join(' ')])
      }
  

      // TODO: Can change to indexOf single check
      let checkHelper = false
      if (mainRelation === '<' || mainRelation === '=') {
        for (let lexIndex in grammar) {
          if (grammar[lexIndex].title === 'variable_list') checkHelper = true
          else checkHelper = false
        }
        if (counter > 0 && checkHelper) {
          for (let lexIndex in grammar) {
            if (grammar[lexIndex].title === 'variable_list') grammar.splice(lexIndex, 1)
          }
        }

        debug('   in < or =')
  
        stack.push(lexemTable.shift())
        programInput.shift()
      } // End of tudu


      else if (mainRelation === '>') {

        debug('   in >')

        let base = [] // accumulate the base in stack before excahnge
        let stackIndex = 0 // general stack index
        let gramIndex = 0 // general grammar index
        let ruleVariant  = '' // some grammar rule from all RHS variants

        // select the base from stack
        for (stackIndex = stack.length - 1; stackIndex > 0; stackIndex--) {
          if (stack[stackIndex - 1].value === '#') {
            base = stack.slice(stackIndex, stack.length)
            for (let i in base) base[i] = base[i].value
            // for (let unit of base) unit = unit.value
          } 
          
          else {
            let stackLeftIndex = rulesArray.indexOf(stack[stackIndex - 1].value)
            let stackRightIndex = rulesArray.indexOf(stack[stackIndex].value)
            let relation = uprisingRelationTable[stackLeftIndex][stackRightIndex]
            if (relation === '<') {
              base = stack.slice(stackIndex, stack.length)
              for (let i in base) base[i] = base[i].value
              // for (let unit of base) unit = unit.value
              break
            }
          }
        }

        console.log('<<< Base:_' + base.join(' '))

        // all LHS values of the grammar
        let rules = []
        grammar.forEach((el, i) => rules[i] = el.title)

        // find RHS that is equal to possible base and wrap it
        for (gramIndex in grammar) {
          for (ruleVariant of grammar[gramIndex].statements) {
            ruleVariant = ruleVariant.replace(/[']+/g, '') // trim all terminal rules from surrunding ''
          // for (ruleVariant of trimTerminalSingleQuotes(grammar[gramIndex].statements)) {
            if (base.join(' ') === ruleVariant) {
              // check for negative CON
              let isNegativeCON = (stack[stack.length - 1].code === 101) && (float(stack[stack.length - 1].title) < 0)
              let ruleLHS = rules[gramIndex]
              
              // fill the poliz
              poliz.push(getPoliz(base, ruleLHS, stack[stack.length - 1].value, isNegativeCON))
              if (isNegativeCON) poliz.push('@') 
              else if (poliz[poliz.length - 1] === '') poliz.splice(-1)

              console.log('}}} Poliz_in_>_:_' + poliz.join(' | '))

              // remove selected base from stack
              stack.splice(stackIndex)
              debug(stackIndex)

              // add current LHS rule title to stack
              let ruleLexem = new Lexeme(null, ruleLHS, null, null, null, null, null)
              ruleLexem.value = ruleLHS
              stack.push(ruleLexem)
              
              console.log('>>> Stack_is_:_' + stack.join(', '))

              if (lexemTable[0].value === '#') {
                let outputStack = []
                for (let stackItem of stack) outputStack.push(stackItem.title)
                syntaxTable.push([outputStack.join(' '), mainRelation, programInput.join(' '), poliz.join(' ')])
              }

              break
            }
          
          }
          if (base.join(' ') === ruleVariant) break
        }

        if (base.join(' ') !== ruleVariant) {
          displayParserError(`Incorrect end of program on ${stack[stack.length - 1].title}`, lexemTable)
          break
        }

      } else {
        displayParserError(`No table relation found for: ${stack[stack.length - 1].value} and ${lexemTable[0].value}`,lexemTable)
        break
      }
    }
  
    return syntaxTable
  }


/*

1. Подготовка переменных
1.1 В стек и в конец вх строчки записываем #

1) Прецедент начинается когда запускается компиляция
2) Система выполняет лекс анализ
    //  2а) ЛА завершилось с ошибкой -- ошибка и завершение
3) Система заносит # в стек и конец вх строчки
4) Пока в стеке !=  #<prog>  и вх строчка !=  #  повторяем:
 4.1) Система определяет отношения между головой стека и первым элементом вх строчки
 4.2) Если отношение < или = то
  4.2.1) Система переносит 1ый элемент вх строчки в стек
 4.3) Иначе (>)
     // Если не нашли отношение между головой стека и 1ым элементом вх строчки то ошибка и завершение
  4.3.1) Пока между соседними элементами не < повторяем
   4.3.1.1) Найти отношение между iым и i-1ым элементами где i -- номер головы стека
   4.3.1.2) Передвинуть элементы (счетчики) в сторону от головы стека
   4.3.1.3) Система заносит соседние элементы в возможную основу
  4.3.2) Система находит в грамматике правую часть которая равняется возможной основе
      //  Если не нашли то выводится синтакс ошибка и завершение
  4.3.3) Система заменяет в стеке элементы возможной основы на левую часть правила
*/



function getPoliz(base, rule, returnValue, flag = false) {
  base = base.join(' ')
  console.log('in getPoliz()-- base: ' + base + ' | rule: ' + rule)

  if (flag) return (-1 * float(returnValue)).toString()

  else if (base === 'expression + T1' && rule === 'expression') return '+'
  else if (base === 'expression - T1' && rule === 'expression') return '-'
  else if (base === '- T1' && rule === 'expression') return '@'
  else if (base === 'T * F' && rule === 'T') return '*'
  else if (base === 'T / F' && rule === 'T') return '/'
  else if (base === 'IDN' && rule === 'F') return returnValue
  else if (base === 'CON' && rule === 'F') return returnValue
  else return ''
}

// change to floats when done
function calculatePoliz(poliz) {
  let stackPoliz = []
  let tmp

  while (poliz) {
    if (poliz[0].match(/^[0-9]\d*(\.\d+)?$/)) {
      stackPoliz.push(poliz.splice(-1, 1))
    } else if (poliz[0].indexOf(['+', '-', '*', '/'] !== -1)) {
      if (poliz[0] === '+') tmp = stackPoliz[-2] + stackPoliz[-1]
      else if (poliz[0] === '-') tmp = stackPoliz[-2] - stackPoliz[-1]
      else if (poliz[0] === '*') tmp = stackPoliz[-2] * stackPoliz[-1]
      else tmp = stackPoliz[-2] / stackPoliz[-1]

      stackPoliz.splice(stackPoliz.length - 2, tmp)
      poliz.shift()
    } else if (poliz[0] === '@') {
      tmp = stackPoliz[stackPoliz.length - 1] * -1
      stackPoliz.splice(-1, 1, tmp)
      poliz.shift()
    }
  }

  console.log('Expression = ' + stackPoliz[0])
}



// Utility functions

// easy debug
function debug(variable) {
  // console.log(`>> ${Object.keys({variable})[0]} :`)
  console.log(`>> debugging...`)
  console.log(variable)
}

// trims all ' from terminal strings
function trimTerminalSingleQuotes(str) {
  return str.replace(/[']+/g, '')
}

// easier conversion to float
function float(str) {
  return Number.parseFloat(str)
}

export { parserUprising }