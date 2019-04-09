/* eslint-disable */
import Rule from './Rule'

let grammar = []

grammar.push(new Rule(
  "prog", [
    "declaration_list1 '{' operators_list1 '}' '\\n'",
  ])
)
grammar.push(new Rule(
  "declaration_list1", [
    "declaration_list",
  ])
)
grammar.push(new Rule(
  "declaration_list", [
    "declaration '\\n'",
    "declaration_list declaration '\\n'",
  ])
)
grammar.push(new Rule(
  "declaration", [
    "variable_type variable_list1",
  ])
)
grammar.push(new Rule(
  "variable_type", [
    "'int'",
    "'fixed'",
    "'label'",
  ])
)
grammar.push(new Rule(
  "variable_list1", [
    "variable_list",
  ])
)
grammar.push(new Rule(
  "variable_list", [
    "'IDN'",
    "variable_list ',' 'IDN'",
    "'LAB'",
  ])
)
grammar.push(new Rule(
  "operators_list1", [
    "operators_list",
  ])
)
grammar.push(new Rule(
  "operators_list", [
    "operator '\\n'",
    "operators_list operator '\\n'",
  ])
)
grammar.push(new Rule(
  "operator", [
    "assignment",
    "input",
    "output",
    "loop",
    "cond_statement",
    "uncond_statement",
    "label_statement",
  ])
)
grammar.push(new Rule(
  "assignment", [
    "'IDN' '=' expression1",
  ])
)
grammar.push(new Rule(
  "input", [
    "'iput' '<<' 'IDN'",
    "input '<<' 'IDN'",
  ])
)
grammar.push(new Rule(
  "output", [
    "'oput' '>>' 'IDN'",
    "output '>>' 'IDN'",
  ])
)
grammar.push(new Rule(
  "loop", [
    "'for' 'IDN' '=' expression1 'by' expression1 'while' relation 'do' operator '\\n'",
    // "'for' 'IDN' '=' expression1 'by' expression1 'while' relation 'do' operator",
  ])
)
grammar.push(new Rule(
  "relation", [
    "expression1 relational_sign expression1",
  ])
)
grammar.push(new Rule(
  "relational_sign", [
    "'>'",
    "'<'",
    "'>='",
    "'<='",
    "'=='",
    "'!='",
  ])
)
grammar.push(new Rule(
  "cond_statement", [
    "'if' relation 'then' 'goto' 'LAB'",
  ])
)
grammar.push(new Rule(
  "uncond_statement", [
    "'goto' 'LAB'",
  ])
)
grammar.push(new Rule( // is it fine though?
  "label_statement", [
    "'@' 'LAB'",
  ])
)
grammar.push(new Rule(
  "expression1", [
    "expression",
  ])
)
grammar.push(new Rule(
  "expression", [
    "term1",
    "expression '+' term1",
    "expression '-' term1",
  ])
)
grammar.push(new Rule(
  "term1", [
    "term",
  ])
)
grammar.push(new Rule(
  "term", [
    "factor1",
    "term '*' factor1",
    "term '/' factor1",
  ])
)
grammar.push(new Rule(
  "factor1", [
    "factor",
  ])
)
grammar.push(new Rule(
  "factor", [
    "'IDN'",
    "'CON'",
    "'(' expression1 ')'",
  ])
)

export {
  grammar
}