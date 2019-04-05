<template>
  <div class="home">
    <div class="textContainer">
      <h1>Program Loader</h1>
      <text-reader @load="programInput = $event"></text-reader>
      <br>
      <textarea rows="10" v-model="programInput"></textarea>
    </div>
    <div class="buttonContainer">
      <button @click="lexemAnalyze" type="button" id="parseButton" class="button">Parse Program</button>
    </div>
    <br>
    <div class="textContainer">
      <h1>JSON Lexem Loader</h1>
      <text-reader @load="lexems = $event"></text-reader>
      <br>
      <textarea rows="10" v-model="lexems"></textarea>
    </div>
    <div class="buttonContainer">
      <button @click="outputLexemTable" type="button" id="displayButton" class="button">Display lexems</button>
      <button @click="closeLexemTable" type="button" id="closeButton" class="button">Close lexems</button>
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
    },
    outputLexemTable() {
      outputTable(this.lexems, 'lexemTableOutput', 'json')
    },
    closeLexemTable() {
      let el = document.getElementById('lexemTableOutput')
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
}

/* LAB 4 stuff */
/* .tableItem:hover {
  background-color: rgba(0, 0, 0, 0.25);
}
.buttonContainer {
  display: none;
} */
</style>
