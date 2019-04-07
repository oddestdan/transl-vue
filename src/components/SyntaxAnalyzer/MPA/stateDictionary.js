import State from './State'

let stateDictionary = []

// Main
stateDictionary.push(new State(1, -1, 2, 10, false)) // S/A declaration
stateDictionary.push(new State(2, 30, null, 3, false)) // \n
stateDictionary.push(new State(3, 12, null, 5, false)) // {
stateDictionary.push(new State(3, -1, 2, 10, false)) // S/A declaration
stateDictionary.push(new State(5, 30, 6, 20, false)) // \n
stateDictionary.push(new State(6, 30, null, 7, false)) // \n
stateDictionary.push(new State(7, 13, null, 8, false)) // }
stateDictionary.push(new State(7, -1, 6, 20, false)) // S/A operator
stateDictionary.push(new State(8, 30, null, 9, false)) // \n
stateDictionary.push(new State(9, -1, null, null, true)) // exit

// S/A declaration
stateDictionary.push(new State(10, 1, null, 11, false)) // int
stateDictionary.push(new State(10, 2, null, 11, false)) // fixed
stateDictionary.push(new State(10, 32, null, 11, false)) // label
stateDictionary.push(new State(11, 100, null, 12, false)) // IDN
stateDictionary.push(new State(11, 102, null, 12, false)) // LAB
stateDictionary.push(new State(12, 14, null, 11, true)) // , | exit

// S/A operator
// assignment
stateDictionary.push(new State(20, 100, null, 21, false)) // IDN
stateDictionary.push(new State(20, 11, null, 24, false)) // iput
stateDictionary.push(new State(20, 10, null, 27, false)) // oput
stateDictionary.push(new State(20, 3, null, 30, false)) // for
stateDictionary.push(new State(20, 33, null, 41, false)) // @
stateDictionary.push(new State(20, 7, 39, 50, false)) // if | // S/A relation
stateDictionary.push(new State(20, 9, null, 44, false)) // goto
stateDictionary.push(new State(21, 15, 23, 60, false)) // = | S/A expression
stateDictionary.push(new State(23, -1, null, null, true)) // exit
// input
stateDictionary.push(new State(24, 16, null, 25, false)) // <<
stateDictionary.push(new State(25, 100, null, 26, false)) // IDN
stateDictionary.push(new State(26, 16, null, 25, true)) // << | exit
// output
stateDictionary.push(new State(27, 17, null, 28, false)) // >>
stateDictionary.push(new State(28, 100, null, 29, false)) // IDN
stateDictionary.push(new State(29, 17, null, 28, true)) // >> | exit
// loop
stateDictionary.push(new State(30, 100, null, 31, false)) // IDN
stateDictionary.push(new State(31, 15, 32, 60, false)) // =  // S/A expression
stateDictionary.push(new State(32, 4, 33, 60, false)) // by | S/A expression
stateDictionary.push(new State(33, 5, 34, 50, false)) // while | S/A relation
stateDictionary.push(new State(34, 6, 35, 20, false)) // do | S/A declaration
stateDictionary.push(new State(35, -1, null, null, true)) // exit
// conditional statement
stateDictionary.push(new State(39, 8, null, 40, false)) // then
stateDictionary.push(new State(40, 9, null, 41, false)) // goto
stateDictionary.push(new State(41, 102, null, 42, false)) // LAB
stateDictionary.push(new State(42, -1, null, null, true)) // exit
// unconditional statement
stateDictionary.push(new State(44, 102, null, 45, false)) // LAB
stateDictionary.push(new State(45, -1, null, null, true)) // exit

// S/A relation
stateDictionary.push(new State(50, -1, 51, 60, false)) // S/A expression
stateDictionary.push(new State(51, 18, 52, 60, false)) // < | S/A expression
stateDictionary.push(new State(51, 19, 52, 60, false)) // > | S/A expression
stateDictionary.push(new State(51, 20, 52, 60, false)) // <= | S/A expression
stateDictionary.push(new State(51, 21, 52, 60, false)) // >= | S/A expression
stateDictionary.push(new State(51, 22, 52, 60, false)) // != | S/A expression
stateDictionary.push(new State(51, 23, 52, 60, false)) // == | S/A expression
stateDictionary.push(new State(52, -1, null, null, true)) // exit

// S/A expression
stateDictionary.push(new State(60, 25, null, 62, false)) // -
stateDictionary.push(new State(60, 28, 61, 60, false)) // ( | S/A expression
stateDictionary.push(new State(60, 100, null, 62, false)) // IDN
stateDictionary.push(new State(60, 101, null, 62, false)) // CON
stateDictionary.push(new State(61, 29, null, 62, false)) // )
stateDictionary.push(new State(62, 24, null, 62, true)) // +
stateDictionary.push(new State(62, 25, null, 60, true)) // -
stateDictionary.push(new State(62, 26, null, 60, true)) // *
stateDictionary.push(new State(62, 27, null, 60, true)) // /

export { stateDictionary }
