<template>
  <div class="file-upload">
    <div class="file-select">
      <div class="file-select-button" id="fileName">Choose File</div>
      <div class="file-select-name noFile">No file chosen...</div>
      <input type="file" name="chooseFile" class="chosenFile" @change="loadTextFromFile">
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    loadTextFromFile(ev) {
      const file = ev.target.files[0]
      const reader = new FileReader()

      reader.onload = e => this.$emit('load', e.target.result)
      reader.readAsText(file)

      // Adding visual change to input
      const chosenFiles = document.getElementsByClassName('chosenFile')
      let filenames = [];
      
      for (let i = 0; i < chosenFiles.length; i++) {
        filenames[i] = chosenFiles[i].value

        if (/^\s*$/.test(filenames[i])) {
          document
            .getElementsByClassName('file-upload')[i]
            .classList.remove('active')
          document.getElementsByClassName('noFile')[i].innerHTML = 'No file chosen...'
        } else {
          document
            .getElementsByClassName('file-upload')[i]
            .classList.add('active')
          document.getElementsByClassName('noFile')[i].innerHTML = filenames[i].replace(
            'C:\\fakepath\\',
            ''
          )
        }
      }
    }
  }
}
</script>

<style>
.file-upload {
  display: block;
  text-align: center;
  font-family: 'Montserrat', sans-serif;
  font-weight: bold;
  font-size: 14px;
}
.file-upload .file-select {
  display: block;
  border: 2px solid #dce4ec;
  color: #34495e;
  cursor: pointer;
  height: 40px;
  line-height: 40px;
  text-align: left;
  background: #ffffff;
  overflow: hidden;
  position: relative;
}
.file-upload .file-select .file-select-button {
  background: #dce4ec;
  padding: 0 10px;
  display: inline-block;
  height: 40px;
  line-height: 40px;
}
.file-upload .file-select .file-select-name {
  line-height: 40px;
  display: inline-block;
  padding: 0 10px;
}
.file-upload .file-select:hover {
  border-color: #34495e;
  transition: all 0.2s ease-in-out;
  -moz-transition: all 0.2s ease-in-out;
  -webkit-transition: all 0.2s ease-in-out;
  -o-transition: all 0.2s ease-in-out;
}
.file-upload .file-select:hover .file-select-button {
  background: #34495e;
  color: #ffffff;
  transition: all 0.2s ease-in-out;
  -moz-transition: all 0.2s ease-in-out;
  -webkit-transition: all 0.2s ease-in-out;
  -o-transition: all 0.2s ease-in-out;
}
.file-upload.active .file-select {
  border-color: #39b982;
  transition: all 0.2s ease-in-out;
  -moz-transition: all 0.2s ease-in-out;
  -webkit-transition: all 0.2s ease-in-out;
  -o-transition: all 0.2s ease-in-out;
}
.file-upload.active .file-select .file-select-button {
  background: #39b982;
  color: #ffffff;
  transition: all 0.2s ease-in-out;
  -moz-transition: all 0.2s ease-in-out;
  -webkit-transition: all 0.2s ease-in-out;
  -o-transition: all 0.2s ease-in-out;
}
.file-upload .file-select input[type='file'] {
  z-index: 100;
  cursor: pointer;
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  opacity: 0;
  filter: alpha(opacity=0);
}
.file-upload .file-select.file-select-disabled {
  opacity: 0.65;
}
.file-upload .file-select.file-select-disabled:hover {
  cursor: default;
  display: block;
  border: 2px solid #dce4ec;
  color: #34495e;
  cursor: pointer;
  height: 40px;
  line-height: 40px;
  margin-top: 5px;
  text-align: left;
  background: #ffffff;
  overflow: hidden;
  position: relative;
}
.file-upload .file-select.file-select-disabled:hover .file-select-button {
  background: #dce4ec;
  color: #666666;
  padding: 0 10px;
  display: inline-block;
  height: 40px;
  line-height: 40px;
}
.file-upload .file-select.file-select-disabled:hover .file-select-name {
  line-height: 40px;
  display: inline-block;
  padding: 0 10px;
}
</style>