import { lexemDictionary } from '@/components/LexemAnalyzer/lexemDictionary'
import { displaySyntaxError } from '@/utils/utility'
import { grammar } from './grammar'

let rulesArray = []
let lexemTable = []
// let ruleVarList = {} // needed ???

export default function parserUprising(lexems, uprisingRelationTable, rules) {
  lexemTable = JSON.parse(lexems)
  rulesArray = rules

  try {
    // trim all terminal rules from surrunding ''
    for (let rule in rulesArray)
      rulesArray[rule] = rulesArray[rule].replace(/[']+/g, '')

    // for (let obj in grammar)
    // if (grammar[obj].title === 'variable_list')
    // ruleVarList = grammar[obj] // needed ???

    let syntaxTable = parser(uprisingRelationTable, rulesArray)
    console.log('syntaxTable:')
    console.log(syntaxTable)

    alert('Uprising SA successful')
    return syntaxTable
  } catch (error) {
    return displaySyntaxError('Ending error\n' + error, lexemTable)
  }
}

let parser = function(uprisingRelationTable, rulesArray) {
  // Preparation
  let counter = -1
  let lexemDicReversed = {}
  let mainRelation
  Object.keys(lexemDictionary).forEach(
    key => (lexemDicReversed[lexemDictionary[key]] = key)
  )

  let programInput = [], // row of program words (lexem titles)
    pureTokens = [] // title equivalents of codes
  for (let lex in lexemTable) {
    programInput[lex] = lexemTable[lex].title
    if (programInput[lex] === '\n') programInput[lex] = '\\n'
    pureTokens[lex] = lexemDicReversed[lexemTable[lex].code]
  }
  programInput.push('#')
  pureTokens.push('#')
  let stack = ['#']
  let syntaxTable = []

  // converting \n to actual \n (in a form of \\n)
  for (let token in pureTokens) {
    if (pureTokens[token] === '\n') pureTokens[token] = '\\n'
  }

  // Parsing
  while (stack.length !== 2 || pureTokens.length !== 1) {
    // console.log(`INPUT :: ${programInput.join(' ')}
    //     ---\nSTACK :: ${stack.join(' ')}\n\n
    //     ---\nPURE :: ${pureTokens.join(' ')}\n\n`)

    if (stack[stack.length - 1] === '{') counter++
    if (stack[stack.length - 1] === '#') {
      mainRelation = '<'
      syntaxTable.push([stack.join(' '), mainRelation, programInput.join(' ')])
    } else if (pureTokens[0] === '#') {
      mainRelation = '>'
    } else {
      let leftIndex = rulesArray.indexOf(stack[stack.length - 1])
      let rightIndex = rulesArray.indexOf(pureTokens[0])
      // console.log('leftIndex 2.1.1\n' + leftIndex)
      // console.log('rightIndex 2.1.2\n' + rightIndex)
      mainRelation = uprisingRelationTable[leftIndex][rightIndex]
    }

    if (stack[stack.length - 1] !== '#') {
      syntaxTable.push([stack.join(' '), mainRelation, programInput.join(' ')])
    }

    let checkHelper = false
    if (mainRelation === '<' || mainRelation === '=') {
      for (let obj in grammar) {
        if (grammar[obj].title === 'variable_list') checkHelper = true
        else checkHelper = false
      }
      if (counter > 0 && checkHelper) {
        for (let obj in grammar) {
          if (grammar[obj].title === 'variable_list') grammar.splice(obj, 1)
        }
      }

      stack.push(pureTokens.shift())
      programInput.shift()
    } else if (mainRelation === '>') {
      let base = []
      let i = 0
      let ruleVariant = ''

      if (
        counter < 0 &&
        stack[stack.length - 1] === 'IDN' &&
        stack[stack.length - 2] === ','
      ) {
        stack.splice(stack.length - 3, 3)
        stack.push('variable_list')
      } else if (counter < 0 && stack[stack.length - 1] === 'IDN') {
        stack.splice(stack.length - 1, 1)
        stack.push('variable_list')
      } else {
        // selecting the base from stack
        for (i = stack.length - 1; i > 0; i--) {
          if (stack[i - 1] === '#') {
            base = stack.slice(i, stack.length)
            break
          } else {
            let stackLeftIndex = rulesArray.indexOf(stack[i - 1])
            let stackRightIndex = rulesArray.indexOf(stack[i])
            let relation =
              uprisingRelationTable[stackLeftIndex][stackRightIndex]
            if (relation === '<') {
              base = stack.slice(i, stack.length)
              break
            }
          }
        }

        let sortedGrammar = grammar.sort((a, b) =>
          ('' + a.title).localeCompare(b.title)
        )

        for (let rule in sortedGrammar) {
          for (ruleVariant of grammar[rule].statements) {
            ruleVariant = ruleVariant.replace(/[']+/g, '') // trim all terminal rules from surrunding ''
            if (ruleVariant === base.join(' ')) {
              stack.splice(i)

              stack.push(sortedGrammar[rule].title)

              // for last row (program concatenation)
              if (pureTokens[0] === '#') {
                syntaxTable.push([
                  stack.join(' '),
                  mainRelation,
                  programInput.join(' ')
                ])
              }
              break
            }
          }
          if (base.join(' ') === ruleVariant) break
        }

        if (base.join(' ') !== ruleVariant) {
          displaySyntaxError(
            `Incorrect end of program on ${stack[stack.length - 1]}`,
            lexemTable
          )
          break
        }
      }
    } else {
      displaySyntaxError(
        `No table relation found for: ${stack[stack.length - 1]} and ${
          pureTokens[0]
        }`,
        lexemTable
      )
      break
    }
  }

  // for (let obj in grammar)
  //     if (grammar[obj].title = "variable_list") grammar[obj] = ruleVarList;

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

export { parserUprising }
