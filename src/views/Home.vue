<template>
  <div class="home">
    <div class="textContainer">
      <h1>Program Loader</h1>
      <text-reader @load="programInput = $event"></text-reader>
      <br>
      <textarea rows="10" v-model="programInput"></textarea>
    </div>
    <div class="buttonContainer">
      <button @click="lexemAnalyze" type="button" id="parseLexButton">Parse Program</button>
      <button @click="saveLexems" type="button" id="saveLexButton">Save Lexems As</button>
      
      <input type="text" id="saveFile" name="saveFile" class='save-file-title' placeholder="lexems">
    </div>
    <br>
    <div class="textContainer">
      <h1>JSON Lexem Loader</h1>
      <text-reader @load="lexems = $event"></text-reader>
      <br>
      <textarea rows="10" v-model="lexems"></textarea>
    </div>
    <div class="buttonContainer">
      <button @click="outputLexemTable" type="button" id="displayLexButton">Display lexems</button>
      <button @click="closeLexemTable" type="button" id="closeLexButton">Close lexems</button>
    </div>
    <div id="lexemTableOutput"></div>
  </div>
</template>

<script>
import TextReader from '@/components/TextReader.vue'
import {
  lexParser,
  lexemTableJSON
} from '@/components/LexemAnalyzer/LexemAnalyzer.js'
import outputTable from '@/utils/outputTable.js'

export default {
  data() {
    return {
      programInput: '',
      lexems: [],
    }
  },
  methods: {
    lexemAnalyze() {
      lexParser(this.programInput)
      this.lexems = lexemTableJSON
      console.log(this.lexems)
      console.log(this.programInput)
    },
    saveLexems() {
      // Download as a JSON file (WebAPI)
      let a = document.createElement('a')
      let file = new Blob([this.lexems], {type: 'text/plain;charset=utf-8'})
      a.href = URL.createObjectURL(file)
      // a.download = document.getElementById('saveFile').value
      let val = document.getElementById('saveFile').value
      a.download = val ? val + '.json' : 'lexems.json' 
      a.click()
    },
    outputLexemTable() {
      outputTable(this.lexems, 'lexemTableOutput', 'json')
    },
    closeLexemTable() {
      let el = document.getElementById('lexemTableOutput')
      el.innerHTML = ''
    }
  },
  computed: {
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
