export default function outputUprisingTable(tab, rulesArray, tableID) {
  let output = "<div class='container-fluid' style='font-size: 8px'>"
  output += "<table class='table table-sm table-bordered table-hover'>"
  output += "<thead class='thead-dark'>"
  output += '<tr>'

  output += "<th scope='col'></th>"
  for (let i = 0; i < rulesArray.length; i++) {
    output += "<th scope='col'>" + rulesArray[i] + '</th>'
  }
  output += '</tr>'
  output += '</thead>'
  output += '<tbody>'

  for (let i = 0; i < tab.length; i++) {
    output += '<tr>'
    output += "<th style='background-color: #212529; color: #ffffff'>"
    output += rulesArray[i]
    output += '</th>'
    for (let j = 0; j < tab.length; j++) {
      let value = tab[i][j]
      let hoverTitle =
        value !== undefined
          ? rulesArray[i] + ' ' + value + ' ' + rulesArray[j]
          : ''

      output += '<td class="tableItem" style="text-align: center" title="'
      output += hoverTitle
      output += '">'

      if (value === null || value === undefined) {
        value = ''
      }
      output += value
      output += '</td>'
    }
    output += '</tr>'
  }

  output += '</tbody>'
  output += '</table>'
  output += '</div>'

  console.log('Table ID ' + tableID)
  console.log('output ')
  console.log(tab)

  let el = document.getElementById(tableID)
  console.log('el ' + el)
  el.innerHTML = output
}
