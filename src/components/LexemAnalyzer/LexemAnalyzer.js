/* eslint-disable */
import {
  convertArrayToTable,
  displayLexError,
  isStringContainingChar,
  isAlpha,
  isDigit,
  isNumber,
  isFloatNumber,
  isFixedNumber
} from '@/utils/utility'
import Lexeme from './Lexeme'
import { lexemDictionary } from './lexemDictionary'

// ---- GLOBALS

let debugMode = false

// JSON result
let lexemTableJSON = ''

// counters
let rowCount = 1,
  lexCount = 0,
  idCount = 0,
  constCount = 0,
  labelCount = 0

// type of a ID
let idType = ''

// 'vector' tables
let lexemTable = [],
  idArray = [],
  constArray = [],
  labelArray = []

// program limits
const PROGRAM_END = '}',
  DECLARATION_BLOCK_END = '{'

// main buffer
let buffer = ''

// previous symbol
let cPrev = ''

// booleans
let isDeclaring = true,
  isDeclaringLabels = false,
  isCheckingDoubleCharLex = false,
  isCheckingId = false,
  isCheckingConst = false,
  isCheckingFloat = false,
  isCheckingFixed = false

// sets
let delimiterSet = '+-<>=!*/()@:\n\t, ',
  whiteDelimiterSet = '\t ',
  checkForwardDelimiterSet = '<>=!',
  signSet = '+-',
  constSymbolSet = '.E'

// ----- FUNCTIONS

// Process/add lexem to the corresponding lexem table
// param: lex - string buffer
let processLexem = function(lex) {
  if (!lex) displayLexError('Undefined empty lexem', rowCount)

  let lexeme = new Lexeme()
  lexeme.number = lexCount + 1
  lexeme.row = rowCount
  lexeme.title = lex

  if (lexemDictionary[lex]) {
    // keyword lexem (from label)
    if (lex === 'label') isDeclaringLabels = true

    if (lex === 'int' || lex == 'fixed') idType = lex

    lexeme.code = lexemDictionary[lex]
    lexeme.constCode = lexeme.labelCode = lexeme.idCode = null
  } else if (isNumber(lex) || isFloatNumber(lex) || isFixedNumber(lex)) {
    // constant
    let code = constArray.indexOf(lex)

    if (code === -1) {
      // first time creating a const
      constCount++
      lexeme.constCode = constCount
    } else {
      lexeme.constCode = code + 1
    }
    lexeme.idCode = lexeme.labelCode = null
    lexeme.code = lexemDictionary['CON']
    constArray.push(lex)
  } else {
    // label or Id
    let labelCode = labelArray.indexOf(lex)
    let idCode = idArray.indexOf(lex)

    if (isDeclaring) {
      // declaration part
      if (idCode !== -1 || labelCode !== -1) {
        displayLexError("Duplicate declaration '" + lex + "'", rowCount)
      } else if (!isDeclaringLabels) {
        // Id
        idCount++
        idArray.push(lex) // add to Id table
        lexeme.constCode = lexeme.labelCode = null
        lexeme.idCode = idCount
        lexeme.idType = idType
        lexeme.code = lexemDictionary['IDN']
      } else {
        // label
        labelCount++
        labelArray.push(lex) // add to Label table
        lexeme.constCode = lexeme.idCode = null
        lexeme.labelCode = labelCount
        lexeme.code = lexemDictionary['LAB']
      }
    } else {
      // operation part
      if (idCode === -1 && labelCode === -1) {
        displayLexError("Unknown identifier '" + lex + "'", rowCount)
      } else if (labelCode === -1) {
        // Id
        lexeme.idCode = idCode + 1
        lexeme.constCode = lexeme.labelCode = null
        lexeme.code = lexemDictionary['IDN']
      } else {
        // label
        lexeme.labelCode = labelCode + 1
        lexeme.constCode = lexeme.idCode = null
        lexeme.code = lexemDictionary['LAB']
      }
    }
  }

  lexemTable.push(lexeme)

  buffer = ''
  lexCount++
  resetState()
}

// Process letters
// param: c - current character (presumably a letter)
let processLetter = function(c) {
  if (isStringContainingChar(buffer, '.') && c === '.') {
    displayLexError(
      'Incorrectly formed number (const | const. | const.const | floatE{+-}const )',
      rowCount
    )
  }

  if (isCheckingDoubleCharLex) {
    processLexem(buffer)
    isCheckingDoubleCharLex = false
  } else if (isCheckingConst && !isStringContainingChar(constSymbolSet, c)) {
    displayLexError('Identificator must start with a letter', rowCount)
  } else {
    isCheckingId = true
    buffer += c
  }
}

// Process digits
// param: c - current character (presumably a digit)
let processDigit = function(c) {
  if (isCheckingDoubleCharLex) {
    processLexem(buffer)
  }
  if (!buffer) {
    isCheckingConst = true
  } else {
    isCheckingConst = false
  }
  buffer += c
}

// Process delimiters
// param: c - current character (presumably a delimeter)
let processDelimiter = function(c) {
  // if we're not checking << or != etc
  if (buffer && !isCheckingDoubleCharLex) {
    processLexem(buffer)
  }
  // if c is not a white delimiter
  if (!isStringContainingChar(whiteDelimiterSet, c)) {
    // if c is one of the forward check symbols
    if (isStringContainingChar(checkForwardDelimiterSet, c)) {
      // if we're already checking for double lexem
      if (isCheckingDoubleCharLex) {
        // try processing it or previous buffer
        tryForDoubleCharLex(c)
      } else {
        // keep checking the lexem
        buffer += c
        isCheckingDoubleCharLex = true
      }
    } else {
      if (c === '-' && (buffer === '=')) {
        processLexem(buffer)
        processLexem(c)
      } else if (c === '\n') {
        isDeclaringLabels = false // reset label declaration
        idType = '' // reset Id type
        rowCount++
        processLexem(c)
      } else {
        buffer = c
        processLexem(buffer)
      }
    }
  }
}

// Try processing a double-lexem
// param: c - current character (presumably not a delimeter)
let tryForDoubleCharLex = function(c) {
  let temp = buffer + c
  if (lexemDictionary[temp]) {
    if (!isStringContainingChar(whiteDelimiterSet, c)) {
      processLexem(temp)
    }
  } else {
    processLexem(buffer)
    buffer = c
    isCheckingDoubleCharLex = true
  }
}

// State check reset
let resetState = function() {
  isCheckingDoubleCharLex = isCheckingId = isCheckingConst = isCheckingFloat = isCheckingFixed = false
}

// Outer loop through each string character
export default function lexParser(textFileContent) {
  for (let i = 0; i < textFileContent.length; i++) {
    cPrev = (i >= 1) ? textFileContent.charAt(i - 1) : ''

    let c = textFileContent.charAt(i)
    // specific check for fixed number
    if (
      isStringContainingChar(buffer, 'E') &&
      isStringContainingChar(signSet, c)
    ) {
      processDigit(c)
      continue
    }

    // special check for fixed constant (e.g., 3.4E-7)
    if (!isStringContainingChar(delimiterSet, c)) {
      if (isAlpha(c) || c === '.' || c === 'E') {
        processLetter(c)
      } else if (isDigit(c) || isStringContainingChar(signSet, c)) {
        processDigit(c)
      }
    }
    if (isStringContainingChar(delimiterSet, c)) {
      processDelimiter(c)
    }
    if (c === DECLARATION_BLOCK_END) {
      isDeclaring = isDeclaringLabels = false
      processLetter(c)
    }
    if (c === PROGRAM_END) {
      processLetter(c)
    }
  }

  lexemTableJSON = JSON.stringify(lexemTable, null, 2)

  // Output to console
  if (debugMode) {
    console.log('ID Table [' + idCount + ']:\n')
    for (let i = 0; i < idCount; i++) {
      console.log(i + 1 + ' | ' + idArray[i])
    }
    console.log('CON Table [' + constCount + ']:\n')
    for (let i = 0; i < constCount; i++) {
      console.log(i + 1 + ' | ' + constArray[i])
    }
    console.log('LAB Table [' + labelCount + ']:\n')
    for (let i = 0; i < labelCount; i++) {
      console.log(i + 1 + ' | ' + labelArray[i])
    }
    console.log('Output Table (of <Lexeme> Objects [' + lexCount + ']):\n')
    console.log(lexemTable)
  }

  return lexemTableJSON
}

// Converting arrays to tables
let idTable = convertArrayToTable(idArray)
let constTable = convertArrayToTable(constArray)
let labelTable = convertArrayToTable(labelArray)

// export { lexParser, lexemTableJSON }
