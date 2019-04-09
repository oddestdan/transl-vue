export default class Rule {
  constructor(title, statements) {
    // string title
    this.title = title
    // string[] statements
    this.statements = statements
  }
  toString() {
    return `Title: ${this.title}\nStatements: ${this.statements}\n\n`
  }
}
