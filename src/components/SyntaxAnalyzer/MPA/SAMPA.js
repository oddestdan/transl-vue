/* eslint-disable */
import { displaySyntaxError } from '@/utils/utility.js'
import { stateDictionary } from './stateDictionary'

// lexem iterator and scoped LexemTable
let i = 0
let lexemTable = []

let parserMPA = function(lexems) {
  lexemTable = JSON.parse(lexems)

  try {
    return prog()
  } catch (error) {
    return displaySyntaxError('Ending error\n' + error, lexemTable, i)
  }
}

// save state tables to be displayed
let stateTable = []

class OutputState {
  constructor(currentState, token, stack) {
    this.CurrentState = currentState,
    this.Token = token,
    this.Stack = stack
  }
}

let prog = function() {
  let stateID = 1
  let stack = []

  while (i < lexemTable.length) {
    let token = lexemTable[i].code // token
    let stateAlternatives = stateDictionary.filter(
      obj => obj.stateID === stateID
    )
    let state = stateAlternatives.find(obj => obj.token === token)
    if (!state) {
      // special check for blank token code
      state = stateAlternatives.find(obj => obj.token === -1)
    }

    stateTable.push(
      new OutputState(
        stateID,
        token + ' : ' + lexemTable[i].title,
        stack.toString()
      )
    )

    if (state) {
      // if token is in current state
      if (state.token === -1) {
        // if current state is blank
        if (state.stack) {
          stack.push(state.stack)
          stateID = state.nextStateID
        } else if (state.isExit) {
          stateID = stack.pop()
        }
      } else {
        if (state.stack) {
          stack.push(state.stack)
        }
        stateID = state.nextStateID
        i++
      }
    } else {
      if (stateAlternatives[0].isExit) {
        stateID = stack.pop()
      } else {
        return displaySyntaxError('Quitting')
      }
    }
  }

  alert('Recursive MPA successful')
  return true
}

export { parserMPA, stateTable }
