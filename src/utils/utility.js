let mapTableToObjectWithKeys = function(inputTable, keys) {
  let outputTable = []
  for (let unit of inputTable) {
    let obj = {}
    for (let i in keys) {
      obj[keys[i]] = unit[i]
    }
    outputTable.push(obj)
  }
  return outputTable
}

// Convert from array to array of objects for output
let convertArrayToTable = function(array) {
  let table = []
  for (let i = 0; i < array.length; i++) {
    table.push({
      id: i,
      title: array[i]
    })
  }
  return table
}

// Display a lexical error via console, alert and error
let displayLexError = function(message, rowCount = 0) {
  const errorMessage = 'Lex Error on line' + rowCount + ' : ' + message + '!\n'

  console.log(errorMessage)
  // document.write(
  //   '<h2 style="text-align:center; margin-top:20px">' + errorMessage + '</h2>'
  // )
  alert(errorMessage)
  throw new Error(errorMessage)
}

// Display a parser error via console and header (no nums / rows)
let displayParserError = function(message) {
  const errorMessage = 'Parser Error: ' + message
  console.log(errorMessage)
  alert(errorMessage)
  return false
}

// Display a syntax error via console and header
let displaySyntaxError = function(message, lexemTable, i = 0) {
  const errorMessage =
    'Syntax Error: ' +
    message +
    ' | ' +
    "Lex: '" +
    (lexemTable[i].title === '\n' ? '\\n' : lexemTable[i].title) +
    "'" +
    ' | ' +
    'num: ' +
    lexemTable[i].number +
    ' | ' +
    'row: ' +
    lexemTable[i].row

  console.log(errorMessage)
  // document.write(
  //   '<h3 style="text-align:center; margin-top:20px">' + errorMessage + '</h3>'
  // )
  alert(errorMessage)
  // throw new Error(errorMessage)
  return false
}

// Check for character-string affilation
// returns: true if Char c is amongst String s
let isStringContainingChar = function(str, c) {
  for (let i = 0; i < str.length; i++) {
    let temp = str.charAt(i)
    if (temp === c) {
      return true
    }
  }
  return false
}

// Check for acceptable character
// param: c - current character
// returns: true if c is either alphanumerical or amongst delimiter
let isAcceptableChar = function(c) {
  return isAlnum(c) || isStringContainingChar('+-<>=!*/()@:\n\t, ', c)
}

let isAlpha = function(c) {
  return /[A-Za-z]/.test(c)
}

let isAlnum = function(c) {
  return /[a-zA-Z0-9]/i.test(c)
}

let isDigit = function(c) {
  return /\d/.test(c) // [0-9]
}

let isNumber = function(str) {
  return /^[-]?\d+$/.test(str)
}

let isFloatNumber = function(str) {
  return /^\d\.(\d+)?$/.test(str)
}

let isFixedNumber = function(str) {
  return /^\d\.\d+E[+-]?\d+$/.test(str)
}

let isMultipleNegative = function(str) {
  return /^[-]{2,}$/.test(str)
}

export {
  mapTableToObjectWithKeys,
  convertArrayToTable,
  displayLexError,
  displayParserError,
  displaySyntaxError,
  // getIndexCode,
  isStringContainingChar,
  isAcceptableChar,
  isAlpha,
  isAlnum,
  isDigit,
  isNumber,
  isFloatNumber,
  isFixedNumber,
  isMultipleNegative
}
