export default function lexemOutput(
  table,
  tableID,
  type = 'text',
  smaller = false
) {
  if (type === 'json') table = JSON.parse(table)

  let output = ''

  smaller
    ? (output += "<div class='container' style='font-size: 10px'>")
    : (output += "<div class='container'>")

  output += "<table class='table'>"
  output += "<thead class='thead-dark'>"
  output += '<tr>'

  let keys = Object.keys(table[0])
  for (let i = 0; i < keys.length; i++) {
    output += "<th scope='col'>" + keys[i] + '</th>'
  }
  output += '</tr>'
  output += '</thead>'
  output += '<tbody>'

  for (let i = 0; i < table.length; i++) {
    output += '<tr>'
    for (let j = 0; j < keys.length; j++) {
      output += '<td>'
      let value = table[i][keys[j]]
      if (value === null || value === undefined) {
        value = '--'
      } else if (value === '\n') {
        value = '\\n'
      }
      output += value
      output += '</td>'
    }
    output += '</tr>'
  }
  output += '</tbody>'
  output += '</table>'
  output += '</div>'

  let el = document.getElementById(tableID)
  el.innerHTML = output
}
