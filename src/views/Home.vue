<template>
  <div class="home">
    <div class="textContainer">
      <h1>Program Loader</h1>
      <hr>
      <div class="buttonContainer">
        <button @click="resetAll" type="button" id="resetAllButton">Reset</button>
      </div>

      <text-reader @load="programInput = $event"></text-reader>
      <br>
      <textarea rows="10" v-model="programInput"></textarea>
    </div>
    <div class="buttonContainer">
      <button @click="lexemAnalyze" type="button" id="parseLexButton">Parse Program</button>
      <button @click="saveLexems" type="button" id="saveLexButton">Save Lexems As</button>
      <input type="text" id="saveFile" name="saveFile" class="save-file-title" placeholder="lexems">
    </div>
    <hr>
    <div class="textContainer">
      <h1>JSON Lexem Loader</h1>
      <text-reader @load="lexems = $event"></text-reader>
      <br>
      <textarea rows="10" v-model="lexems"></textarea>
    </div>
    <hr>
    <div class="buttonContainer">
      <button @click="outputLexemTable" type="button" id="displayLexButton">Display lexems</button>
      <button @click="closeLexemTable" type="button" id="closeLexButton">Close lexems</button>
    </div>
    <hr>
    <div class="buttonContainer">
      <button @click="parseSARecursive" type="button" id="parseSARecursiveButton">Recursive Parse</button>
    </div>
    <hr>
    <div class="buttonContainer">
      <button @click="parseMPA" type="button" id="parseMPAButton">MPA Parse</button>
      <button @click="outputStateTable" type="button" id="displayStateButton">Display states</button>
      <button @click="closeStateTable" type="button" id="closeStateButton">Close states</button>
    </div>
    <hr>
    <div class="buttonContainer">
      <button @click="setRelations" type="button" id="setRelationsButton">Set relations</button>
      <!-- <button @click="openInNewTab('rel-table')" type="button">clicky thingy</button> -->
    </div>
    <hr>
    <div class="buttonContainer">
      <!-- <button @click="parseUprising" type="button" id="parseUprisingButton">Uprising Parse</button> -->
    </div>
    <div id="lexemTableOutput"></div>
    <div id="stateTableOutput"></div>
    <div id="relationTableOutput"></div>
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
import { setTimeout } from 'timers';

export default {
  data() {
    return {
      programInput: '',
      lexems: [],
      relationTable: [],
      rules: []
    }
  },
  methods: {
    resetAll() {
      this.programInput = ''
      this.lexems = []
      alert('Everything has been reset')
    },
    lexemAnalyze() {
      lexParser(this.programInput)
      this.lexems = lexemTableJSON
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

    parseSARecursive() {
      parserRecursive(this.lexems)
    },

    parseMPA() {
      parserMPA(this.lexems)
    },
    outputStateTable() {
      outputTable(stateTable, 'stateTableOutput')
    },
    closeStateTable() {
      let el = document.getElementById('stateTableOutput')
      el.innerHTML = ''
    },

    setRelations() {
      this.relationTable = relations(this.rules)
      console.log('Relation table:\n' + this.relationTable)
      console.log('Rules:\n' + this.rules)

      outputUprisingTable(this.relationTable, this.rules, 'relationTableOutput')

      // let win = window.open('rel', '_blank')
      // win.focus()
    },
    // openInNewTab(url) {
    //   let win = window.open(url, '_blank')
    //   win.focus()
    // }
  },
  computed: {},
  components: {
    TextReader
  }
}
</script>

<style scoped>
textarea {
  resize: none;
}
/* Line Numbering Fix */
textarea {
  background: url(http://i.imgur.com/2cOaJ.png);
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
