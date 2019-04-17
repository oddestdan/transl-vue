<template>
  <div class="home">
    <!-- Reset Button -->
    <div class="resetButtonContainer"><button @click="resetAll" type="button" id="resetAllButton">Reset</button></div>

    <div class="centerColContainer">
      <div class="textContainer">
        <h1>Program Loader</h1>
        <hr>

        <text-reader @load="programInput = $event"></text-reader>
        <br>
        <textarea rows="10" v-model="programInput"></textarea>
      </div>
    </div>

    <div class="buttonContainer">
      <button @click="lexemAnalyze" type="button" id="parseLexButton">Parse Program</button>
      <button @click="saveLexems" type="button" id="saveLexButton">Save Lexems As</button>
      <input type="text" id="saveFile" name="saveFile" class="save-file-title" placeholder="lexems">
    </div>
    <hr>

    <div class="splitter centerRowContainer">
      <div class="centerColContainer">
        <h1>Syntax Parser</h1>
        <select
        name="parserSelect"
        id="parserSelect"
        v-model="selectedParser"
        >
          <option value="Recursive">Recursive</option>
          <option value="MPA">MPA</option>
          <option value="Uprising">Uprising</option>
        </select>
        <button @click="parse" type="button" id="displayLexButton">{{ selectedParser }}</button>
      </div>

      <div class="textContainer">
        <h1>JSON Lexem Loader</h1>
        <text-reader @load="lexems = $event"></text-reader>
        <br>
        <textarea rows="10" v-model="lexems"></textarea>
      </div>
    </div>

    <div class="buttonContainer">
      <button @click="outputLexemTable" type="button" id="displayLexButton">Display lexems</button>
      <button @click="closeLexemTable" type="button" id="closeLexButton">Close lexems</button>
    </div>
    <div class="buttonContainer">
      <button @click="setRelations" type="button" id="setRelationsButton">Set relations</button>
    </div>
    <div id="lexemTableOutput"></div>
    <div id="stateTableOutput"></div>
    <div id="relationTableOutput"></div>
    <div id="syntaxTableOutput"></div>
  </div>
</template>

<script>
import TextReader from '@/components/TextReader.vue'
import {
  lexParser,
  lexemTableJSON
} from '@/components/LexemAnalyzer/LexemAnalyzer.js'
import { parserRecursive } from '@/components/SyntaxAnalyzer/Recursive/SARecursive.js'
import { parserMPA, stateTable } from '@/components/SyntaxAnalyzer/MPA/SAMPA.js'
import outputTable from '@/utils/outputTable.js'
import relations from '@/components/SyntaxAnalyzer/Uprising/relations.js'
import outputUprisingTable from '@/utils/outputUprisingTable.js'
import parserUprising from '@/components/SyntaxAnalyzer/Uprising/SAUprising.js'

export default {
  data() {
    return {
      programInput: '',
      lexems: [],
      relationTable: [],
      rules: [],
      
      selectedParser: 'Recursive'
    }
  },
  methods: {
    resetAll() {
      this.programInput = ''
      this.lexems = []
      console.log('PI:\n' + this.programInput)
      console.log('Lex:\n' + this.lexems)
      alert('Everything has been reset')
    },
    lexemAnalyze() {
      this.lexems = [] // reset
      lexParser(this.programInput)
      this.lexems = lexemTableJSON
      console.log('Lex:\n' + this.lexems)
    },
    saveLexems() {
      // Download as a JSON file (WebAPI)
      let a = document.createElement('a')
      const file = new Blob([this.lexems], { type: 'text/plain;charset=utf-8' })
      a.href = URL.createObjectURL(file)
      const val = document.getElementById('saveFile').value
      a.download = val ? val + '.json' : 'lexems.json'
      a.click()
    },
    outputLexemTable() {
      outputTable(this.lexems, 'lexemTableOutput', 'json')
    },
    closeLexemTable() {
      let el = document.getElementById('lexemTableOutput')
      el.innerHTML = ''
    },

    parse() {
      switch (this.selectedParser) {
        case 'Recursive':
          parserRecursive(this.lexems)
          break
        case 'MPA':
          if (parserMPA(this.lexems)) {
            window.open('state', '_blank').focus()
          }
          break
        case 'Uprising':
          // temporary
          [this.relationTable, this.rules] = relations(this.rules)
          // outputUprisingTable(this.relationTable, this.rules, 'relationTableOutput')

          let syntaxTable = parserUprising(this.lexems, this.relationTable, this.rules)
          outputTable(syntaxTable, 'syntaxTableOutput', 'text', true)
          break
        default:
          parserRecursive(this.lexems)
          break
      }
    },

    setRelations() {
      [this.relationTable, this.rules] = relations(this.rules)
      // outputUprisingTable(this.relationTable, this.rules, 'relationTableOutput')
      // let win = window.open('rel', '_blank')
      // win.focus()
    },
  },
  computed: {},
  components: {
    TextReader
  }
}
</script>

<style scoped>
.splitter {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  width: 100%;
}

textarea {
  resize: none;
}
/* Line Numbering Fix */
textarea {
  background: url(http://i.imgur.com/2cOaJ.png);
  background: url('../assets/rows.png');
  background-attachment: local;
  background-repeat: no-repeat;
  padding-left: 35px;
  padding-top: 10px;
  border-color: #ccc;
  font: 14px 'Open-Sans', sans-serif;
}
button {
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
#resetAllButton {
  background-color: orangered;
  border: 2px solid transparent;
}
button:hover {
  background-color: #32383e;
  border: 2px solid #32383e;
}
button:active {
  background-color: #ffffff;
  color: #212529;
  border: 2px solid #39b982;
}
.buttonContainer {
  display: flex;
  justify-content: center;
  align-items: center;
  /* flex-direction: column; */
}
.save-file-title {
  width: 300px;
  height: 100%;
  padding: 15px 10px;
}

/* LAB 4 stuff */
/* .tableItem:hover {
  background-color: rgba(0, 0, 0, 0.25);
}
.buttonContainer {
  display: none;
} */
</style>
