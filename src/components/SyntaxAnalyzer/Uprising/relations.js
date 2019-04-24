/* eslint-disable */
import { grammar } from './grammar.js'
import outputUprisingTable from '@/utils/outputUprisingTable.js'

let rulesArray = []
const N = 8

export default function relations(rules) {
  try {
    rulesArray = rules
    return [setRelations(), rulesArray]
    // return setRelations()
    // outputUprisingTable(relationTable, rulesArray, 'relationTableOutput')
  } catch (error) {
    throw new Error('Relations error\n' + error)
  }
}

// Main function for setting grammar rules
let setRelations = function() {
  for (let ruleID in grammar) {
    for (let ruleVariantID in grammar[ruleID].statements) {
      let ruleVariant = grammar[ruleID].statements[ruleVariantID]
      for (let tokenID in ruleVariant.split(' ')) {
        let token = ruleVariant.split(' ')[tokenID]
        rulesArray.push(token)
      }
    }
  }
  rulesArray.push('program')

  // all (terminal & not terminal) tokens
  rulesArray = Array.from(new Set(rulesArray))
  rulesArray = rulesArray.sort().reverse()

  // empty 2d array [N x N]
  let uprisingTable = new Array(rulesArray.length)
  for (let item in rulesArray) {
    uprisingTable[item] = new Array(rulesArray.length)
  }

  // uprising '=' relation
  for (let ruleID in grammar) {
    for (let ruleVariantID in grammar[ruleID].statements) {
      let ruleVariant = grammar[ruleID].statements[ruleVariantID]
      let ruleVariantTokens = ruleVariant.split(' ')

      if (ruleVariantTokens.length > 1) {
        for (let i = 0; i < ruleVariantTokens.length - 1; i++) {
          let l = rulesArray.indexOf(ruleVariantTokens[i])
          let r = rulesArray.indexOf(ruleVariantTokens[i + 1])
          uprisingTable[l][r] = '='
        }
      }
    }
  }

  // break upon first met terminal
  let border
  for (border = 0; border < rulesArray.length; border++) {
    if (rulesArray[border][0] === "'") {
      break
    }
  }

  // uprising '<' relation
  for (let i = 0; i < uprisingTable[0].length; i++) {
    for (let j = 0; j < border; j++) {
      if (uprisingTable[i][j]) {
        let leftPart = rulesArray[i]
        let rightPart = getFirstPlus(j)

        for (let item in rightPart) {
          let colIndex = rulesArray.indexOf(rightPart[item])
          if (!uprisingTable[i][colIndex]) {
            uprisingTable[i][colIndex] = '<'
          } else if (uprisingTable[i][colIndex] == '=') {
            uprisingTable[i][colIndex] += '<'
            displayConflict(leftPart, '<=', rightPart[item])
          }
        }
      }
    }
  }

  // uprising '>' relation
  for (let i = 0; i < border; i++) {
    for (let j = 0; j < uprisingTable[0].length; j++) {
      if (uprisingTable[i][j]) {
        let leftPart = getLastPlus(i)
        let rightPart = rulesArray[j]

        for (let item in leftPart) {
          let rowIndex = rulesArray.indexOf(leftPart[item])
          if (!uprisingTable[rowIndex][j]) {
            uprisingTable[rowIndex][j] = '>'
          } else if (uprisingTable[rowIndex][j] == '=') {
            uprisingTable[rowIndex][j] += '>'
            displayConflict(leftPart[item], '>=', rightPart)
          } else if (uprisingTable[rowIndex][j] == '<') {
            uprisingTable[rowIndex][j] += '>'
            displayConflict(leftPart[item], '<>', rightPart)
          } else if (uprisingTable[rowIndex][j] == '=<') {
            uprisingTable[rowIndex][j] += '>'
            displayConflict(leftPart[item], '=<>', rightPart)
          }
        }

        if (!(rulesArray[j][0] === "'")) {
          // if not terminal
          rightPart = getFirstPlus(j)
          for (let itemLeft in leftPart) {
            for (let itemRight in rightPart) {
              let rowIndex = rulesArray.indexOf(leftPart[itemLeft])
              let colIndex = rulesArray.indexOf(rightPart[itemRight])

              if (!uprisingTable[rowIndex][colIndex]) {
                uprisingTable[rowIndex][colIndex] = '>'
              } else if (uprisingTable[rowIndex][colIndex] == '=') {
                uprisingTable[rowIndex][colIndex] += '>'
                displayConflict(leftPart[itemLeft], '>=', rightPart[itemRight])
              } else if (uprisingTable[rowIndex][colIndex] == '<') {
                uprisingTable[rowIndex][colIndex] += '>'
                displayConflict(leftPart[itemLeft], '<>', rightPart[itemRight])
              } else if (uprisingTable[rowIndex][colIndex] == '=<') {
                uprisingTable[rowIndex][colIndex] += '>'
                displayConflict(leftPart[itemLeft], '=<>', rightPart[itemRight])
              }
            }
          }
        }
      }
    }
  }

  console.log('Relations were set successfully')
  alert('Relations were set successfully')
  return uprisingTable
}

let getFirstPlus = function(index) {
  let firstTokens = new Set()

  let mainRule = rulesArray[index]
  let foundMainRule = grammar.find(grammar => grammar.title === mainRule)

  for (let ruleID in foundMainRule.statements) {
    // add first tokens from external rules (main rule)
    firstTokens.add(foundMainRule.statements[ruleID].split(' ')[0])
  }

  firstTokens = Array.from(firstTokens)
  let loopContinue = true
  let alreadyAddedTokens = []

  // while (loopContinue) {
  for (let it = 0; it < N; it++) {
    loopContinue = false
    for (let tokenID in firstTokens) {
      let token = firstTokens[tokenID]
      if (token.charAt(0) !== "'" && !(token in alreadyAddedTokens)) {
        // if not -- change to !indexOf(..)
        loopContinue = true
        alreadyAddedTokens.push(token)

        let foundRule = grammar.find(grammar => grammar.title === token)
        for (let ruleID in foundRule.statements) {
          // add first token from internal rules
          firstTokens.push(foundRule.statements[ruleID].split(' ')[0])
        }
      }
    }
  }

  // convert to get rid of repeating elements
  firstTokens = Array.from(new Set(firstTokens))

  // back to array :)
  return firstTokens
}

let getLastPlus = function(index) {
  let lastTokens = new Set()

  let mainRule = rulesArray[index]
  let foundMainRule = grammar.find(grammar => grammar.title === mainRule)

  for (let ruleID in foundMainRule.statements) {
    // add first tokens from external rules (main rule)
    let tokens = foundMainRule.statements[ruleID].split(' ')
    lastTokens.add(tokens[tokens.length - 1])
  }

  lastTokens = Array.from(lastTokens)
  let loopContinue = true
  let alreadyAddedTokens = []

  // while (loopContinue) {
  for (let it = 0; it < N; it++) {
    loopContinue = false
    for (let tokenID in lastTokens) {
      let token = lastTokens[tokenID]
      if (token.charAt(0) !== "'" && !(token in alreadyAddedTokens)) {
        // if not -- change to !indexOf(..)
        loopContinue = true
        alreadyAddedTokens.push(token)

        let foundRule = grammar.find(grammar => grammar.title === token)
        for (let ruleID in foundRule.statements) {
          // add first token from internal rules
          let tokens = foundRule.statements[ruleID].split(' ')
          lastTokens.push(tokens[tokens.length - 1])
        }
      }
    }
  }

  // convert to get rid of repeating elements
  lastTokens = Array.from(new Set(lastTokens))

  // back to array :)
  return lastTokens
}

let displayConflict = function(left, sign, right) {
  const errorMessage =
    'CONFLICT { ' + left + ' ' + sign + ' ' + right + ' } CONFLICT'

  console.log(errorMessage)
  // document.write(
  //   '<h4 style="text-align:left; margin:20px">' + errorMessage + '</h4>'
  // )
  alert(errorMessage)
  // throw new Error(errorMessage)
  return false
}
