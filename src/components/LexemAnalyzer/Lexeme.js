/* eslint-disable */
export default class Lexeme {
  constructor(number, title, row, code, idCode, idType, constCode, labelCode) {
    this.number = number
    this.title = title
    this.row = row
    this.code = code
    this.idCode = idCode
    this.idType = idType
    this.constCode = constCode
    this.labelCode = labelCode
  }
  toString() {return `number: ${this.number} | title: ${this.title} | row: ${this.row} | code: ${this.code}`}
}
