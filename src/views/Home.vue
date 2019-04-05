<template>
  <div class="home">
    <div class="textContainer">
      <h1>File Load Part c:</h1>
      <text-reader @load="text = $event"></text-reader>
      <br>
      <textarea rows="10" v-model="text"></textarea>
    </div>
    <div class="buttonContainer">
      <!-- <input
        type="button"
        id="saveButton"
        class="button"
        value="Save JSON"
        @click="lexemAnalyze"
      >
      <input
        type="button"
        id="displayButton"
        class="button"
        value="Display lexems"
        @click="outputT"
      > -->
      <button @click="lexemAnalyze" type="button" id="parseButton" class="button">Parse Program</button>
      <button @click="outputT" type="button" id="displayButton" class="button">Display lexems</button>
      <button @click="closeT" type="button" id="closeButton" class="button">Close lexems</button>
    </div>
    <div class="lexemTableOutput"></div>
  </div>
</template>

<script>
import TextReader from '@/components/TextReader.vue'
import {
  lexParser,
  lexemTable
} from '@/components/LexemAnalyzer/LexemAnalyzer.js'
// import { outputTable } from '@/utils/outputTable.js'

export default {
  data() {
    return {
      text: ''
    }
  },
  methods: {
    lexemAnalyze() {
      lexParser(this.text)
    },
    outputT() {
      let output = "<div class='container'>"
      output += "<table class='table'>"
      output += "<thead class='thead-dark'>"
      output += '<tr>'

      let keys = Object.keys(lexemTable[0])
      for (let i = 0; i < keys.length; i++) {
        output += "<th scope='col'>" + keys[i] + '</th>'
      }
      output += '</tr>'
      output += '</thead>'
      output += '<tbody>'

      for (let i = 0; i < lexemTable.length; i++) {
        output += '<tr>'
        for (let j = 0; j < keys.length; j++) {
          output += '<td>'
          let value = lexemTable[i][keys[j]]
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

      let el = document.getElementsByClassName('lexemTableOutput')[0]
      el.innerHTML = output
    },
    closeT() {
      let el = document.getElementsByClassName('lexemTableOutput')[0]
      el.innerHTML = ''
    }
  },
  components: {
    TextReader
  }
}
</script>

<style scoped>
textarea {
  resize: none;
}
.textContainer {
  width: 600px;
  margin: 0 auto;
}
.button {
  background-color: #212529;
  border: 2px solid #212529;
  /* outline: 2px solid #39b982; */
  display: inline-block;
  cursor: pointer;
  color: #ffffff;
  font-family: 'Montserrat', sans-serif;
  font-size: 18px;
  padding: 15px 30px;
  margin: 20px;
  text-decoration: none;
  font-weight: 700;
}
.button:hover {
  background-color: #32383e;
  border: 2px solid #32383e;
}
.button:active {
  background-color: #ffffff;
  color: #212529;
  border: 2px solid #39b982;
}
.buttonContainer {
  display: flex;
  justify-content: center;
  /* flex-direction: column; */
  margin-top: 10px;
}

/* LAB 4 stuff */
/* .tableItem:hover {
  background-color: rgba(0, 0, 0, 0.25);
}
.buttonContainer {
  display: none;
} */
</style>
