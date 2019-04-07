/* eslint-disable */
import { isStringContainingChar, displaySyntaxError } from '@/utils/utility.js'

// lexem iterator and scoped LexemTable
let i = 0
let lexemTable = []

// dictionaries (sets) of terminal symbols
let relationalSignSet = ['>', '<', '>=', '<=', '==', '!=']
let signSet = ['+', '-', '']
// let variableTypeSet = ['int', 'fixed', 'label']

let parserRecursive = function(lexems) {
  lexemTable = JSON.parse(lexems)

  try {
    return prog()
  } catch (error) {
    return displaySyntaxError('Ending error\n' + error, lexemTable, i)
  }
}

// TODO: if (lexemTable[i].code === lexemTable[i-1] === \n)

let prog = function() {
  if (declarationList()) {
    if (lexemTable[i].code === 12) {
      // {
      i++
      if (lexemTable[i].code === 30) {
        // \n
        i++
        if (operatorList()) {
          if (lexemTable[i].code === 13) {
            // }
            i++
            if (lexemTable[i].code === 30) {
              // \n
              i++
              alert('Recursive SA successful')
              return true
            } else {
              return displaySyntaxError('Wrong operation list, missing last \\n', lexemTable, i)
            }
          } else {
            return displaySyntaxError('Wrong operation list, missing closing brace }', lexemTable, i)
          }
        } else {
          return displaySyntaxError('Wrong operation list', lexemTable, i)
        }
      } else {
        return displaySyntaxError('Wrong operation list, missing pre-operator \\n', lexemTable, i)
      }
    } else {
      return displaySyntaxError('Wrong list, missing opening brace {', lexemTable, i)
    }
  } else {
    return displaySyntaxError('Empty program', lexemTable, i)
  }
}

let declarationList = function() {
  if (declaration(true)) {
    if (lexemTable[i].code === 30) {
      // \n
      i++
      while (declaration(true)) {
        if (lexemTable[i].code === 30) {
          // \n
          i++
        } else {
          return displaySyntaxError(
            'Wrong declaration, missing \\n',
            lexemTable,
            i
          )
        }
      }
      return true
    } else {
      return displaySyntaxError(
        'Wrong declaration, missing initial \\n',
        lexemTable,
        i
      )
    }
  } else {
    return displaySyntaxError(
      'Wrong declaration list, list is empty',
      lexemTable,
      i
    )
  }
}

let declaration = function(externalPriorityCheck = false) {
  let temp = i
  if (variableType(externalPriorityCheck)) {
    if (variableList(externalPriorityCheck)) {
      return true
    } else {
      if (externalPriorityCheck) {
        i = temp
        return false
      }
      return displaySyntaxError(
        'Wrong variable list, missing variables',
        lexemTable,
        i
      )
    }
  } else {
    return false
  }
}

let variableType = function(externalPriorityCheck = false) {
  let temp = i
  if (
    lexemTable[i].code === 1 ||
    lexemTable[i].code === 2 ||
    lexemTable[i].code === 32
  ) {
    // if (variableTypeSet.indexOf(lexemTable[i].title)) {
    i++
    return true
  } else {
    if (externalPriorityCheck) {
      i = temp
      return false
    }
    return displaySyntaxError('Wrong variable type', lexemTable, i)
  }
}

// TODO: id ( = const | ^ ) { , id ( ^ | = const ) }

let variableList = function(externalPriorityCheck = false) {
  let temp = i
  if (identifier(externalPriorityCheck) || label(externalPriorityCheck)) {
    while (lexemTable[i].code === 14) {
      // ,
      i++
      if (identifier(externalPriorityCheck) || label(externalPriorityCheck)) {
        continue
      } else {
        if (externalPriorityCheck) {
          i = temp
          return false
        }
        return displaySyntaxError(
          'Wrong variable list, no id after comma',
          lexemTable,
          i
        )
      }
    }
    return true
  } else {
    return false
  }
}

let operatorList = function(externalPriorityCheck = false) {
  let temp = i
  if (operator(true)) {
    if (lexemTable[i].code === 30) {
      // \n
      i++
      while (operator(true)) {
        if (lexemTable[i].code === 30) {
          // \n
          i++
        } else {
          return displaySyntaxError(
            'Wrong operator, missing \\n',
            lexemTable,
            i
          )
        }
      }
      return true
    } else {
      if (externalPriorityCheck) {
        i = temp
        return false
      }
      return displaySyntaxError(
        'Wrong operation list, missing initial \\n',
        lexemTable,
        i
      )
    }
  } else {
    return false
  }
}

let operator = function() {
  if (
    assignment(true) ||
    input(true) ||
    output(true) ||
    loop(true) ||
    conditionalStatement(true) ||
    unconditionalStatement(true) ||
    labelStatement(true)
  ) {
    return true
  } else {
    return false
  }
}

let assignment = function(externalPriorityCheck = false) {
  if (identifier(externalPriorityCheck)) {
    // id
    if (lexemTable[i].code === 15) {
      // =
      i++
      if (expression(externalPriorityCheck)) {
        // <E>
        return true
      } else {
        return displaySyntaxError(
          'Wrong assignment, need expression after =',
          lexemTable,
          i
        )
      }
    } else {
      return displaySyntaxError(
        'Wrong assignment, need = after identificator',
        lexemTable,
        i
      )
    }
  } else {
    return false
  }
}

let input = function(externalPriorityCheck = false) {
  let temp = i
  if (lexemTable[i].code === 11) {
    // iput
    i++
    if (lexemTable[i].code === 16) {
      // <<
      i++
      if (identifier(externalPriorityCheck)) {
        // id
        while (lexemTable[i].code === 16) {
          // <<
          i++
          if (identifier(externalPriorityCheck)) {
            // id
            continue
          } else {
            if (externalPriorityCheck) {
              i = temp
              return false
            }
            return displaySyntaxError(
              'Wrong input, missing id after <<',
              lexemTable,
              i
            )
          }
        }
        return true
      } else {
        if (externalPriorityCheck) {
          i = temp
          return false
        }
        return displaySyntaxError(
          'Wrong input, missing id after <<',
          lexemTable,
          i
        )
      }
    } else {
      if (externalPriorityCheck) {
        i = temp
        return false
      }
      return displaySyntaxError('Wrong input, missing <<', lexemTable, i)
    }
  } else {
    return false
  }
}

let output = function(externalPriorityCheck = false) {
  let temp = i
  if (lexemTable[i].code === 10) {
    // oput
    i++
    if (lexemTable[i].code === 17) {
      // >>
      i++
      if (identifier(externalPriorityCheck)) {
        // id
        while (lexemTable[i].code === 17) {
          // >>
          i++
          if (identifier(externalPriorityCheck)) {
            // id
            continue
          } else {
            if (externalPriorityCheck) {
              i = temp
              return false
            }
            return displaySyntaxError(
              'Wrong output, missing id after >>',
              lexemTable,
              i
            )
          }
        }
        return true
      } else {
        if (externalPriorityCheck) {
          i = temp
          return false
        }
        return displaySyntaxError(
          'Wrong output, missing id after >>',
          lexemTable,
          i
        )
      }
    } else {
      if (externalPriorityCheck) {
        i = temp
        return false
      }
      return displaySyntaxError('Wrong output, missing >>', lexemTable, i)
    }
  } else {
    return false
  }
}

let loop = function(externalPriorityCheck = false) {
  let temp = i
  if (lexemTable[i].code === 3) {
    // for
    i++
    if (identifier(externalPriorityCheck)) {
      // id
      if (lexemTable[i].code === 15) {
        // =
        i++
        if (expression(externalPriorityCheck)) {
          // <E>
          if (lexemTable[i].code === 4) {
            // by
            i++
            if (expression(externalPriorityCheck)) {
              // <E>
              if (lexemTable[i].code === 5) {
                // while
                i++
                if (relation(externalPriorityCheck)) {
                  // <E><rel sign><E>
                  if (lexemTable[i].code === 6) {
                    // do
                    i++
                    // if (lexemTable[i].code === 30) { // \n
                    // i++;
                    if (operator(externalPriorityCheck)) {
                      // <op>
                      return true
                    } else {
                      return false
                    }
                    // } else {
                    // if (externalPriorityCheck) {
                    // i = temp;
                    // return false;
                    // }
                    // return displaySyntaxError('Wrong loop, missing \\n after do', lexemTable, i);
                    // }
                  } else {
                    if (externalPriorityCheck) {
                      i = temp
                      return false
                    }
                    return displaySyntaxError(
                      'Wrong loop, missing do',
                      lexemTable,
                      i
                    )
                  }
                } else {
                  if (externalPriorityCheck) {
                    i = temp
                    return false
                  }
                  return displaySyntaxError(
                    'Wrong loop, incorrect relation after while',
                    lexemTable,
                    i
                  )
                }
              } else {
                if (externalPriorityCheck) {
                  i = temp
                  return false
                }
                return displaySyntaxError(
                  'Wrong loop, missing while',
                  lexemTable,
                  i
                )
              }
            } else {
              return false
            }
          } else {
            if (externalPriorityCheck) {
              i = temp
              return false
            }
            return displaySyntaxError('Wrong loop, missing by', lexemTable, i)
          }
        } else {
          return false
        }
      } else {
        if (externalPriorityCheck) {
          i = temp
          return false
        }
        return displaySyntaxError(
          'Wrong loop, missing = after for id',
          lexemTable,
          i
        )
      }
    } else {
      if (externalPriorityCheck) {
        i = temp
        return false
      }
      return displaySyntaxError(
        'Wrong loop, missing id after for',
        lexemTable,
        i
      )
    }
  } else {
    return false
  }
}

let conditionalStatement = function(externalPriorityCheck = false) {
  let temp = i
  if (lexemTable[i].code === 7) {
    // if
    i++
    if (relation(externalPriorityCheck)) {
      // <E><rel sign><E>
      if (lexemTable[i].code === 8) {
        // then
        i++
        if (lexemTable[i].code === 9) {
          // goto
          i++
          if (label(externalPriorityCheck)) {
            // label
            return true
          } else {
            if (externalPriorityCheck) {
              i = temp
              return false
            }
            return displaySyntaxError(
              'Wrong conditional statement, missing label',
              lexemTable,
              i
            )
          }
        } else {
          if (externalPriorityCheck) {
            i = temp
            return false
          }
          return displaySyntaxError(
            'Wrong conditional statement, missing goto',
            lexemTable,
            i
          )
        }
      } else {
        if (externalPriorityCheck) {
          i = temp
          return false
        }
        return displaySyntaxError(
          'Wrong conditional statement, missing then',
          lexemTable,
          i
        )
      }
    } else {
      if (externalPriorityCheck) {
        i = temp
        return false
      }
      return displaySyntaxError(
        'Wrong conditional statement, incorrect relation after if',
        lexemTable,
        i
      )
    }
  } else {
    return false
  }
}

let unconditionalStatement = function(externalPriorityCheck = false) {
  let temp = i
  if (lexemTable[i].code === 9) {
    // goto
    i++
    if (label(externalPriorityCheck)) {
      // label
      return true
    } else {
      if (externalPriorityCheck) {
        i = temp
        return false
      }
      return displaySyntaxError(
        'Wrong unconditional statement, missing label after goto',
        lexemTable,
        i
      )
    }
  }
}

let labelStatement = function(externalPriorityCheck = false) {
  let temp = i
  if (lexemTable[i].code === 33) {
    // @
    i++
    if (label(externalPriorityCheck)) {
      // label
      return true
    } else {
      if (externalPriorityCheck) {
        i = temp
        return false
      }
      return displaySyntaxError(
        'Wrong label statement, missing label after @',
        lexemTable,
        i
      )
    }
  }
}

let relation = function(externalPriorityCheck = false) {
  if (expression(externalPriorityCheck)) {
    if (relationalSign(externalPriorityCheck)) {
      if (expression(externalPriorityCheck)) {
        return true
      } else {
        return false
      }
    }
  } else {
    return false
  }
}

let relationalSign = function(externalPriorityCheck = false) {
  let temp = i
  if (relationalSignSet.indexOf(lexemTable[i].title)) {
    i++
    return true
  } else {
    if (externalPriorityCheck) {
      i = temp
      return false
    }
    return displaySyntaxError(
      'Wrong relation, missing correct relation sign',
      lexemTable,
      i
    )
  }
}

let expression = function(externalPriorityCheck = false) {
  if (term(externalPriorityCheck)) {
    while (lexemTable[i].code === 24 || lexemTable[i].code === 25) {
      // + or -
      i++
      if (term(externalPriorityCheck)) {
        continue // not needed
      } else {
        return false
      }
    }
    return true
  } else {
    return false
  }
}

let term = function(externalPriorityCheck = false) {
  if (factor(externalPriorityCheck)) {
    while (lexemTable[i].code === 26 || lexemTable[i].code === 27) {
      // * or /
      i++
      if (factor(externalPriorityCheck)) {
        continue // not needed
      } else {
        return false
      }
    }
    return true
  } else {
    return false
  }
}

let factor = function(externalPriorityCheck = false, isNegativeFactor = false) {
  let temp = i
  if (identifier(true) || constant(true)) {
    // id or const
    return true
  } else if (lexemTable[i].code === 28) {
    // (
    i++
    if (expression(externalPriorityCheck)) {
      if (lexemTable[i].code === 29) {
        // )
        i++
        return true
      } else {
        if (externalPriorityCheck) {
          i = temp
          return false
        }
        return displaySyntaxError(
          'Wrong factor, missing closing )',
          lexemTable,
          i
        )
      }
    } else {
      return false
    }
  } else if (lexemTable[i].code === 25 && !isNegativeFactor) {
    // -
    i++
    isNegativeFactor = true
    if (factor(externalPriorityCheck, isNegativeFactor)) {
      return true
    } else {
      if (externalPriorityCheck) {
        i = temp
        return false
      }
      return displaySyntaxError(
        'Wrong factor, multiple negatives -',
        lexemTable,
        i
      )
    }
  } else {
    return false
  }
}

// Variables
let identifier = function(externalPriorityCheck = false) {
  let temp = i
  if (lexemTable[i].code === 100) {
    i++
    return true
  } else {
    if (externalPriorityCheck) {
      i = temp
      return false
    }
    return displaySyntaxError('Wrong identifier', lexemTable, i)
  }
}
let constant = function(externalPriorityCheck = false) {
  let temp = i
  if (lexemTable[i].code === 101) {
    i++
    return true
  } else {
    if (externalPriorityCheck) {
      i = temp
      return false
    }
    return displaySyntaxError('Wrong constant', lexemTable, i)
  }
}
let label = function(externalPriorityCheck = false) {
  let temp = i
  if (lexemTable[i].code === 102) {
    i++
    return true
  } else {
    if (externalPriorityCheck) {
      i = temp
      return false
    }
    return displaySyntaxError('Wrong label', lexemTable, i)
  }
}

// Unnecessary
/* eslint-disable */
let sign = function(externalPriorityCheck = false) {
  let temp = i
  if (isStringContainingChar(signSet, lexemTable[i].title)) {
    i++
    return true
  } else {
    if (externalPriorityCheck) {
      i = temp
      return false
    }
    return displaySyntaxError('Wrong sign', lexemTable, i)
  }
}

// TODO:

// 1) declarative assignment
// 2) Special check for consequent \n :
let consequentReturnCheck = function() {
  if (lexemTable[i].code === 30 && lexemTable[i - 1].code === 30) {
    return displaySyntaxError('Multiple consequent \\n', lexemTable, i)
  }
  return true
}

export { parserRecursive }
