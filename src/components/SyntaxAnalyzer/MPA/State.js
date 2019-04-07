export default class State {
  constructor(stateID, token, stack, nextStateID, isExit) {
    this.stateID = stateID
    this.token = token
    this.stack = stack
    this.nextStateID = nextStateID
    this.isExit = isExit
  }
}
